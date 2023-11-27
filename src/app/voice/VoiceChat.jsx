import {
  createSpeechRecognition,
  normalizeText,
  SpeechRecognitionBase,
  MicManager,
  Transcript,
} from "ai-jsx/lib/asr/asr";
import {
  createTextToSpeech,
  BuildUrlOptions,
  TextToSpeechBase,
  TextToSpeechProtocol,
} from "ai-jsx/lib/tts/tts";
import {
  createLocalTracks,
  DataPacket_Kind,
  LocalAudioTrack,
  RemoteAudioTrack,
  RemoteTrack,
  Room,
  RoomEvent,
  Track,
  TrackEvent,
} from "livekit-client";

const DEFAULT_ASR_FRAME_SIZE = 20;

async function getAsrToken(provider) {
  const response = await fetch("/asr/api", {
    method: "POST",
    body: JSON.stringify({ provider }),
  });
  const json = await response.json();
  return json.token;
}

async function getTtsToken(provider) {
  const response = await fetch("/tts/api/token/edge", {
    method: "POST",
    body: JSON.stringify({ provider }),
  });
  const json = await response.json();
  return json.token;
}

function buildTtsUrl(options) {
  const runtime = options.provider.endsWith("-grpc") ? "nodejs" : "edge";
  const params = new URLSearchParams();
  Object.entries(options).forEach(
    ([k, v]) => v != undefined && params.set(k, v.toString())
  );
  return `/tts/api/generate/${runtime}?${params}`;
}

export class ChatMessage {
  constructor(role, content, conversationId) {
    this.role = role;
    this.content = content;
    this.conversationId = conversationId;
  }
}

function jsonLinesTransformer() {
  let buffer = "";
  return new TransformStream({
    async transform(chunk, controller) {
      buffer += chunk;
      const lines = buffer.split("\n");
      buffer = lines.pop();
      for (const line of lines) {
        if (line.trim()) {
          controller.enqueue(JSON.parse(line));
        }
      }
    },
  });
}

export class ChatRequest {
  constructor(inMessages, model, agentId, docs, active) {
    this.outMessage = "";
    this.conversationId = inMessages.find(
      (m) => m.conversationId
    )?.conversationId;
    this.done = false;
    this.onUpdate = undefined;
    this.onComplete = undefined;
    this.startMillis = undefined;
    this.requestLatency = undefined;
    this.streamLatency = undefined;
    this.inMessages = inMessages;
    this.model = model;
    this.agentId = agentId;
    this.docs = docs;
    this.active = active;
  }

  async start() {
    console.log(
      `[chat] calling agent for "${this.inMessages.at(-1)?.content}"`
    );
    if (this.model === "fixie") {
      await this.startWithFixie(this.agentId);
    } else {
      await this.startWithLlm(this.agentId);
    }
  }

