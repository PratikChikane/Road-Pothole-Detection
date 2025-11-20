from flask import Flask, render_template, request, redirect, url_for
import os
import time
from detector import detect_potholes
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['RESULT_FOLDER'] = 'static/results'

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['RESULT_FOLDER'], exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/detect', methods=['POST'])
def detect():
    if 'file' not in request.files:
        return render_template('index.html', error="No file part in the request.")

    file = request.files['file']
    if file.filename == '':
        return render_template('index.html', error="No file selected.")

    if file:
        confidence = float(request.form.get('confidence', 0.25))
        filename = secure_filename(file.filename)
        upload_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(upload_path)

        # Detect Potholes
        start_time = time.time()
        result_filename, results_data = detect_potholes(upload_path, confidence)
        end_time = time.time()

        processing_time = round(end_time - start_time, 2)

        return render_template(
            'result.html',
            original_image=f'uploads/{filename}',
            result_image=f'results/{result_filename}',
            detection_results=results_data,
            processing_time=processing_time
        )

    return render_template('index.html', error="Unexpected error occurred.")

if __name__ == '__main__':
    app.run(debug=True)
