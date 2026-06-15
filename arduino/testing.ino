#include <Wire.h>

#define SDA_PIN 21
#define SCL_PIN 22

void scanI2C() {
    Serial.println("\n--- I2C SCAN ---");
    int count = 0;

    for (byte addr = 1; addr < 127; addr++) {
        Wire.beginTransmission(addr);

        if (Wire.endTransmission() == 0) {
            Serial.print("Found device at 0x");
            Serial.println(addr, HEX);
            count++;
        }
}

    if (count == 0) Serial.println("No I2C devices found");
    Serial.println("--- END SCAN ---\n");
}

void setup() {
    Serial.begin(115200);
    delay(1500);

    Wire.begin(SDA_PIN, SCL_PIN);
    Wire.setClock(100000);

    Serial.println("Starting diagnostics...");
}

void loop() {
    scanI2C();
    delay(5000);
}