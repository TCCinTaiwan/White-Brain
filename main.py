from flask import Flask, render_template, request
from flask import send_from_directory, url_for
import base64
import os
import sys
import re
# ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])
app = Flask(__name__, static_url_path = "", static_folder = "static")
app.debug = True
# app.config['UPLOAD_FOLDER'] = os.getcwd() + "/room/"
# @app.route('/room/<path:filename>') # png檔
# def uploaded_file(filename):
#     return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)
def main():
    app.run(host = "0.0.0.0", port = 80)
@app.route('/')
def index():
    return render_template('index.htm')
@app.route('/b/<room_id>', methods = ["POST", "GET"])
def showBrain(room_id):
    if request.method == "POST":
        user_id = request.form['user_id']
        print(str(room_id) + "房間，" + str(user_id) + "上傳圖片", file = sys.stderr)
        DataURL = request.form['DataURL'] # datauri = 'data:image/png;base64,iVBORw0K...'
        ImageData = base64.b64decode(re.search(r'base64,(.*)', DataURL).group(1).encode())
        with open('static/room/' + room_id + '_' + user_id + '.png', 'wb') as output:
            output.write(ImageData)
        return "<img src=" + url_for('static', filename= 'room/' + room_id + '_' + user_id + '.png') + " />"
    else:
        print("使用" + str(room_id) + "房間", file = sys.stderr)
        return render_template('brain.htm')
@app.route('/b_status/<room_id>') # readonly
def showBrainStatus(room_id):
    return "good"
@app.route('/b2/<room_id>') # readonly
def showReadOnlyTestBrain(room_id):
    return render_template('brainReadOnly.htm')
if __name__ == '__main__':
    main()