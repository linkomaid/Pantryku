#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <Adafruit_AHTX0.h>

const char* ssid = "YOUR_WIFI_NAME";
const char* password = "YOUR_WIFI_PASSWORD";

const char* serverUrl = "http://YOUR_LOCAL_IP:3000/api/sensor";

Adafruit_AHTX0 aht;

String deviceID;

unsigned long lastSend = 0;
const long interval = 3000;

void connectWiFi() {
    WiFi.begin(ssid, password);
    Serial.print("Connecting to WiFi");

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }

    Serial.println("\nWiFi connected!");
    Serial.println(WiFi.localIP());
}

void setup() {
    Serial.begin(115200);
    delay(1000);

    uint64_t chipid = ESP.getEfuseMac();
    deviceID = String((uint32_t)(chipid >> 32), HEX) + String((uint32_t)chipid, HEX);

    Wire.begin();

    if (!aht.begin()) {
        Serial.println("AHT sensor not found!");
        while (1) delay(10);
    }

    connectWiFi();
}

void loop() {
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("WiFi lost. Reconnecting...");
        connectWiFi();
    }

    if (millis() - lastSend > interval) {
        lastSend = millis();

        sensors_event_t humidity, temp;
        aht.getEvent(&humidity, &temp);

        float t = temp.temperature;
        float h = humidity.relative_humidity;

        Serial.print("Temp: ");
        Serial.println(t);

        Serial.print("Humidity: ");
        Serial.println(h);

    if (WiFi.status() == WL_CONNECTED) {
            HTTPClient http;

            http.begin(serverUrl);
            http.addHeader("Content-Type", "application/json");

            String payload = "{";
            payload += "\"deviceID\":\"" + deviceID + "\",";
            payload += "\"temperature\":" + String(t) + ",";
            payload += "\"humidity\":" + String(h);
            payload += "}";

            int httpResponseCode = http.POST(payload);

            Serial.print("HTTP Response: ");
            Serial.println(httpResponseCode);

            if (httpResponseCode < 0) {
                Serial.println("Failed to send data");
            }

            http.end();
        }
    }
}