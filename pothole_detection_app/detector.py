from ultralytics import YOLO
import os
import uuid
from PIL import Image

# Load model once
model = YOLO("models/best.pt")



def detect_potholes(image_path, confidence):
    results = model(image_path, conf=confidence)

    result = results[0]
    result_image = result.plot()

    result_filename = f"{uuid.uuid4().hex}.jpg"
    result_path = os.path.join("static/results", result_filename)
    Image.fromarray(result_image).save(result_path)

    detections = []
    for i, (cls, conf, box) in enumerate(zip(result.boxes.cls, result.boxes.conf, result.boxes.xyxy)):
        detections.append({
            "id": i + 1,
            "class": model.names[int(cls)],
            "confidence": round(float(conf) * 100, 2),
            "box": [round(float(coord), 2) for coord in box]
        })

    return result_filename, detections

