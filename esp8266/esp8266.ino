#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>

const char* ssid = "SmartDustbin";
const char* password = "12345678";

ESP8266WebServer server(80);
String binLevel = "0";

void handleRoot() {
    server.send(200, "text/html", getHTML());
}

void handleData() {
    server.send(200, "text/plain", binLevel);
}

void setup() {
    Serial.begin(9600);
    WiFi.softAP(ssid, password);
    server.on("/", handleRoot);
    server.on("/data", handleData);
    server.begin();
}

void loop() {
    if (Serial.available()) {
        binLevel = Serial.readStringUntil('\n');
    }
    server.handleClient();
}

String getHTML() {
    return "<!DOCTYPE html><html><head><title>Smart Dustbin</title><style>"
           "body { font-family: Arial, sans-serif; text-align: center; background: #121212; color: white; margin: 0; padding: 0; }"
           ".container { display: flex; flex-direction: column; justify-content: flex-start; align-items: center; height: 100vh; padding-top: 50px; }"
           ".level-box { font-size: 80px; font-weight: bold; background: #222; padding: 40px; border-radius: 15px; box-shadow: 0 0 30px rgba(0,255,0,0.5); width: 60%; max-width: 600px; }"
           ".alert { font-size: 40px; font-weight: bold; color: red; display: none; margin-top: 30px; }"
           "</style>"
           "<script>"
           "function updateLevel() {"
           " fetch('/data').then(response => response.text()).then(level => {"
           "   document.getElementById('level').innerText = level ;"
           "   let box = document.getElementById('level-box');"
           "   box.style.boxShadow = (level > 80) ? '0 0 30px rgba(255,0,0,2)' : (level > 50) ? '0 0 30px rgba(255,255,0,2)' : '0 0 30px rgba(0,255,0,2)';"
           "   document.getElementById('alert').style.display = (level > 85) ? 'block' : 'none';"
           " });"
           "}"
           "setInterval(updateLevel, 1000);"
           "</script></head>"
           "<body><div class='container'>"
           "<h1 style='font-size: 60px;'>Smart Dustbin Level (%)</h1>"
           "<div id='level-box' class='level-box'><span id='level'>0</span></div>"
           "<h1 id='alert' class='alert'> ALERT: Dustbin is Full! </h1>"
           "</div></body></html>";
}