import os
import cv2 as cv
import numpy as np
from flask import Flask, Response, jsonify, request
from flask_cors import CORS
import threading

from config import Config
from audio_manager import AudioManager
from hand_gesture_recognizer import HandGestureRecognizer

# Initialize components
app = Flask(__name__)
CORS(app)

config = Config()
audio_manager = AudioManager(language=config.LANGUAGE)
recognizer = HandGestureRecognizer(config, audio_manager)

def generate_frames():
    while True:
        ret, frame = recognizer.cap.read()
        if not ret:
            break

        debug_image, gestures = recognizer.process_frame(frame)
        ret, buffer = cv.imencode('.jpg', debug_image)
        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(),
                   mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/status')
def status():
    return jsonify({"status": "running"})

@app.route('/gestures')
def get_gestures():
    """Return the list of available gestures and their spoken text"""
    gesture_texts = {}
    for label in recognizer.keypoint_classifier_labels:
        gesture_texts[label] = audio_manager._get_text_for_gesture(label)
    
    return jsonify({
        "available_gestures": recognizer.keypoint_classifier_labels,
        "gesture_speech_mapping": gesture_texts
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)