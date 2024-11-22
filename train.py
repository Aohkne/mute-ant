import cv2
import mediapipe as mp

# Initialize Mediapipe Hands
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=False, max_num_hands=2, min_detection_confidence=0.7,
                       min_tracking_confidence=0.5)
mp_drawing = mp.solutions.drawing_utils


def main():
    cap = cv2.VideoCapture(0)
    try:
        while True:
            # Read a frame from the webcam
            success, image = cap.read()
            if not success:
                print("Failed to read frame from webcam.")
                break

            # Flip the image horizontally for mirror effect
            image = cv2.flip(image, 1)

            # Convert the image to RGB for Mediapipe processing
            rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

            # Process the image with Mediapipe Hands
            results = hands.process(rgb_image)

            if results.multi_hand_landmarks:
                for hand_index, (hand_landmarks, hand_handedness) in enumerate(
                        zip(results.multi_hand_landmarks, results.multi_handedness)):
                    # Determine if the hand is left or right
                    handedness_label = hand_handedness.classification[0].label  # "Left" or "Right"
                    display_side = 10 if handedness_label == "Left" else image.shape[1] - 200  # Adjust x-coordinate

                    # List of fingertip landmarks (index of thumb to pinky)
                    fingertip_indices = [4, 8, 12, 16, 20]

                    # Display the coordinates of all fingertips
                    y_offset = 30
                    for i, landmark_index in enumerate(fingertip_indices):
                        landmark = hand_landmarks.landmark[landmark_index]

                        # Convert normalized coordinates to pixel coordinates
                        height, width, _ = image.shape
                        cx, cy = int(landmark.x * width), int(landmark.y * height)

                        # Show the landmark's coordinates on the image
                        text = f"Finger {i + 1} ({cx},{cy})"
                        cv2.putText(image, text, (display_side, y_offset), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0),
                                    2, cv2.LINE_AA)
                        y_offset += 30

                    # Optionally draw all landmarks and connections
                    mp_drawing.draw_landmarks(
                        image,
                        hand_landmarks,
                        mp_hands.HAND_CONNECTIONS
                    )

            # Display the image with fingertip coordinates
            cv2.imshow("Hand Tracking", image)

            # Exit when "q" key is pressed
            if cv2.waitKey(1) & 0xFF == ord("q"):
                break
    except KeyboardInterrupt:
        print("Program interrupted by user.")
    finally:
        # Release the webcam and close the window
        cap.release()
        cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
