/*
"use client";
var React = require("react");
var useCallback = React.useCallback;
var useEffect = React.useEffect;
var useRef = React.useRef;
var useState = React.useState;
var useSearchParams = require("next/navigation").useSearchParams;
var useSwipeable = require("react-swipeable").useSwipeable;
var ChatManager = require("./chat").ChatManager;
var ChatManagerState = require("./chat").ChatManagerState;
var createChatManager = require("./chat").createChatManager;
var getAgent = require("./agents").getAgent;
var getAgentImageUrl = require("./agents").getAgentImageUrl;
var Image = require("next/image");
require("../globals.css");
// 1. VAD triggers silence. (Latency here is frame size + VAD delay)
// 2. ASR sends partial transcript. ASR latency = 2-1.
// 3. ASR sends final transcript. ASR latency = 3-1.
// 4. LLM request is made. This can happen before 3 is complete, in which case the speculative execution savings is 3-2.
// 5. LLM starts streaming tokens. LLM base latency = 5-4.
// 6. LLM sends enough tokens for TTS to start (full sentence, or 50 chars). LLM token latency = 6-5, LLM total latency = 6-4.
// 7. TTS requests chunk of audio.
// 8. TTS chunk is received.
// 9. TTS playout starts (usually just about instantaneous after 8). TTS latency = 9-7.
// Total latency = 9-1 = ASR latency + LLM base latency + LLM token latency TTS latency - speculative execution savings.

// Token per second rules of thumb:
// GPT-4: 12 tps (approx 1s for 50 chars)
// GPT-3.5: 70 tps (approx 0.2s for 50 chars)
// Claude v1: 40 tps (approx 0.4s for 50 chars)
// Claude Instant v1: 70 tps (approx 0.2s for 50 chars)

var LatencyThreshold = {
  good: "number",
  fair: "number",
};

var DEFAULT_ASR_PROVIDER = "deepgram";
var DEFAULT_TTS_PROVIDER = "playht";
var DEFAULT_LLM = "gpt-4-1106-preview";
var ASR_PROVIDERS = ["aai", "deepgram", "gladia", "revai", "soniox"];
var TTS_PROVIDERS = [
  "aws",
  "azure",
  "eleven",
  "eleven-ws",
  "gcp",
  "lmnt",
  "lmnt-ws",
  "murf",
  "openai",
  "playht",
  "resemble",
  "wellsaid",
];
var LLM_MODELS = [
  "claude-2",
  "claude-instant-1",
  "gpt-4",
  "gpt-4-32k",
  "gpt-4-1106-preview",
  "gpt-3.5-turbo",
  "gpt-3.5-turbo-16k",
];
var AGENT_IDS = ["ai-friend", "dr-donut", "rubber-duck"]; //, 'spanish-tutor', 'justin/ultravox', 'justin/fixie'];
var LATENCY_THRESHOLDS = {
  ASR: { good: 300, fair: 500 },
  LLM: { good: 300, fair: 500 },
  LLMT: { good: 300, fair: 400 },
  TTS: { good: 400, fair: 600 },
  Total: { good: 1300, fair: 2000 },
};

var updateSearchParams = function (param, value) {
  var params = new URLSearchParams(window.location.search);
  params.set(param, value);
  window.location.search = params.toString();
};

var Dropdown = function (props) {
  var param = props.param;
  var label = props.label;
  var value = props.value;
  var options = props.options;
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "label",
      { className: "text-xs ml-2 font-bold" },
      label
    ),
    React.createElement(
      "select",
      {
        value: value,
        onChange: function (e) {
          return updateSearchParams(param, e.target.value);
        },
        className: "text-xs ml-1 pt-1 pb-1 border rounded",
      },
      options.map(function (option) {
        return React.createElement(
          "option",
          { key: option, value: option },
          option
        );
      })
    )
  );
};

var Stat = function (props) {
  var name = props.name;
  var latency = props.latency;
  var valueText = (latency ? `${latency.toFixed(0)}` : "-").padStart(4, " ");
  for (var i = valueText.length; i < 4; i++) {
    valueText = " " + valueText;
  }
  var color =
    latency < LATENCY_THRESHOLDS[name].good
      ? ""
      : latency < LATENCY_THRESHOLDS[name].fair
      ? "text-yellow-500"
      : "text-red-500";
  return React.createElement(
    "span",
    { className: `font-mono text-xs mr-2 ${color}` },
    " ",
    React.createElement("span", { className: "font-bold" }, name),
    React.createElement("pre", { className: "inline" }, valueText),
    " ms"
  );
};

var Visualizer = function (props) {
  var width = props.width;
  var height = props.height;
  var state = props.state;
  var inputAnalyzer = props.inputAnalyzer;
  var outputAnalyzer = props.outputAnalyzer;
  var canvasRef = useRef(null);
  if (canvasRef.current) {
    canvasRef.current.width = canvasRef.current.offsetWidth;
    canvasRef.current.height = canvasRef.current.offsetHeight;
  }
  if (inputAnalyzer) {
    inputAnalyzer.fftSize = 64;
    inputAnalyzer.maxDecibels = 0;
    inputAnalyzer.minDecibels = -70;
  }
  if (outputAnalyzer) {
    // We use a larger FFT size for the output analyzer because it's typically fullband,
    // versus the wideband input analyzer, resulting in a similar bin size for each.
    // Then, when we grab the lowest 16 bins from each, we get a similar spectrum.
    outputAnalyzer.fftSize = 256;
    outputAnalyzer.maxDecibels = 0;
    outputAnalyzer.minDecibels = -70;
  }
  var draw = function (canvas, state, freqData) {
    var ctx = canvas.getContext("2d");
    var marginWidth = 2;
    var barWidth = canvas.width / freqData.length - marginWidth * 2;
    var totalWidth = barWidth + marginWidth * 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    freqData.forEach(function (freqVal, i) {
      var barHeight = (freqVal * canvas.height) / 128;
      var x = barHeight + 25 * (i / freqData.length);
      var y = 250 * (i / freqData.length);
      var z = 50;
      if (state == ChatManagerState.LISTENING) {
        ctx.fillStyle = `rgb(${x},${y},${z})`;
      } else if (state == ChatManagerState.THINKING) {
        ctx.fillStyle = `rgb(${z},${x},${y})`;
      } else if (state == ChatManagerState.SPEAKING) {
        ctx.fillStyle = `rgb(${y},${z},${x})`;
      }
      ctx.fillRect(
        i * totalWidth + marginWidth,
        canvas.height - barHeight,
        barWidth,
        barHeight
      );
    });
  };
  var render = useCallback(
    function () {
      var freqData = new Uint8Array(0);
      switch (state) {
        case ChatManagerState.LISTENING:
          if (!inputAnalyzer) return;
          freqData = new Uint8Array(inputAnalyzer.frequencyBinCount);
          inputAnalyzer.getByteFrequencyData(freqData);
          freqData = freqData.slice(0, 16);
          break;
        case ChatManagerState.THINKING:
          freqData = new Uint8Array(16);
          // make the data have random pulses based on performance.now, which decay over time
          var now = performance.now();
          for (var i = 0; i < freqData.length; i++) {
            freqData[i] =
              Math.max(0, Math.sin((now - i * 100) / 100) * 128 + 128) / 2;
          }
          break;
        case ChatManagerState.SPEAKING:
          if (!outputAnalyzer) return;
          freqData = new Uint8Array(outputAnalyzer.frequencyBinCount);
          outputAnalyzer.getByteFrequencyData(freqData);
          freqData = freqData.slice(0, 16);
          break;
      }
      draw(canvasRef.current, state || ChatManagerState.IDLE, freqData);
      requestAnimationFrame(render);
    },
    [state, inputAnalyzer, outputAnalyzer]
  );
  useEffect(
    function () {
      return render();
    },
    [state]
  );
  var className = "";
  if (!width) className += " w-full";
  if (!height) className += " h-full";
  return React.createElement("canvas", {
    className: className,
    ref: canvasRef,
    width: width,
    height: height,
  });
};

var Button = function (props) {
  var onClick = props.onClick;
  var disabled = props.disabled;
  var children = props.children;
  return React.createElement(
    "button",
    {
      onClick: onClick,
      disabled: disabled,
      className: `${
        disabled ? "bg-gray-300" : "bg-fixie-charcoal hover:bg-fixie-dark-gray"
      } rounded-md px-4 py-2 text-md font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fixie-fresh-salmon`,
    },
    children
  );
};

var AgentPageComponent = function () {
  var searchParams = useSearchParams();
  var agentId = searchParams.get("agent") || "dr-donut";
  var agentVoice = getAgent(agentId).ttsVoice;
  var tapOrClick =
    typeof window != "undefined" && "ontouchstart" in window ? "Tap" : "Click";
  var idleText = `${tapOrClick} anywhere to start!`;
  var asrProvider = searchParams.get("asr") || DEFAULT_ASR_PROVIDER;
  var asrLanguage = searchParams.get("asrLanguage") || undefined;
  var ttsProvider = searchParams.get("tts") || DEFAULT_TTS_PROVIDER;
  var ttsModel = searchParams.get("ttsModel") || undefined;
  var ttsVoice = searchParams.get("ttsVoice") || agentVoice;
  var model =
    getAgent(agentId) === undefined
      ? "fixie"
      : searchParams.get("llm") || DEFAULT_LLM;
  var docs = searchParams.get("docs") !== null;
  var webrtc = searchParams.get("webrtc") !== null;
  var showChooser = useState(searchParams.get("chooser") !== null)[0];
  var setShowChooser = useState(searchParams.get("chooser") !== null)[1];
  var showInput = searchParams.get("input") !== null;
  var showOutput = searchParams.get("output") !== null;
  var showStats = useState(searchParams.get("stats") !== null)[0];
  var setShowStats = useState(searchParams.get("stats") !== null)[1];
  var chatManager = useState(null)[0];
  var setChatManager = useState(null)[1];
  var input = useState("")[0];
  var setInput = useState("")[1];
  var output = useState("")[0];
  var setOutput = useState("")[1];
  var helpText = useState(idleText)[0];
  var setHelpText = useState(idleText)[1];
  var asrLatency = useState(0)[0];
  var setAsrLatency = useState(0)[1];
  var llmResponseLatency = useState(0)[0];
  var setLlmResponseLatency = useState(0)[1];
  var llmTokenLatency = useState(0)[0];
  var setLlmTokenLatency = useState(0)[1];
  var ttsLatency = useState(0)[0];
  var setTtsLatency = useState(0)[1];
  var active = function () {
    return chatManager && chatManager.state != ChatManagerState.IDLE;
  };
  useEffect(
    function () {
      return init();
    },
    [
      asrProvider,
      asrLanguage,
      ttsProvider,
      ttsModel,
      ttsVoice,
      model,
      agentId,
      docs,
    ]
  );
  var init = function () {
    console.log(
      `[page] init asr=${asrProvider} tts=${ttsProvider} llm=${model} agent=${agentId} docs=${docs}`
    );
    var manager = createChatManager({
      asrProvider: asrProvider,
      asrLanguage: asrLanguage,
      ttsProvider: ttsProvider,
      ttsModel: ttsModel,
      ttsVoice: ttsVoice,
      model: model,
      agentId: agentId,
      docs: docs,
      webrtc: webrtc,
    });
    setChatManager(manager);
    manager.onStateChange = function (state) {
      switch (state) {
        case ChatManagerState.LISTENING:
          setHelpText("Listening...");
          break;
        case ChatManagerState.THINKING:
          setHelpText(`Thinking... ${tapOrClick.toLowerCase()} to cancel`);
          break;
        case ChatManagerState.SPEAKING:
          setHelpText(`Speaking... ${tapOrClick.toLowerCase()} to interrupt`);
          break;
        default:
          setHelpText(idleText);
      }
    };
    manager.onInputChange = function (text, final, latency) {
      setInput(text);
      if (final && latency) {
        setAsrLatency(latency);
        setLlmResponseLatency(0);
        setLlmTokenLatency(0);
        setTtsLatency(0);
      }
    };
    manager.onOutputChange = function (text, final, latency) {
      setOutput(text);
      if (final) {
        setInput("");
      }
      setLlmResponseLatency(function (prev) {
        return prev ? prev : latency;
      });
    };
    manager.onAudioGenerate = function (latency) {
      setLlmTokenLatency(latency);
    };
    manager.onAudioStart = function (latency) {
      setTtsLatency(latency);
    };
    manager.onError = function () {
      manager.stop();
    };
    return function () {
      return manager.stop();
    };
  };
  var changeAgent = function (delta) {
    var index = AGENT_IDS.indexOf(agentId);
    var newIndex = (index + delta + AGENT_IDS.length) % AGENT_IDS.length;
    updateSearchParams("agent", AGENT_IDS[newIndex]);
  };
  var handleStart = function () {
    setInput("");
    setOutput("");
    setAsrLatency(0);
    setLlmResponseLatency(0);
    setLlmTokenLatency(0);
    setTtsLatency(0);
    chatManager.start("");
  };
  var handleStop = function () {
    chatManager.stop();
  };
  var speak = function () {
    return active() ? chatManager.interrupt() : handleStart();
  };
  // Click/tap starts or interrupts.
  var onClick = function (event) {
    var target = event.target;
    if (
      !target.matches("button") &&
      !target.matches("select") &&
      !target.matches("a")
    ) {
      speak();
    }
  };
  // Spacebar starts or interrupts. Esc quits.
  // C toggles the chooser. S toggles the stats.
  var onKeyDown = function (event) {
    if (event.keyCode == 32) {
      speak();
      event.preventDefault();
    } else if (event.keyCode == 27) {
      handleStop();
      event.preventDefault();
    } else if (event.keyCode == 67) {
      setShowChooser(function (prev) {
        return !prev;
      });
      event.preventDefault();
    } else if (event.keyCode == 83) {
      setShowStats(function (prev) {
        return !prev;
      });
      event.preventDefault();
    } else if (event.keyCode == 37) {
      handleStop();
      changeAgent(-1);
      event.preventDefault();
    } else if (event.keyCode == 39) {
      handleStop();
      changeAgent(1);
      event.preventDefault();
    }
  };
  // Install our handlers, and clean them up on unmount.
  useEffect(
    function () {
      document.addEventListener("click", onClick);
      document.addEventListener("keydown", onKeyDown);
      return function () {
        document.removeEventListener("keydown", onKeyDown);
        document.removeEventListener("click", onClick);
      };
    },
    [onKeyDown]
  );
  var swipeHandlers = useSwipeable({
    onSwipedLeft: function (eventData) {
      return changeAgent(-1);
    },
    onSwipedRight: function (eventData) {
      return changeAgent(1);
    },
  });
  return <div>hey</div>;
};
*/
