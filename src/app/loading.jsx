import React from "react";

const Loading = () => {
  return (
    <>
      <div
        className="hexagon"
        aria-label="Animated hexagonal ripples"
        style={{
          marginBottom: "1.5em",
          overflow: "hidden",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "15em",
          height: "15em",
        }}
      >
        <div
          className="hexagon__group"
          style={{ width: "100%", height: "100%" }}
        >
          <div
            className="hexagon__sector"
            style={{
              animationName: "moveOut1",
              top: "calc(50% - 0.1em)",
              left: "calc(50% - 0.1em)",
            }}
          ></div>
          <div
            className="hexagon__sector"
            style={{ animationName: "moveOut2" }}
          ></div>
          <div
            className="hexagon__sector"
            style={{ animationName: "moveOut3" }}
          ></div>
          <div
            className="hexagon__sector"
            style={{ animationName: "moveOut4" }}
          ></div>
          <div
            className="hexagon__sector"
            style={{ animationName: "moveOut5" }}
          ></div>
          <div
            className="hexagon__sector"
            style={{ animationName: "moveOut6" }}
          ></div>
        </div>
        <div
          className="hexagon__group"
          style={{ width: "100%", height: "100%" }}
        >
          <div
            className="hexagon__sector"
            style={{
              animationName: "moveOut1",
              top: "calc(50% - 0.1em)",
              left: "calc(50% - 0.1em)",
            }}
          ></div>
          <div
            className="hexagon__sector"
            style={{ animationName: "moveOut2" }}
          ></div>
          <div
            className="hexagon__sector"
            style={{ animationName: "moveOut3" }}
          ></div>
          <div
            className="hexagon__sector"
            style={{ animationName: "moveOut4" }}
          ></div>
          <div
            className="hexagon__sector"
            style={{ animationName: "moveOut5" }}
          ></div>
          <div
            className="hexagon__sector"
            style={{ animationName: "moveOut6" }}
          ></div>
        </div>
        <div
          className="hexagon__group"
          style={{ width: "100%", height: "100%" }}
        >
          <div
            className="hexagon__sector"
            style={{
              animationName: "moveOut1",
              top: "calc(50% - 0.1em)",
              left: "calc(50% - 0.1em)",
            }}
          ></div>
          <div
            className="hexagon__sector"
            style={{ animationName: "moveOut2" }}
          ></div>
          <div
            className="hexagon__sector"
            style={{ animationName: "moveOut3" }}
          ></div>
          <div
            className="hexagon__sector"
            style={{ animationName: "moveOut4" }}
          ></div>
          <div
            className="hexagon__sector"
            style={{ animationName: "moveOut5" }}
          ></div>
          <div
            className="hexagon__sector"
            style={{ animationName: "moveOut6" }}
          ></div>
        </div>
        <div
          className="hexagon__group"
          style={{ width: "100%", height: "100%" }}
        >
          <div
            className="hexagon__sector"
            style={{
              animationName: "moveOut1",
              top: "calc(50% - 0.1em)",
              left: "calc(50% - 0.1em)",
            }}
          ></div>
          <div
            className="hexagon__sector"
            style={{ animationName: "moveOut2" }}
          ></div>
          <div
            className="hexagon__sector"
            style={{ animationName: "moveOut3" }}
          ></div>
          <div
            className="hexagon__sector"
            style={{ animationName: "moveOut4" }}
          ></div>
          <div
            className="hexagon__sector"
            style={{ animationName: "moveOut5" }}
          ></div>
          <div
            className="hexagon__sector"
            style={{ animationName: "moveOut6" }}
          ></div>
        </div>
        <div
          className="hexagon__group"
          style={{ width: "100%", height: "100%" }}
        >
          <div
            className="hexagon__sector"
            style={{
              animationName: "moveOut1",
              top: "calc(50% - 0.1em)",
              left: "calc(50% - 0.1em)",
            }}
          ></div>
          <div
            className="hexagon__sector"
            style={{ animationName: "moveOut2" }}
          ></div>
          <div
            className="hexagon__sector"
            style={{ animationName: "moveOut3" }}
          ></div>
          <div
            className="hexagon__sector"
            style={{ animationName: "moveOut4" }}
          ></div>
          <div
            className="hexagon__sector"
            style={{ animationName: "moveOut5" }}
          ></div>
          <div
            className="hexagon__sector"
            style={{ animationName: "moveOut6" }}
          ></div>
        </div>
        <div
          className="hexagon__group"
          style={{ width: "100%", height: "100%" }}
        >
          <div
            className="hexagon__sector"
            style={{
              animationName: "moveOut1",
              top: "calc(50% - 0.1em)",
              left: "calc(50% - 0.1em)",
            }}
          ></div>
          <div
            className="hexagon__sector"
            style={{ animationName: "moveOut2" }}
          ></div>
          <div
            className="hexagon__sector"
            style={{ animationName: "moveOut3" }}
          ></div>
          <div
            className="hexagon__sector"
            style={{ animationName: "moveOut4" }}
          ></div>
          <div
            className="hexagon__sector"
            style={{ animationName: "moveOut5" }}
          ></div>
          <div
            className="hexagon__sector"
            style={{ animationName: "moveOut6" }}
          ></div>
        </div>
      </div>
      <p
        aria-label="Loading"
        style={{
          font: "bold 1em/1.5 'Comfortaa', sans-serif",
          display: "grid",
          placeItems: "center",
          alignContent: "center",
          height: "100vh",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        Loading
      </p>
    </>
  );
};

export default Loading;
