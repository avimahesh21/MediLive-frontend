import React from "react";
import ReactPlayer from "react-player";

const Nurse = ({ speaking }) => {
    return (
        <div className="asdfasdf">
            {speaking ? (
                <div className="player-wrapper speaking">
                    <ReactPlayer
                        url="speaking.mp4"
                        playing={true}
                        width="100%"
                        height="100%"
                        loop={true}
                        muted={true}
                        className="react-player"
                    />
                </div>
            ) : (
                <div className="player-wrapper listening">
                    <ReactPlayer
                        url="listening.mp4"
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

export default Nurse;
