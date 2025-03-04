from dataclasses import dataclass
import cv2 as cv
from flask import Flask, Response, jsonify, request, stream_with_context
from flask_cors import CORS
from WordRecognizer import WordRecognizer
from HandGestureRegconizer import HandGestureRecognizer
import keyboard

# Configuration
@dataclass
class Config:
    DEVICE: int = 0
    WIDTH: int = 640
    HEIGHT: int = 460
    USE_STATIC_IMAGE_MODE: bool = False
    MIN_DETECTION_CONFIDENCE: float = 0.7
    MIN_TRACKING_CONFIDENCE: float = 0.5
    USE_BRECT: bool = True
    DATASET_DIR: str = "model/dataset/dataset 1"
    KEYPOINT_CSV_PATH: str = "model/keypoint_classifier/keypoint.csv"
    CLASSIFIER_LABEL_PATH: str = "model/keypoint_classifier/keypoint_classifier_label.csv"

app = Flask(__name__)
CORS(app)

# Initialize Recognizers
config = Config()
word_recognizer = WordRecognizer(draw_landmarks=False) #Dont draw a landmark
hand_recognizer = HandGestureRecognizer(config, draw_landmarks=False) #Dont draw a landmark

def generate_frames_letters():
    """Continuously generates frames for letter recognition mode."""
    while True:
        image, detected_gestures = hand_recognizer.process_frame()  # Letter recognition
        if image is None:
            continue  # Skip if no valid frame

        # Encode & Stream
        ret, buffer = cv.imencode('.jpg', image)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

def generate_frames_words():
    """Continuously generates frames for word recognition mode."""
    while True:
        image, sentence = word_recognizer.process_frame()  # Word recognition
        if image is None:
            continue  # Skip if no valid frame

        # Encode & Stream
        ret, buffer = cv.imencode('.jpg', image)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed_letter')
def video_feed_letter():
    """Video streaming route for letter recognition."""
    return Response(stream_with_context(generate_frames_letters()),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/video_feed_word')
def video_feed_word():
    """Video streaming route for word recognition."""
    return Response(stream_with_context(generate_frames_words()),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/status')
def status():
    """Check current status."""
    return jsonify({"status": "running"})

@app.route('/')
def index():
    return "Flask server is running successfully!"

if __name__ == '__main__':
    app.run(debug=True, port=5000)