import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
# from model.keypoint_classifier.wlasl_model import Initialise_model

# CNN Model
class KeyPointClassifier(object):
    def __init__(
        self,
        model_path="model/keypoint_classifier/best_asl_letter_model.tflite",
        num_threads=1,
    ):
        self.interpreter = tf.lite.Interpreter(
            model_path=model_path, num_threads=num_threads
        )

        self.interpreter.allocate_tensors()
        self.input_details = self.interpreter.get_input_details()
        self.output_details = self.interpreter.get_output_details()

    def __call__(
        self,
        landmark_list,
    ):
        input_details_tensor_index = self.input_details[0]["index"]
        self.interpreter.set_tensor(
            input_details_tensor_index, np.array([landmark_list], dtype=np.float32)
        )
        self.interpreter.invoke()

        output_details_tensor_index = self.output_details[0]["index"]

        result = self.interpreter.get_tensor(output_details_tensor_index)

        result_index = np.argmax(np.squeeze(result))

        return result_index

# # WLASL model model.hdf5
# class KeyPointClassifier:
#     def __init__(self, model_path="model/keypoint_classifier/model_300.hdf5"):
#         self.model = Initialise_model()  # Recreate model
#         self.model.load_weights(model_path, by_name=True, skip_mismatch=True)  # ✅ Load weights safely
#
#     def __call__(self, landmark_list):
#         """Predicts the class of the given keypoints"""
#         input_data = np.array([landmark_list], dtype=np.float32)
#         result = self.model.predict(input_data)
#         result_index = np.argmax(result, axis=1)[0]
#
#         return result_index

# XGBoost Model
# import numpy as np
# import xgboost as xgb
#
# class KeyPointClassifier:
#     def __init__(self, model_path="model/keypoint_classifier/asl_letters_xgb_model.json"):
#         self.model = xgb.XGBClassifier()
#         self.model.load_model(model_path)
#
#     def __call__(self, landmark_list):
#         input_data = np.array(landmark_list).reshape(1, -1)
#         result_index = self.model.predict(input_data)[0]
#
#         return result_index

