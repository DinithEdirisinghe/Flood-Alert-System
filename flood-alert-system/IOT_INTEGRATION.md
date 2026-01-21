# 📡 IoT Device Integration Guide

## Quick Reference for Your Physical Sensor

### Device Requirements

- Water level sensor (ultrasonic or pressure-based)
- Microcontroller (ESP32, Arduino, Raspberry Pi)
- WiFi/Cellular connectivity
- Battery monitoring capability

### API Endpoint

```
POST http://your-server-ip:5000/api/readings
Content-Type: application/json
```

### Data Format

```json
{
  "stationId": "kelani-01",
  "waterLevel": 4.75,
  "batteryLevel": 92
}
```

### Response

```json
{
  "success": true,
  "alert": "NORMAL",
  "reading": {
    "stationId": "kelani-01",
    "waterLevel": 4.75,
    "batteryLevel": 92,
    "status": "NORMAL",
    "timestamp": "2026-01-20T10:30:00.000Z"
  }
}
```

## Example Arduino/ESP32 Code

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Server endpoint
const char* serverUrl = "http://YOUR_SERVER_IP:5000/api/readings";

// Station ID (unique for your device)
const char* stationId = "kelani-01";

// Sensor pins
const int TRIG_PIN = 5;
const int ECHO_PIN = 18;
const int BATTERY_PIN = 34;

void setup() {
  Serial.begin(115200);

  // Initialize WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  // Initialize sensors
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
}

void loop() {
  // Read water level (ultrasonic sensor)
  float waterLevel = readWaterLevel();

  // Read battery level
  int batteryLevel = readBatteryLevel();

  // Send data to server
  sendDataToServer(waterLevel, batteryLevel);

  // Wait 5 minutes before next reading
  delay(300000);
}

float readWaterLevel() {
  // Send ultrasonic pulse
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  // Read echo
  long duration = pulseIn(ECHO_PIN, HIGH);
  float distance = duration * 0.034 / 2; // in cm

  // Convert to meters (adjust based on sensor placement)
  float waterLevel = 10.0 - (distance / 100.0); // Example: 10m max height

  return waterLevel;
}

int readBatteryLevel() {
  int rawValue = analogRead(BATTERY_PIN);
  // Convert to percentage (adjust based on battery voltage)
  int percentage = map(rawValue, 0, 4095, 0, 100);
  return percentage;
}

void sendDataToServer(float waterLevel, int batteryLevel) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    // Create JSON payload
    StaticJsonDocument<200> doc;
    doc["stationId"] = stationId;
    doc["waterLevel"] = waterLevel;
    doc["batteryLevel"] = batteryLevel;

    String jsonString;
    serializeJson(doc, jsonString);

    // Send POST request
    int httpResponseCode = http.POST(jsonString);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("Response: " + response);
    } else {
      Serial.println("Error sending data");
    }

    http.end();
  }
}
```

## Python Example (Raspberry Pi)

```python
import requests
import time
import random
# Import your actual sensor library
# import RPi.GPIO as GPIO

SERVER_URL = "http://YOUR_SERVER_IP:5000/api/readings"
STATION_ID = "kelani-01"

def read_water_level():
    # Replace with actual sensor reading
    # Example using ultrasonic sensor
    return round(random.uniform(3.0, 5.0), 2)

def read_battery_level():
    # Replace with actual battery reading
    return random.randint(80, 100)

def send_data():
    data = {
        "stationId": STATION_ID,
        "waterLevel": read_water_level(),
        "batteryLevel": read_battery_level()
    }

    try:
        response = requests.post(SERVER_URL, json=data)
        if response.status_code == 201:
            result = response.json()
            print(f"Data sent successfully. Alert: {result['alert']}")
        else:
            print(f"Error: {response.status_code}")
    except Exception as e:
        print(f"Connection error: {e}")

if __name__ == "__main__":
    while True:
        send_data()
        time.sleep(300)  # Send every 5 minutes
```

## Testing Your Device

### 1. Test Connection

```bash
curl -X POST http://localhost:5000/api/readings \
  -H "Content-Type: application/json" \
  -d '{"stationId":"kelani-01","waterLevel":4.5,"batteryLevel":95}'
```

### 2. Check Response

Should return:

```json
{
  "success": true,
  "alert": "NORMAL"
}
```

### 3. View on Dashboard

Open http://localhost:5173 and check the map for your station

## Sensor Calibration

### Water Level Sensor

1. Measure actual water level with ruler/tape
2. Compare with sensor reading
3. Adjust formula: `actualLevel = sensorReading * calibrationFactor + offset`

### Battery Monitor

1. Measure actual battery voltage with multimeter
2. Compare with ADC reading
3. Adjust mapping values

## Troubleshooting

### Device Can't Connect

- Check WiFi credentials
- Verify server IP address
- Ensure port 5000 is accessible
- Check firewall settings

### Incorrect Readings

- Calibrate sensors
- Check sensor placement
- Verify power supply stability
- Test with known distances/voltages

### Data Not Appearing

- Check station ID matches database
- Verify JSON format
- Check server logs
- Test with curl/Postman first

## Production Deployment

### Security

- Use HTTPS instead of HTTP
- Add API key authentication
- Implement rate limiting
- Use VPN or secure tunnel

### Reliability

- Add retry logic for failed requests
- Store data locally if connection fails
- Implement watchdog timer
- Use deep sleep to save battery

### Monitoring

- Track successful transmissions
- Log errors for debugging
- Monitor battery voltage
- Set up alerts for device offline

## Station Setup Checklist

- [ ] Create station in database via API
- [ ] Configure device with station ID
- [ ] Calibrate water level sensor
- [ ] Test battery monitoring
- [ ] Verify WiFi connection
- [ ] Send test reading
- [ ] Confirm data appears on dashboard
- [ ] Set update interval
- [ ] Document sensor placement
- [ ] Configure alerts

## Support

For issues or questions:

1. Check server logs: `npm run dev` in backend
2. Check browser console for frontend errors
3. Test API endpoint with Postman/curl
4. Verify MongoDB connection
5. Review this integration guide
