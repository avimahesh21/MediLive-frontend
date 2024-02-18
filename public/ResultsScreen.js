import React, { useState, useEffect } from "react";
import ConfettiScreen from "./ConfettiScreen";
import "./ResultsScreen.css"; // You can keep your custom styles if needed
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

function ResultsScreen({ finalResultQuestionList }) {
  const [overallScore, setOverallScore] = useState(7.8);

  //Scores based on : Clarity and Concisness, Relevance, and Depth of Knowledge

  function ScoreIndicator({ value, maxValue }) {
    const val = (value / maxValue) * 100;
    const deg = (180 / 100) * val;
    return (
      <div className="indicator">
        <span className="bar" style={{ transform: `rotate(${deg}deg)` }} />

        <span className="result">
          <span>{value}</span>/<span>{maxValue}</span>
        </span>
      </div>
    );
  }

  return (
    <div>
      <ConfettiScreen />
      <div className="container mt-5">
        <div className="row vert">
          <div className="col-10">
            <div class="congratulations">Congratulations🎉</div>
            <div class="subTitle">
              You completed your interview with FirstRound!
            </div>
          </div>
          <div className="col-2 text-right">
            <a href="https://tally.so/r/w2A0Ve" class="btn btn-custom"  target="_blank">Tell us how it went!</a>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <hr class="hr" />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div class="results">Results</div>
            {Array.isArray(finalResultQuestionList) &&
            finalResultQuestionList.length > 0 ? (
              finalResultQuestionList.map((questionObj, index) => (
                <div key={index} className="d-flex item">
                  <div className="col-md-7 mb-3 p-4 pt-0 pl-0">
                    <div class="row col-12">
                      <div class="question-header col-1">{index + 1}</div>
                      <div class="quest col-11">{questionObj.question}</div>
                    </div>
                    <hr class="hr mb-0" />
                    <div className="answerTitle">Your Answer</div>
                    <div className="row">
                      <div className="col-6">
                        <div class="score">{questionObj.scores[0]}/10</div>
                        <div style={{ textAlign: "center" }}>Relevance</div>
                      </div>
                      <div className="col-6">
                        <div class="score">{questionObj.scores[1]}/10</div>
                        <div style={{ textAlign: "center" }}>
                          Depth of Knowledge
                        </div>
                      </div>
                    </div>
                    <h5 className="mt-4">&emsp;Tips: </h5>
                    <div className="tips">
                      {questionObj.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="">
                          {tip}
                        </li>
                      ))}
                    </div>
                  </div>
                  <div className="col-md-1"></div>
                  <div className="roundWrapper col-md-4  ml-4 mb-3 mr-4 ">
                    <video
                      className="round"
                      width="100%"
                      height="100%"
                      controls
                    >
                      <source src={questionObj.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              ))
            ) : (
              <p>No questions available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultsScreen;