  async startWithLlm(agentId) {
    this.startMillis = performance.now();

    const res = await fetch("/agent/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: this.inMessages,
        model: this.model,
        agentId,
        docs: this.docs,
      }),
    });
    const reader = res.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        this.ensureComplete();
        break;
      }
      const newText = new TextDecoder().decode(value);
      if (newText.trim() && this.requestLatency === undefined) {
        this.requestLatency = performance.now() - this.startMillis;
        console.log(
          `[chat] received agent response, latency=${this.requestLatency.toFixed(
            0
          )} ms`
        );
      }

      this.outMessage += newText;
      this.onUpdate?.(this, newText);
    }
  }

  async startWithFixie(agentId) {
    this.startMillis = performance.now();

    let isStartConversationRequest;
    let response;
    if (this.conversationId) {
      isStartConversationRequest = false;
      response = await fetch(
        `https://api.fixie.ai/api/v1/agents/${agentId}/conversations/${this.conversationId}/messages`,
        {
          method: "POST",
          body: JSON.stringify({
            message: this.inMessages.at(-1).content,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      isStartConversationRequest = true;
      response = await fetch(
        `https://api.fixie.ai/api/v1/agents/${agentId}/conversations`,
        {
          method: "POST",
          body: JSON.stringify({
            message: this.inMessages.at(-1).content,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );
      this.conversationId = response.headers.get("X-Fixie-Conversation-Id");
      console.log(
        `To view conversation transcript see https://embed.fixie.ai/agents/${agentId}/conversations/${this.conversationId}`
      );
    }

    const reader = response.body
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(jsonLinesTransformer())
      .getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        this.ensureComplete();
        break;
      }

      if (!this.done) {
        const currentTurn = isStartConversationRequest
          ? value.turns.at(-1)
          : value;

        const textMessages = currentTurn.messages.filter(
          (m) => m.kind === "text"
        );
        let currentMessage = "";
        for (const textMessage of textMessages) {
          currentMessage += textMessage.content;
          const messageState = textMessage.state;
          if (messageState === "in-progress") {
            break;
          } else if (messageState === "done") {
            currentMessage += "\n\n";
          }
        }

        let i = 0;
        while (
          i < currentMessage.length &&
          i < this.outMessage.length &&
          currentMessage[i] === this.outMessage[i]
        ) {
          i++;
        }
        if (i !== this.outMessage.length) {
          console.error("Result was not an append to the previous result.");
        }
        const delta = currentMessage.slice(i);

        if (delta.trim() && this.requestLatency === undefined) {
          this.requestLatency = performance.now() - this.startMillis;
          console.log(
            `Got Fixie response, latency=${this.requestLatency.toFixed(0)}`
          );
        }

        this.outMessage = currentMessage;
        this.onUpdate?.(this, delta);

        if (currentTurn.state === "done") {
          this.ensureComplete();
          break;
        }
      }
    }
  }
  ensureComplete() {
    if (!this.done) {
      this.done = true;
      if (this.startMillis !== undefined && this.requestLatency !== undefined) {
        this.streamLatency =
          performance.now() - this.startMillis - this.requestLatency;
      }
    }
  }
}

var ChatManagerState = {
  IDLE: "idle",
  LISTENING: "listening",
  THINKING: "thinking",
  SPEAKING: "speaking",
};

var ChatManagerInit = {
  asrProvider: "",
  ttsProvider: "",
  model: "",
  agentId: "",
  docs: false,
  asrLanguage: "",
  ttsModel: "",
  ttsVoice: "",
  webrtc: false,
};

var ChatManager = {
  onStateChange: function (state) {},
  onInputChange: function (text, final, latency) {},
  onOutputChange: function (text, final, latency) {},
  onAudioGenerate: function (latency) {},
  onAudioStart: function (latency) {},
  onAudioEnd: function () {},
  onError: function () {},

  state: ChatManagerState.IDLE,
  inputAnalyzer: null,
  outputAnalyzer: null,
  start: function (initialMessage) {},
  stop: function () {},
  interrupt: function () {},
};

function LocalChatManager(params) {
  this._state = ChatManagerState.IDLE;
  this.history = [];
  this.pendingRequests = new Map();
  this.micManager = new MicManager();
  this.asr = createSpeechRecognition({
    provider: params.asrProvider,
    manager: this.micManager,
    getToken: getAsrToken,
    language: params.asrLanguage,
  });
  var ttsSplit = params.ttsProvider.split("-");
  this.tts = createTextToSpeech({
    provider: ttsSplit[0],
    proto: ttsSplit[1],
    getToken: getTtsToken,
    buildUrl: buildTtsUrl,
    model: params.ttsModel,
    voice: params.ttsVoice,
    rate: 1.2,
  });
  this.model = params.model;
  this.agentId = params.agentId;
  this.docs = params.docs;
  this.asr.addEventListener(
    "transcript",
    function (evt) {
      this.handleTranscript(evt);
    }.bind(this)
  );
  this.tts.onGenerating = function () {
    this.handleGenerationStart();
  }.bind(this);
  this.tts.onPlaying = function () {
    this.handlePlaybackStart();
  }.bind(this);
  this.tts.onComplete = function () {
    this.handlePlaybackComplete();
  }.bind(this);
}

LocalChatManager.prototype.state = function () {
  return this._state;
};
LocalChatManager.prototype.inputAnalyzer = function () {
  return this.micManager.analyzer;
};
LocalChatManager.prototype.outputAnalyzer = function () {
  return this.tts.analyzer;
};

LocalChatManager.prototype.start = async function (initialMessage) {
  await this.micManager.startMic(
    DEFAULT_ASR_FRAME_SIZE,
    function () {
      console.warn("[chat] Mic stream closed unexpectedly");
      if (this.onError) {
        this.onError();
      }
    }.bind(this)
  );
  this.asr.start();
  if (initialMessage !== undefined) {
    this.handleInputUpdate(initialMessage, true);
  } else {
    this.changeState(ChatManagerState.LISTENING);
  }
};
LocalChatManager.prototype.stop = function () {
  this.changeState(ChatManagerState.IDLE);
  this.asr.close();
  this.tts.close();
  this.micManager.stop();
  this.history = [];
  this.pendingRequests.clear();
};

LocalChatManager.prototype.interrupt = function () {
  if (
    this._state == ChatManagerState.THINKING ||
    this._state == ChatManagerState.SPEAKING
  ) {
    this.cancelRequests();
    this.tts.stop();
    this.micManager.isEnabled = true;
    this.changeState(ChatManagerState.LISTENING);
  }
};

LocalChatManager.prototype.changeState = function (state) {
  if (state != this._state) {
    console.log(`[chat] ${this._state} -> ${state}`);
    this._state = state;
    if (this.onStateChange) {
      this.onStateChange(state);
    }
  }
};

LocalChatManager.prototype.handleTranscript = function (evt) {
  if (
    this._state != ChatManagerState.LISTENING &&
    this._state != ChatManagerState.THINKING
  )
    return;
  var obj = evt.detail;
  this.handleInputUpdate(obj.text, obj.final, obj.observedLatency);
};

LocalChatManager.prototype.handleInputUpdate = function (text, final, latency) {
  var normalized = normalizeText(text);
  var request = this.pendingRequests.get(normalized);
  var adjustedLatency = latency;
  if (adjustedLatency && final && request) {
    adjustedLatency -= performance.now() - request.startMillis;
  }
  console.log(
    `[chat] asr transcript="${normalized}" ${request ? "HIT" : "MISS"}${
      final ? " FINAL" : ""
    } latency=${adjustedLatency?.toFixed(0)} ms`
  );
  if (this.onInputChange) {
    this.onInputChange(text, final, latency);
  }

  if (!final && this.micManager.isVoiceActive) {
    return;
  }

  this.changeState(ChatManagerState.THINKING);

  var userMessage = new ChatMessage("user", text.trim());
  var newMessages = [...this.history, userMessage];
  if (final) {
    this.history = newMessages;
    this.micManager.isEnabled = false;
  }

  var supportsSpeculativeExecution = this.model !== "fixie";
  if (!request && (final || supportsSpeculativeExecution)) {
    this.dispatchRequest(normalized, newMessages, final);
  } else if (final) {
    this.activateRequest(request);
  }
};
LocalChatManager.prototype.dispatchRequest = function (
  normalized,
  messages,
  final
) {
  var request = new ChatRequest(
    messages,
    this.model,
    this.agentId,
    this.docs,
    final
  );
  request.onUpdate = function (request, newText) {
    this.handleRequestUpdate(request, newText);
  }.bind(this);
  request.onComplete = function (request) {
    this.handleRequestDone(request);
  }.bind(this);
  this.pendingRequests.set(normalized, request);
  request.start();
};
LocalChatManager.prototype.activateRequest = function (request) {
  request.active = true;
  this.tts.play(request.outMessage);
  if (!request.done) {
    if (this.onOutputChange) {
      this.onOutputChange(request.outMessage, false, request.requestLatency);
    }
  } else {
    this.finishRequest(request);
  }
};
LocalChatManager.prototype.cancelRequests = function () {
  for (var request of this.pendingRequests.values()) {
    request.active = false;
  }
  this.pendingRequests.clear();
};
LocalChatManager.prototype.handleRequestUpdate = function (request, newText) {
  if (request.active) {
    if (this.onOutputChange) {
      this.onOutputChange(request.outMessage, false, request.requestLatency);
    }
    this.tts.play(newText);
  }
};
LocalChatManager.prototype.handleRequestDone = function (request) {
  if (request.active) {
    this.finishRequest(request);
  }
};
LocalChatManager.prototype.finishRequest = function (request) {
  this.tts.flush();
  var assistantMessage = new ChatMessage(
    "assistant",
    request.outMessage,
    request.conversationId
  );
  this.history.push(assistantMessage);
  this.pendingRequests.clear();
  if (this.onOutputChange) {
    this.onOutputChange(request.outMessage, true, request.requestLatency);
  }
};
LocalChatManager.prototype.handleGenerationStart = function () {
  if (this._state != ChatManagerState.THINKING) return;
  if (this.onAudioGenerate) {
    this.onAudioGenerate(this.tts.bufferLatency);
  }
};
LocalChatManager.prototype.handlePlaybackStart = function () {
  if (this._state != ChatManagerState.THINKING) return;
  this.changeState(ChatManagerState.SPEAKING);
  if (this.onAudioStart) {
    this.onAudioStart(this.tts.latency - this.tts.bufferLatency);
  }
};
LocalChatManager.prototype.handlePlaybackComplete = function () {
  if (this._state != ChatManagerState.SPEAKING) return;
  if (this.onAudioEnd) {
    this.onAudioEnd();
  }
  this.micManager.isEnabled = true;
  this.changeState(ChatManagerState.LISTENING);
};
export class StreamAnalyzer {
  constructor(context, stream) {
    this.source = context.createMediaStreamSource(stream);
    this.analyzer = context.createAnalyser();
    this.source.connect(this.analyzer);
  }
  stop() {
    this.source.disconnect();
  }
}

export class WebRtcChatManager {
  constructor(params) {
    this.params = params;
    this.audioContext = new AudioContext();
    this.audioElement = new Audio();
    this.textEncoder = new TextEncoder();
    this.textDecoder = new TextDecoder();
    this._state = ChatManagerState.IDLE;
    this.onStateChange = null;
    this.onInputChange = null;
    this.onOutputChange = null;
    this.onAudioGenerate = null;
    this.onAudioStart = null;
    this.onAudioEnd = null;
    this.onError = null;
    this.audioElement = new Audio();
    this.warmup();
  }
  get state() {
    return this._state;
  }
  get inputAnalyzer() {
    return this.inAnalyzer ? this.inAnalyzer.analyzer : null;
  }
  get outputAnalyzer() {
    return this.outAnalyzer ? this.outAnalyzer.analyzer : null;
  }
  warmup() {
    const isLocalHost = window.location.hostname === "localhost";
    const url = !isLocalHost ? "wss://wsapi.fixie.ai" : "ws://localhost:8100";
    this.socket = new WebSocket(url);
    this.socket.onopen = () => this.handleSocketOpen();
    this.socket.onmessage = (event) => this.handleSocketMessage(event);
    this.socket.onclose = (event) => this.handleSocketClose(event);
  }
  async start() {
    console.log("[chat] starting");
    this.audioElement.play();
    const localTracks = await createLocalTracks({ audio: true, video: false });
    this.localAudioTrack = localTracks[0];
    console.log("[chat] got mic stream");
    this.inAnalyzer = new StreamAnalyzer(
      this.audioContext,
      this.localAudioTrack.mediaStream
    );
    this.pinger = setInterval(() => {
      const obj = { type: "ping", timestamp: performance.now() };
      this.sendData(obj);
    }, 5000);
    this.maybePublishLocalAudio();
    this.changeState(ChatManagerState.LISTENING);
  }
  async stop() {
    console.log("[chat] stopping");
    clearInterval(this.pinger);
    this.pinger = undefined;
    (await this.room) && this.room.disconnect();
    this.room = undefined;
    this.inAnalyzer && this.inAnalyzer.stop();
    this.outAnalyzer && this.outAnalyzer.stop();
    this.inAnalyzer = undefined;
    this.outAnalyzer = undefined;
    this.localAudioTrack && this.localAudioTrack.stop();
    this.localAudioTrack = undefined;
    this.socket && this.socket.close();
    this.socket = undefined;
    this.changeState(ChatManagerState.IDLE);
  }
  interrupt() {
    console.log("[chat] interrupting");
    const obj = { type: "interrupt" };
    this.sendData(obj);
  }
  changeState(state) {
    if (state != this._state) {
      console.log(`[chat] ${this._state} -> ${state}`);
      this._state = state;
      this.onStateChange && this.onStateChange(state);
    }
  }
  maybePublishLocalAudio() {
    if (this.room && this.room.state == "connected" && this.localAudioTrack) {
      console.log(`[chat] publishing local audio track`);
      const opts = {
        name: "audio",
        simulcast: false,
        source: Track.Source.Microphone,
      };
      this.room.localParticipant.publishTrack(this.localAudioTrack, opts);
    }
  }
  sendData(obj) {
    this.room &&
      this.room.localParticipant.publishData(
        this.textEncoder.encode(JSON.stringify(obj)),
        DataPacket_Kind.RELIABLE
      );
  }
  handleSocketOpen() {
    console.log("[chat] socket opened");
    const obj = {
      type: "init",
      params: {
        asr: {
          provider: this.params.asrProvider,
          language: this.params.asrLanguage,
        },
        tts: {
          provider: this.params.ttsProvider,
          model: this.params.ttsModel,
          voice: this.params.ttsVoice,
        },
        agent: {
          model: this.params.model,
          agentId: this.params.agentId,
          docs: this.params.docs,
        },
      },
    };
    this.socket && this.socket.send(JSON.stringify(obj));
  }
  async handleSocketMessage(event) {
    const msg = JSON.parse(event.data);
    switch (msg.type) {
      case "room_info":
        this.room = new Room();
        await this.room.connect(msg.roomUrl, msg.token);
        console.log("[chat] connected to room", msg.roomUrl);
        this.maybePublishLocalAudio();
        this.room.on(RoomEvent.TrackSubscribed, (track) =>
          this.handleTrackSubscribed(track)
        );
        this.room.on(RoomEvent.DataReceived, (payload, participant) =>
          this.handleDataReceived(payload, participant)
        );
        break;
      default:
        console.warn("unknown message type", msg.type);
    }
  }
  handleSocketClose(event) {
    console.log(
      `[chat] socket closed, code=${event.code}, reason=${event.reason}`
    );
  }
  handleTrackSubscribed(track) {
    console.log(`[chat] subscribed to remote audio track ${track.sid}`);
    const audioTrack = track;
    audioTrack.on(TrackEvent.AudioPlaybackStarted, () =>
      console.log(`[chat] audio playback started`)
    );
    audioTrack.on(TrackEvent.AudioPlaybackFailed, (err) =>
      console.error(`[chat] audio playback failed`, err)
    );
    audioTrack.attach(this.audioElement);
    this.outAnalyzer = new StreamAnalyzer(this.audioContext, track.mediaStream);
  }
  handleDataReceived(payload, participant) {
    const data = JSON.parse(this.textDecoder.decode(payload));
    if (data.type === "pong") {
      const elapsed_ms = performance.now() - data.timestamp;
      console.debug(`[chat] worker RTT: ${elapsed_ms.toFixed(0)} ms`);
    } else if (data.type === "state") {
      const newState = data.state;
      this.changeState(newState);
    } else if (data.type === "transcript") {
      console.log(`[chat] transcript: ${data.text}`);
    } else if (data.type === "output") {
      console.log(`[chat] output: ${data.text}`);
    }
  }
}

export function createChatManager(init) {
  if (init.webrtc) {
    return new WebRtcChatManager(init);
  } else {
    return new LocalChatManager(init);
  }
}
