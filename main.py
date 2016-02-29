import random
from flask import Flask, render_template, request, send_file
from flask import send_from_directory, url_for, jsonify
import base64
import os
import sys
import re
from datetime import datetime
app = Flask(__name__, static_url_path = "", static_folder = "static")
room_status = {"0" : {"0" : ""}} # yyyy-MM-dd HH:mm:ss
def main():
    print("    'White's Brain' Copyright (C) 2016  TCC")
    print("    This program comes with ABSOLUTELY NO WARRANTY.")
    print("    This is free software, and you are welcome to redistribute itunder certain conditions.")
    app.run(host = os.getenv('IP', "0.0.0.0"), port = int(os.getenv('PORT', 80)), debug = True)
    if (len(sys.argv) > 1 and sys.argv[1] == "test"):
        sys.exit()
@app.route('/') #首頁
def index():
    return render_template('index.htm')
@app.route('/b/')
def newBrain(): # 指定新房間
    room_id = ''
    while room_id == '' or room_id in room_status:
        for x in range(0, 5):
            random_char = random.randrange(0, 62)
            room_id += chr(random_char % 26 +( 48 if (random_char // 26 == 2) else 65 if (random_char // 26 == 0) else 97))
    return '<script>location.pathname="/b/'+ str(room_id) + '";</script>'
@app.route('/b/<room_id>', methods = ["POST", "GET"])
def showBrain(room_id):
    if request.method == "POST":
        user_id = request.form['user_id']
        DataURL = request.form['DataURL'] # datauri = 'data:image/png;base64,iVBORw0K...'
        ImageData = base64.b64decode(re.search(r'base64,(.*)', DataURL).group(1).encode())
        with open('static\\room\\' + room_id + '_' + user_id + '.png', 'wb') as output:
            output.write(ImageData)
        if not room_id in room_status:
            room_status[room_id] = {}
        room_status[room_id][user_id] = str(datetime.now())
        print(str(datetime.now()) + str(room_id) + "房間，" + str(user_id) + "上傳圖片", file = sys.stderr)
        return "" # send_file('static\\room\\' + room_id + '_' + user_id + '.png', mimetype = 'image/png')
    else:
        user_id = random.randrange(0, 1)
        print("使用" + str(room_id) + "房間，ID:" + str(user_id), file = sys.stderr)
        return render_template('brain.htm', user_id = user_id)
@app.route('/b_status/<room_id>', methods = ["POST", "GET"]) # 房間狀態
def showBrainStatus(room_id):
    if request.method == "POST":
        user_id = request.form['uid'] # 人數, 更新時間
        if not room_id in room_status:
            return jsonify({})
        else:
            print(room_id + "房" + user_id + "，要求", room_status[room_id], file = sys.stderr)
            return jsonify({room_id : room_status[room_id]})
    else:
        if not room_id in room_status:
            return jsonify({})
        else:
            print(room_id + "房(使用者)，要求", room_status[room_id], file = sys.stderr)
            return jsonify({room_id : room_status[room_id]})
@app.route('/b_view/<room_id>') # 觀察者模式
def showReadOnlyTestBrain(room_id):
    return render_template('brainReadOnly.htm')
if __name__ == '__main__':
    main()