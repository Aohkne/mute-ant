import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import numpy as np
import os

# Tải dữ liệu
data, labels = [], []
for gesture in GESTURES:
    gesture_dir = os.path.join(DATASET_DIR, gesture)
    for file in os.listdir(gesture_dir):
        landmarks = np.load(os.path.join(gesture_dir, file))
        data.append(landmarks)
        labels.append(gesture)

data = np.array(data)
labels = np.array(labels)

# Mã hóa nhãn
encoder = LabelEncoder()
labels_encoded = encoder.fit_transform(labels)

# Chia tập dữ liệu
X_train, X_test, y_train, y_test = train_test_split(data, labels_encoded, test_size=0.2, random_state=42)

# Xây dựng mô hình
model = Sequential([
    Dense(128, activation='relu', input_shape=(63,)),
    Dropout(0.3),
    Dense(64, activation='relu'),
    Dropout(0.3),
    Dense(len(GESTURES), activation='softmax')
])

model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# Huấn luyện
model.fit(X_train, y_train, validation_data=(X_test, y_test), epochs=20, batch_size=16)

# Lưu mô hình
model.save("hand_gesture_model.h5")
