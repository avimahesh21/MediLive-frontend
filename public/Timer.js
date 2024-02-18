import React, { Component } from "react";

class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      minutes: Math.floor(props.initialTime / 60),
      seconds: props.initialTime % 60,
      isRunning: false,
    };
  }

  getCurrentTime = () => {
    const { minutes, seconds } = this.state;
    return {
      minutes,
      seconds,
    };
  };

  startTimer = () => {
    if (!this.state.isRunning) {
      this.timer = setInterval(this.tick, 1000);
      this.setState({ isRunning: true });
    }
  };

  stopTimer = () => {
    clearInterval(this.timer);
    this.setState({ isRunning: false });
  };

  resetTimer = () => {
    this.stopTimer();
    const { initialTime } = this.props;
    this.setState({
      minutes: Math.floor(initialTime / 60),
      seconds: initialTime % 60,
    });
  };

  tick = () => {
    const { minutes, seconds } = this.state;
    if (minutes === 0 && seconds === 0) {
      this.stopTimer();
      if (this.props.onTimerEnd) {
        this.props.onTimerEnd(); // Call the callback function when timer reaches 0
      }
    } else {
      if (seconds === 0) {
        this.setState({ minutes: minutes - 1, seconds: 59 });
      } else {
        this.setState({ seconds: seconds - 1 });
      }
    }
  };

  componentWillUnmount() {
    this.stopTimer();
  }

  render() {
    const { minutes, seconds, isRunning } = this.state;
    return (
      <div className="fixed-right timer" style={{ textAlign: "right" }}>
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </div>
    );
  }
}

export default Timer;
