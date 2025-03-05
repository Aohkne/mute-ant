# Sign Language Recognition System

## Overview

This project is a comprehensive Sign Language Recognition system that uses Mediapipe for landmark detection and a pre-trained LSTM model for word recognition.

## Features

- Real-time sign language word recognition
- Text-to-Speech functionality
- Flask-based video streaming
- Hand gesture and word recognition modes

## Prerequisites

- Python 3.8+
- Webcam
- Active internet connection (for gTTS)

## Installation

1. Clone the repository
2. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

## Running the Application

```bash
python main.py
```

## Usage

- Navigate to `http://localhost:5000` in your browser
- Access video feeds at:
  - Letter Recognition: `/video_feed_letter`
  - Word Recognition: `/video_feed_word`

## Model Training

- Pre-trained model located at `model/keypoint_classifier/action_test_2.h5`
- Custom model training requires additional dataset and training script

## Troubleshooting

- Ensure webcam is not in use by other applications
- Check internet connection for Text-to-Speech
- Verify all dependencies are installed

## License

[Your License Here]
