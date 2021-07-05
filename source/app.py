import os
import uuid
from flask import Flask, flash, request, redirect
from logic.asr import SpeechToTextGoogle
from logic.scoring import get_similarity


app = Flask(__name__, static_url_path='')
app.config['UPLOAD_FOLDER'] = 'files'
speech_to_text = SpeechToTextGoogle()


@app.get('/')
def root():
    return app.send_static_file('index.html')


@app.post('/submit-results')
def submit_results():
    # check if the post request has the file part
    if 'file' not in request.files:
        flash('No file part')
        return redirect(request.url)
    file = request.files['file']
    lang = request.form['language']
    source_text = request.form['source-text']
    # if user does not select file, browser also
    # submit an empty part without filename
    if file.filename == '':
        flash('No selected file')
        return redirect(request.url)
    file_name = str(uuid.uuid4()) + ".wav"
    full_file_name = os.path.join(app.config['UPLOAD_FOLDER'], file_name)
    file.save(full_file_name)
    file.close()
    recognized_text = speech_to_text.get_text(full_file_name, lang)
    score, comment = get_similarity(source_text, recognized_text)
    info = {
        'recognized-text': recognized_text,
        'similarity-score-value': score,
        'similarity-score-comment': comment,
    }
    return info


@app.get('/texts')
def get_texts():
    texts = __extract_texts('texts/english/', 'English')
    texts.extend(__extract_texts('texts/russian/', 'Русский'))
    texts.extend(__extract_texts('texts/spanish/', 'Español'))
    texts.extend(__extract_texts('texts/french/', 'Français'))
    return {i: text for i, text in enumerate(texts)}


def __extract_texts(path: str, lang: str):
    texts = list()
    for file in os.listdir(path):
        with open(path + file) as f:
            texts.append({
                'lang': lang,
                'title': file,
                'content': f.read(),
                'example-url': 'https://www.youtube.com',
            })
    return texts


if __name__ == '__main__':
    app.run()
