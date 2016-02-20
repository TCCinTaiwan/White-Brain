from flask import Flask, render_template, request
from flask import send_from_directory, url_for
import os
app = Flask(__name__, static_url_path = "", static_folder = "static")
app.debug = True
def main():
    app.run(host = "0.0.0.0", port = 80)
@app.route('/')
def index():
	return render_template('index.htm')
@app.route('/b/test')
def showTestBrain():
	return render_template('brain.htm')
@app.route('/b/test_view')
def showReadOnlyTestBrain():
	return render_template('brainReadOnly.htm')
@app.route('/upload', methods = ["POST", "GET"])
def upload():
	if request.method == "POST":
		return request.form['formFile']
	else:
		return render_template('upload.htm')
# @app.route('/b/<brainName>')
# def showBrain(brainName):
# 	return render_template('brain.htm')
if __name__ == '__main__':
    main()