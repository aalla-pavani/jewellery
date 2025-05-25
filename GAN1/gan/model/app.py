from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import cv2
import io
import traceback
import os
import logging
from datetime import datetime
from collections import deque
import sys

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('model_server.log')
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
        "methods": ["GET", "POST", "PUT", "OPTIONS"],
        "allow_headers": ["Content-Type", "x-auth-token"],
        "supports_credentials": True
    }
})

# Load the model
generator = None
try:
    model_path = "new_model.keras"
    if os.path.exists(model_path):
        generator = tf.keras.models.load_model(model_path, compile=False)
        logger.info("Model loaded successfully.")
    else:
        raise FileNotFoundError(f"Model file not found at {model_path}")
except Exception as e:
    logger.error(f"Error loading model: {e}")
    logger.error(traceback.format_exc())

# def preprocess_image(image_bytes):
#     try:
#         nparr = np.frombuffer(image_bytes, np.uint8)
#         img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
#         if img is None:
#             raise ValueError("Invalid image format")

#         # Convert BGR to RGB and ensure correct color handling
#         img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        
#         # Resize maintaining aspect ratio
#         target_size = (256, 256)
#         h, w = img.shape[:2]
#         aspect = w/h
        
#         if aspect > 1:
#             new_w = target_size[0]
#             new_h = int(new_w/aspect)
#         else:
#             new_h = target_size[1]
#             new_w = int(new_h*aspect)
            
#         img = cv2.resize(img, (new_w, new_h))
        
#         # Create a black canvas of target size
#         canvas = np.zeros((target_size[1], target_size[0], 3), dtype=np.uint8)
        
#         # Compute center offset
#         y_offset = (target_size[1] - new_h) // 2
#         x_offset = (target_size[0] - new_w) // 2
        
#         # Place the image in the center
#         canvas[y_offset:y_offset+new_h, x_offset:x_offset+new_w] = img
        
#         # Convert to float32 and normalize to [-1, 1]
#         img = canvas.astype(np.float32)
#         img = (img - 127.5) / 127.5
        
#         # Add batch dimension
#         img = np.expand_dims(img, axis=0)
#         return img

#     except Exception as e:
#         logger.error(f"Error during preprocessing: {e}")
#         logger.error(traceback.format_exc())
#         raise


def preprocess_image(image_bytes):
    try:
        # Decode the image bytes to a NumPy array
        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if image is None:
            raise ValueError("Invalid image format or corrupted file")

        # Convert the image to grayscale
        gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # Invert the grayscale image
        inv_image = 255 - gray_image

        # Apply Gaussian blur
        blurred = cv2.GaussianBlur(inv_image, (21, 21), 0)

        # Invert the blurred image
        inv_blur = 255 - blurred

        # Create the sketch-like image
        sketch_image = cv2.divide(gray_image, inv_blur, scale=256.0)

        # Convert to RGB
        sketch_image_rgb = cv2.cvtColor(sketch_image, cv2.COLOR_GRAY2RGB)

        # Resize to 256x256 for the model
        sketch_image_resized = cv2.resize(sketch_image_rgb, (256, 256))

        # Normalize to [-1, 1]
        normalized_image = (sketch_image_resized / 127.5) - 1

        # Add batch dimension
        batch_image = np.expand_dims(normalized_image, axis=0).astype(np.float32)

        return batch_image

    except Exception as e:
        logger.error(f"Error during preprocessing: {e}")
        logger.error(traceback.format_exc())
        raise        


def process_with_model(image_array):
    try:
        if generator is None:
            raise ValueError("Model is not loaded")

        # Generate the image
        result = generator(image_array, training=False)
        
        # Convert to numpy array and denormalize correctly
        result = result.numpy()[0]  # Remove batch dimension
        
        # Denormalize from [-1, 1] to [0, 255]
        result = ((result + 1) * 127.5).clip(0, 255).astype(np.uint8)
        
        # Convert RGB to BGR for OpenCV
        result = cv2.cvtColor(result, cv2.COLOR_RGB2BGR)
        
        return result

    except Exception as e:
        logger.error(f"Error during model inference: {e}")
        logger.error(traceback.format_exc())
        raise

@app.route('/api/generate', methods=['POST'])
def generate_design():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400

        # Process the image
        image_bytes = file.read()
        processed_image = preprocess_image(image_bytes)
        if processed_image is None:
            return jsonify({"error": "Error processing image"}), 400

        # Generate the image
        generated_image = process_with_model(processed_image)
        if generated_image is None:
            return jsonify({"error": "Error generating image"}), 500

        # Convert the generated image to bytes
        img_io = io.BytesIO()
        cv2.imwrite('temp.png', generated_image)
        img_io = open('temp.png', 'rb')
        img_io.seek(0)
        
        return send_file(img_io, mimetype='image/png')

    except Exception as e:
        logger.error(f"Error in generate_design: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

@app.route('/api/status', methods=['GET'])
def get_status():
    return jsonify({
        "status": "operational" if generator is not None else "error"
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)