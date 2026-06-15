#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <Adafruit_AHTX0.h>

const char* ssid = "YOUR_WIFI_NAME";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverUrl = "http://YOUR_LOCAL_IP:3000/api/sensor";

Adafruit_AHTX0 aht;
String deviceID;

const int redLED = 4;
const int yellowLED = 16;
const int greenLED = 17;
const int whiteLED = 2;
const int buzzerPin = 13;
const int buttonPin = 5;

bool lastButtonState = HIGH;

void connectWiFi() {
    WiFi.begin(ssid, password);

    Serial.print("Connecting WiFi");
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }

    Serial.println("\nWiFi connected");
    Serial.println(WiFi.localIP());
}

String checkFreshness(float temp, float humidity) {
    if (temp >= 22 && temp <= 28 && humidity >= 40 && humidity <= 60)
        return "Segar";

    if (temp >= 20 && temp <= 32 && humidity >= 30 && humidity <= 75)
        return "Kurang Segar";

    return "Tidak Segar";
    }

void resetLED() {
    digitalWrite(redLED, LOW);
    digitalWrite(yellowLED, LOW);
    digitalWrite(greenLED, LOW);
    digitalWrite(whiteLED, LOW);
}


void beep(int duration) {
    digitalWrite(buzzerPin, HIGH);
    delay(duration);
    digitalWrite(buzzerPin, LOW);
}

void sendData(float temp, float humidity, String status) {
    if (WiFi.status() != WL_CONNECTED) return;

    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    String payload = "{";
    payload += "\"deviceID\":\"" + deviceID + "\",";
    payload += "\"temperature\":" + String(temp) + ",";
    payload += "\"humidity\":" + String(humidity) + ",";
    payload += "\"status\":\"" + status + "\"";
    payload += "}";

    int response = http.POST(payload);

    Serial.print("API Response: ");
    Serial.println(response);

    http.end();
}

void setup() {
    Serial.begin(115200);
    delay(1000);

    pinMode(redLED, OUTPUT);
    pinMode(yellowLED, OUTPUT);
    pinMode(greenLED, OUTPUT);
    pinMode(whiteLED, OUTPUT);

    pinMode(buzzerPin, OUTPUT);
    pinMode(buttonPin, INPUT_PULLUP);

    digitalWrite(buzzerPin, LOW);
    resetLED();

    uint64_t chipid = ESP.getEfuseMac();
    deviceID = String((uint32_t)(chipid >> 32), HEX) +
                String((uint32_t)chipid, HEX);

    Wire.begin();

    if (!aht.begin()) {
        Serial.println("AHT sensor not found!");
        while (1);
    }

    connectWiFi();
}

void loop() {
    bool buttonState = digitalRead(buttonPin);

    if (lastButtonState == HIGH && buttonState == LOW) {

        Serial.println("Button pressed!");

        resetLED();
        digitalWrite(whiteLED, HIGH);
        beep(100);
        delay(2000);
        digitalWrite(whiteLED, LOW);

        delay(3000);

        sensors_event_t humidityEvent, tempEvent;
        aht.getEvent(&humidityEvent, &tempEvent);

        float temp = tempEvent.temperature;
        float humidity = humidityEvent.relative_humidity;

        Serial.print("Temp: ");
        Serial.println(temp);

        Serial.print("Humidity: ");
        Serial.println(humidity);

        String status = checkFreshness(temp, humidity);
        Serial.println(status);

        resetLED();

        beep(150);

        delay(200);

        if (status == "Segar") {
        digitalWrite(greenLED, HIGH);
        } else if (status == "Kurang Segar") {
        digitalWrite(yellowLED, HIGH);
        } else {
        digitalWrite(redLED, HIGH);
        }
        sendData(temp, humidity, status);

        delay(1000);
        resetLED();
    }

    lastButtonState = buttonState;
}