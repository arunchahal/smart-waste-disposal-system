import requests
import time
import socket
import sys

ESP8266_IP = "192.168.4.1"
ESP8266_PORT = 80
ESP8266_URL = f"http://{ESP8266_IP}:{ESP8266_PORT}/data"

def test_connection():
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(2)
        result = sock.connect_ex((ESP8266_IP, ESP8266_PORT))
        sock.close()
        return result == 0
    except Exception as e:
        print(f"Socket test error: {e}")
        return False

def fetch_data():
    try:
        if not test_connection():
            print(f"Cannot establish basic connection to {ESP8266_IP}:{ESP8266_PORT}")
            print("Please check:")
            print("1. ESP8266 is powered on")
            print("2. You're connected to the correct WiFi network")
            print("3. ESP8266's IP address is correct")
            return None
        response = requests.get(ESP8266_URL, timeout=5)
        if response.status_code == 200:
            try:
                bin_level = float(response.text.strip())
                return bin_level
            except ValueError:
                print(f"Invalid data received: {response.text}")
                return None
        else:
            print(f"Error: HTTP {response.status_code}")
            return None
    except requests.exceptions.ConnectTimeout:
        print(f"Connection timeout - ESP8266 not responding at {ESP8266_IP}")
        return None
    except requests.exceptions.ConnectionError as e:
        print(f"Connection error: {e}")
        print("\nTroubleshooting steps:")
        print("1. Verify ESP8266 is powered on")
        print("2. Check if you're connected to the correct WiFi network")
        print("3. Try pinging the ESP8266 IP address")
        print("4. Check if ESP8266's web server is running")
        return None
    except Exception as e:
        print(f"Unexpected error: {e}")
        return None

def get_fill_status(percentage):
    if percentage >= 85:
        return "FULL - ALERT!"
    elif percentage >= 80:
        return "ALMOST FULL"
    elif percentage >= 50:
        return "HALF FULL"
    elif percentage >= 25:
        return "LOW"
    else:
        return "EMPTY"

def main():
    print("Smart Dustbin Level Monitor")
    print(f"Attempting to connect to {ESP8266_IP}:{ESP8266_PORT}")
    print("Press Ctrl+C to exit")
    try:
        while True:
            bin_level = fetch_data()
            if bin_level is not None:
                status = get_fill_status(bin_level)
                print(f"\nDustbin Fill Level: {bin_level}%")
                print(f"Status: {status}")
                filled = int(bin_level / 10)
                print(f"[{'█' * filled}{' ' * (10-filled)}] {bin_level}%")
                if bin_level >= 85:
                    print("\033[91mALERT: Dustbin is Full!\033[0m")
                elif bin_level >= 80:
                    print("\033[93mWarning: Dustbin is Almost Full!\033[0m")
                elif bin_level >= 50:
                    print("\033[92mDustbin is Half Full\033[0m")
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nExiting...")
    except Exception as e:
        print(f"Fatal error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 