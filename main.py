import random
from flask import Flask, render_template, request
from flask import send_from_directory, url_for, jsonify
import base64
import os
import sys
import re
from datetime import datetime
# ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])
app = Flask(__name__, static_url_path = "", static_folder = "static")
app.debug = True
# app.config['UPLOAD_FOLDER'] = os.getcwd() + "/room/"
# @app.route('/room/<path:filename>') # png檔
# def uploaded_file(filename):
#     return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)
room_status = {"200" : {"0" : "", "2" : "", "4" : "", "6" : "", "8" : "", "10" : ""}} # 2016-02-20 18:33.00
def main():
    app.run(host = "0.0.0.0", port = 80)
@app.route('/')
def index():
    return render_template('index.htm')
@app.route('/b')
def newBrain():
    room_id = "new"########################################指定新房間
    return '<script>location.pathname="/b/'+ str(room_id) + '";</script>'
@app.route('/b/<room_id>', methods = ["POST", "GET"])
def showBrain(room_id):
    if request.method == "POST":
        user_id = request.form['user_id']
        DataURL = request.form['DataURL'] # datauri = 'data:image/png;base64,iVBORw0K...'
        ImageData = base64.b64decode(re.search(r'base64,(.*)', DataURL).group(1).encode())
        with open('static/room/' + room_id + '_' + user_id + '.png', 'wb') as output:
            output.write(ImageData)
        room_status[room_id][user_id] = str(datetime.now())
        print(str(datetime.now()) + str(room_id) + "房間，" + str(user_id) + "上傳圖片", file = sys.stderr)
        return "<img src=" + url_for('static', filename= 'room/' + room_id + '_' + user_id + '.png') + " />"
    else:
        user_id = random.randrange(0, 11, 2)
        print("使用" + str(room_id) + "房間，ID:" + str(user_id), file = sys.stderr)
        return render_template('brain.htm', user_id = user_id)
@app.route('/b_status/<room_id>', methods = ["POST", "GET"]) # readonly
def showBrainStatus(room_id):
    if request.method == "POST":
        user_id = request.form['uid']
        print(room_id + "房" + user_id + "，要求", room_status[room_id], file = sys.stderr)
        return jsonify({room_id : room_status[room_id]})
    else:
        print(room_id + "房(使用者)，要求", room_status[room_id], file = sys.stderr)
        return jsonify({room_id : room_status[room_id]})
@app.route('/b2/<room_id>') # readonly
def showReadOnlyTestBrain(room_id):
    return render_template('brainReadOnly.htm')
if __name__ == '__main__':
    main()