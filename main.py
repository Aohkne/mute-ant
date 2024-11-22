import cv2
import mediapipe as mp
import numpy as np
from tensorflow.keras.models import load_model

# Tải mô hình và encoder
model = load_model("hand_gesture_model.h5")
encoder = LabelEncoder()
encoder.classes_ = np.array(GESTURES)

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=False, max_num_hands=1, min_detection_confidence=0.5)
mp_drawing = mp.solutions.drawing_utils

cap = cv2.VideoCapture(0)

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(image)
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            mp_drawing.draw_landmarks(image, hand_landmarks, mp_hands.HAND_CONNECTIONS)

            # Lấy tọa độ landmark
            landmarks = np.array([[lm.x, lm.y, lm.z] for lm in hand_landmarks.landmark]).flatten()
            if len(landmarks) == 63:
                # Dự đoán
                prediction = model.predict(np.expand_dims(landmarks, axis=0))
                gesture = encoder.inverse_transform([np.argmax(prediction)])
                cv2.putText(image, gesture[0], (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2, cv2.LINE_AA)

    cv2.imshow("Sign Language Recognition", image)
    if cv2.waitKey(10) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
