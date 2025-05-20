from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import requests
import time

app = Flask(__name__)
CORS(app)

ESP8266_IP = "192.168.4.1"
ESP8266_PORT = "80"
ESP8266_URL = f"http://{ESP8266_IP}:{ESP8266_PORT}/data"

bin_data = {
    "level": 0,
    "last_updated": None,
    "status": "disconnected"
}

def fetch_bin_data():
    try:
        response = requests.get(ESP8266_URL, timeout=2)
        if response.status_code == 200:
            level = float(response.text.strip())
            bin_data["level"] = level
            bin_data["last_updated"] = time.strftime("%H:%M:%S")
            bin_data["status"] = "connected"
            return True
    except:
        bin_data["status"] = "disconnected"
    return False

@app.route('/')
def serve_dashboard():
    return send_from_directory('.', 'admin-dashboard.html')

@app.route('/api/bin-data')
def get_bin_data():
    fetch_bin_data()
    return jsonify(bin_data)

if __name__ == '__main__':
    print("Starting server...")
    print("Access the dashboard at: http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True) 