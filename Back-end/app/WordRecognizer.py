import cv2
import numpy as np
import os
import random
import mediapipe as mp
from tensorflow.keras.models import Sequential, load_model


class WordRecognizer:
    def __init__(self, model_path="model/keypoint_classifier/action_test_2.h5", actions=None, threshold=0.4, frame_skip=5):
        # Load the trained LSTM model
        self.model = load_model(model_path)

        # Define recognized actions
        self.actions = np.array(actions if actions else ["hello", "goodbye", "please"])

        # Mediapipe setup
        self.mp_holistic = mp.solutions.holistic
        self.holistic = self.mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5)
        self.mp_drawing = mp.solutions.drawing_utils

        # Colors for visualization
        self.colors = [(random.randint(0, 255), random.randint(0, 255), random.randint(0, 255)) for _ in range(len(self.actions))]

        # Prediction settings
        self.sequence = []
        self.sentence = []
        self.threshold = threshold
        self.frame_skip = frame_skip
        self.frame_count = 0  # Counter for skipping frames

        # Camera setup
        self.cap = cv2.VideoCapture(0)

    def mediapipe_detection(self, image):
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image.flags.writeable = False
        results = self.holistic.process(image)
        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        return image, results

    def extract_keypoints(self, results):
        """Extracts pose and hand keypoints (without face keypoints)."""
        pose = np.array([[res.x, res.y, res.z, res.visibility] for res in results.pose_landmarks.landmark]).flatten() if results.pose_landmarks else np.zeros(33*4)
        lh = np.array([[res.x, res.y, res.z] for res in results.left_hand_landmarks.landmark]).flatten() if results.left_hand_landmarks else np.zeros(21*3)
        rh = np.array([[res.x, res.y, res.z] for res in results.right_hand_landmarks.landmark]).flatten() if results.right_hand_landmarks else np.zeros(21*3)
        return np.concatenate([pose, lh, rh])

    def draw_styled_landmarks(self, image, results):
        """Draws styled landmarks for pose and hands."""
        # Draw pose landmarks
        self.mp_drawing.draw_landmarks(
            image, results.pose_landmarks, self.mp_holistic.POSE_CONNECTIONS,
            self.mp_drawing.DrawingSpec(color=(80, 22, 10), thickness=2, circle_radius=4),
            self.mp_drawing.DrawingSpec(color=(80, 44, 121), thickness=2, circle_radius=2)
        )

        # Draw left hand landmarks
        self.mp_drawing.draw_landmarks(
            image, results.left_hand_landmarks, self.mp_holistic.HAND_CONNECTIONS,
            self.mp_drawing.DrawingSpec(color=(121, 22, 76), thickness=1, circle_radius=4),
            self.mp_drawing.DrawingSpec(color=(121, 44, 250), thickness=1, circle_radius=2)
        )

        # Draw right hand landmarks
        self.mp_drawing.draw_landmarks(
            image, results.right_hand_landmarks, self.mp_holistic.HAND_CONNECTIONS,
            self.mp_drawing.DrawingSpec(color=(245, 117, 66), thickness=1, circle_radius=1),
            self.mp_drawing.DrawingSpec(color=(245, 66, 230), thickness=1, circle_radius=1)
        )

    def prob_viz(self, res, input_frame):
        """Visualizes the prediction probabilities."""
        output_frame = input_frame.copy()
        for num, prob in enumerate(res):
            cv2.rectangle(output_frame, (0, 60 + num * 40), (int(prob * 100), 90 + num * 40), self.colors[num], -1)
            cv2.putText(output_frame, self.actions[num], (0, 85 + num * 40),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)
        return output_frame

    def process_frame(self):
        """Processes frames and performs sign language recognition."""
        ret, frame = self.cap.read()
        if not ret:
            return None, None

        image, results = self.mediapipe_detection(frame)
        self.draw_styled_landmarks(image, results)

        keypoints = self.extract_keypoints(results)
        self.sequence.insert(0, keypoints)
        self.sequence = self.sequence[:30]

        self.frame_count += 1
        res = np.zeros(len(self.actions))

        if self.frame_count % self.frame_skip == 0 and len(self.sequence) == 30:
            res = self.model.predict(np.expand_dims(self.sequence, axis=0))[0]

            if res[np.argmax(res)] > self.threshold:
                predicted_word = self.actions[np.argmax(res)]
                print("Prediction:", predicted_word, "Confidence:", res[np.argmax(res)])
                if not self.sentence or predicted_word != self.sentence[-1]:
                    self.sentence.append(predicted_word)

        if len(self.sentence) > 5:
            self.sentence = self.sentence[-5:]

        image = cv2.flip(image, 1)
        image = self.prob_viz(res, image)
        cv2.rectangle(image, (0, 0), (640, 40), (245, 117, 16), -1)
        cv2.putText(image, ' '.join(self.sentence), (3, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)

        return image, self.sentence

    def start(self):
        """Starts the video feed and recognition loop."""
        while self.cap.isOpened():
            image, sentence = self.process_frame()
            if image is None:
                break

            cv2.imshow('Sign Language Recognition', image)

            key = cv2.waitKey(10) & 0xFF
            if key == ord('q'):
                break

        self.cap.release()
        cv2.destroyAllWindows()

    def release(self):
        """Releases the camera resources."""
        self.cap.release()
        cv2.destroyAllWindows()
