import React from "react";
import ReactPlayer from "react-player";
import "./interviewer.css";

const Interviewer = ({ speaking }) => {
  return (
    <div class="asdfasdf">
      <div className="player-wrapper listening">
        <ReactPlayer
          url={"listening.mp4"}
          playing={true}
          width="100%"
          height="100%"
          loop={true}
          muted={true}
          className="react-player"
        />
      </div>
      {speaking && (
        <div className="player-wrapper speaking">
          <ReactPlayer
            url={"speaking.mp4"}
            playing={true}
            width="100%"
            height="100%"
            loop={true}
            muted={true}
            className="react-player"
          />
        </div>
      )}
    </div>
  );
};

export default Interviewer;
