import os
import csv
import copy
from dataclasses import dataclass
from typing import List
import cv2 as cv
import numpy as np
import mediapipe as mp
from utils.cvfpscalc import CvFpsCalc
from model.keypoint_classifier.keypoint_classifier import KeyPointClassifier

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

class HandGestureRecognizer:
    def __init__(self, config: Config):
        self.config = config
        self.setup_camera()
        self.setup_mediapipe()
        self.setup_classifier()
        self.fps_calculator = CvFpsCalc(buffer_len=10)
        self.mode = 0
        self.number = -1

    def setup_camera(self):
        self.cap = cv.VideoCapture(self.config.DEVICE)
        self.cap.set(cv.CAP_PROP_FRAME_WIDTH, self.config.WIDTH)
        self.cap.set(cv.CAP_PROP_FRAME_HEIGHT, self.config.HEIGHT)

    def setup_mediapipe(self):
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            static_image_mode=self.config.USE_STATIC_IMAGE_MODE,
            max_num_hands=2,
            min_detection_confidence=self.config.MIN_DETECTION_CONFIDENCE,
            min_tracking_confidence=self.config.MIN_TRACKING_CONFIDENCE,
        )

    def setup_classifier(self):
        self.keypoint_classifier = KeyPointClassifier()
        with open(self.config.CLASSIFIER_LABEL_PATH, encoding="utf-8-sig") as f:
            self.keypoint_classifier_labels = [row[0] for row in csv.reader(f)]

    @staticmethod
    def calc_landmark_list(image: np.ndarray, landmarks) -> List[List[int]]:
        image_width, image_height = image.shape[1], image.shape[0]
        return [[
            min(int(landmark.x * image_width), image_width - 1),
            min(int(landmark.y * image_height), image_height - 1)
        ] for landmark in landmarks.landmark]

    @staticmethod
    def pre_process_landmark(landmark_list: List[List[int]]) -> List[float]:
        temp_landmark_list = copy.deepcopy(landmark_list)
        base_x, base_y = temp_landmark_list[0]

        # Convert to relative coordinates
        for point in temp_landmark_list:
            point[0] -= base_x
            point[1] -= base_y

        # Flatten and normalize
        flattened = [coord for point in temp_landmark_list for coord in point]
        max_value = max(map(abs, flattened))
        return [n / max_value for n in flattened]

    def draw_landmarks(self, image: np.ndarray, landmark_points: List[List[int]]) -> np.ndarray:
        if not landmark_points:
            return image

        # Define connections for fingers and palm
        connections = [
            # Thumb
            (2, 3), (3, 4),
            # Index finger
            (5, 6), (6, 7), (7, 8),
            # Middle finger
            (9, 10), (10, 11), (11, 12),
            # Ring finger
            (13, 14), (14, 15), (15, 16),
            # Little finger
            (17, 18), (18, 19), (19, 20),
            # Palm
            (0, 1), (1, 2), (2, 5), (5, 9),
            (9, 13), (13, 17), (17, 0)
        ]

        # Draw connections
        for start_idx, end_idx in connections:
            start_point = tuple(landmark_points[start_idx])
            end_point = tuple(landmark_points[end_idx])

            # Draw black background line
            cv.line(image, start_point, end_point, (0, 0, 0), 6)
            # Draw white foreground line
            cv.line(image, start_point, end_point, (255, 255, 255), 2)

        # Draw keypoints
        for idx, point in enumerate(landmark_points):
            radius = 8 if idx in [4, 8, 12, 16, 20] else 5  # Larger circles for fingertips
            cv.circle(image, tuple(point), radius, (255, 255, 255), -1)
            cv.circle(image, tuple(point), radius, (0, 0, 0), 1)

        return image

    def process_frame(self):
        """Captures a frame and processes hand gesture recognition."""
        ret, frame = self.cap.read()
        if not ret:
            return None, None

        frame = cv.flip(frame, 1)
        debug_image = copy.deepcopy(frame)

        # Process with MediaPipe
        image = cv.cvtColor(frame, cv.COLOR_BGR2RGB)
        image.flags.writeable = False
        results = self.hands.process(image)
        image.flags.writeable = True

        detected_gestures = []

        if results.multi_hand_landmarks:
            for hand_landmarks, handedness in zip(results.multi_hand_landmarks, results.multi_handedness):
                # Process landmarks
                landmark_list = self.calc_landmark_list(debug_image, hand_landmarks)
                processed_landmarks = self.pre_process_landmark(landmark_list)

                # Classify gesture
                hand_sign_id = self.keypoint_classifier(processed_landmarks)
                gesture = self.keypoint_classifier_labels[hand_sign_id]
                detected_gestures.append(gesture)

                # Draw visualizations
                debug_image = self.draw_landmarks(debug_image, landmark_list)

                # Add text labels
                brect = self.calc_bounding_rect(debug_image, hand_landmarks)
                label = f"{handedness.classification[0].label}: {gesture}"
                cv.putText(debug_image, label, (brect[0] + 5, brect[1] - 4),
                           cv.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1, cv.LINE_AA)

        return debug_image, detected_gestures

    @staticmethod
    def calc_bounding_rect(image: np.ndarray, landmarks) -> List[int]:
        image_width, image_height = image.shape[1], image.shape[0]
        landmark_array = np.array([[
            min(int(landmark.x * image_width), image_width - 1),
            min(int(landmark.y * image_height), image_height - 1)
        ] for landmark in landmarks.landmark])

        return cv.boundingRect(landmark_array)
