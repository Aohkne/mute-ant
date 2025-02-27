from dataclasses import dataclass

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
    # Speech configuration
    LANGUAGE: str = "vi"  # Vietnamese language
    SPEECH_COOLDOWN: float = 2.0  # Seconds between speech events