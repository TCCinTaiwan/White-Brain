from flask import Flask, render_template, request
from flask import send_from_directory, url_for
import base64
import os
import sys
import re
# ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])
app = Flask(__name__, static_url_path = "", static_folder = "static")
app.debug = True
app.config['UPLOAD_FOLDER'] = os.getcwd() + "/room/"
# def allowed_file(filename):
#     return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS
# @app.route('/upup', methods=['GET', 'POST'])
# def upload_file():
#     if request.method == 'POST':
#         file = request.files['file']
#         if file and allowed_file(file.filename):
#             filename = secure_filename(file.filename)
#             file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
#             return redirect(url_for('uploaded_file', filename = filename))
#     return ''
@app.route('/room/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)
def main():
    app.run(host = "0.0.0.0", port = 80)
@app.route('/')
def index():
    return render_template('index.htm')
@app.route('/b/<room_id>')
def showTestBrain(room_id):
    print("使用" + str(room_id) + "房間", file = sys.stderr)
    return render_template('brain.htm')
@app.route('/b/test_view')
def showReadOnlyTestBrain():
    return render_template('brainReadOnly.htm')
@app.route('/upload', methods = ["POST", "GET"])
def upload():
    if request.method == "POST":
        user_id = request.form['user_id']
        room_id = request.form['room_id']
        print(str(room_id) + "房間，" + str(user_id) + "上傳圖片", file = sys.stderr)
        DataURL = request.form['DataURL']
        # datauri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
        # imgstr = re.search(r'base64,(.*)', datauri).group(1)
        # print(imgstr, "\n\n", file = sys.stderr)

        imgstr = re.search(r'base64,(.*)', DataURL).group(1)
        output = open('room/' + room_id + '_' + user_id + '.png', 'wb')
        output.write(base64.b64decode(imgstr.encode()))
        output.close()
        return "ok"
    else:
        return render_template('upload.htm')
# @app.route('/b/<brainName>')
# def showBrain(brainName):
# 	return render_template('brain.htm')
if __name__ == '__main__':
    main()