import React, { useState, useRef } from 'react';
import { saveAs } from 'file-saver';

const ScreenRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [videoURL, setVideoURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);

  const startRecording = async () => {
    try {
      // Request screen recording permission
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen' },
        audio: true, // Optional: Include system audio
      });

      // Create MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'video/webm; codecs=vp8', // Ensure compatibility
      });

      // Handle data availability
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };

      // Handle stop event
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
        setVideoURL(URL.createObjectURL(blob));
        recordedChunks.current = [];
      };

      // Start recording
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error starting screen recording:', err);
      alert('Screen recording not allowed or unsupported in this browser.');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const saveRecording = () => {
    if (videoURL) {
      saveAs(videoURL, 'recording.webm');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h2>Screen Recorder</h2>
      <div>
        {!isRecording ? (
          <button onClick={startRecording} style={{ padding: '10px', margin: '5px' }}>
            Start Recording
          </button>
        ) : (
          <button onClick={stopRecording} style={{ padding: '10px', margin: '5px' }}>
            Stop Recording
          </button>
        )}
      </div>

      {videoURL && (
        <div>
          <h3>Recorded Video:</h3>
          <video src={videoURL} controls style={{ width: '80%', margin: '10px' }} />
          <br />
          <button onClick={saveRecording} style={{ padding: '10px', margin: '5px' }}>
            Save Video
          </button>
        </div>
      )}
    </div>
  );
};

export default ScreenRecorder;
