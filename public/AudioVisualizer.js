import React, { useState, useEffect, useRef } from "react";

const AudioVisualizer = () => {
  const [audioLevels, setAudioLevels] = useState([0, 0, 0]);
  const animationFrameId = useRef();
  const audioContext = useRef();
  const analyser = useRef();
  const dataArray = useRef();

  useEffect(() => {
    // Initialize audio processing
    const initAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        audioContext.current = new AudioContext();
        const source = audioContext.current.createMediaStreamSource(stream);
        analyser.current = audioContext.current.createAnalyser();
        source.connect(analyser.current);
        dataArray.current = new Uint8Array(analyser.current.frequencyBinCount);
        animate();
      } catch (error) {
        console.error("Error accessing the microphone", error);
      }
    };

    initAudio();

    return () => {
      // Cleanup
      cancelAnimationFrame(animationFrameId.current);
      if (audioContext.current) audioContext.current.close();
    };
  }, []);

  const animate = () => {
    animationFrameId.current = requestAnimationFrame(animate);
    analyser.current.getByteTimeDomainData(dataArray.current);

    // Calculate RMS for more sensitive volume detection
    let sum = 0;
    for (const amplitude of dataArray.current) {
      sum += (amplitude - 128) * (amplitude - 128); // Subtract 128 to center at 0
    }
    const rms = Math.sqrt(sum / dataArray.current.length);

    // Update circles based on RMS value
    setAudioLevels([
      rms * 0.05, // Adjust these factors to increase sensitivity
      rms * 0.1,
      rms * 0.08,
    ]);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
      {" "}
      {/* Adjust the gap as needed */}
      {/* Microphone SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-mic-fill"
        viewBox="0 0 16 16"
      >
        <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0z" />
        <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5" />
      </svg>
      {/* Audio Visualizer SVG */}
      <svg width="3.5rem" height="2rem">
        {audioLevels.map((radius, index) => (
          <circle key={index} cx={(index + 1) * 15} cy="1rem" r={5 + radius} />
        ))}
      </svg>
    </div>
  );
};

export default AudioVisualizer;
