import React from "react";
import ReactPlayer from "react-player";

const Nurse = ({ speaking }) => {
    return (
        <div className="video-container">
            <ReactPlayer
                url="listening.mp4"
                playing={true}
                width="100%"
                height="100%"
                loop={true}
                muted={true}
                className="react-player listening"
            />
            {speaking && (
                <ReactPlayer
                    url="speaking.mp4"
                    playing={true}
                    width="100%"
                    height="100%"
                    loop={true}
                    muted={true}
                    className="react-player speaking"
                />
            )}
        </div>
    );
};

export default Nurse;
