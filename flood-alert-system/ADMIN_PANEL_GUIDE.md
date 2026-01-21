# 🎮 Using the Admin Panel - Complete Guide

## Accessing the Admin Panel

1. **From Dashboard**: Click the **"⚙️ Admin Panel"** button in the top-right corner
2. **Direct URL**: Navigate to http://localhost:5173/admin

---

## Features

### 1️⃣ **Add New Station**

Create a new monitoring station for your IoT device:

1. Click **"➕ Add New Station"** button
2. Fill in the form:
   - **Station ID**: Unique identifier (e.g., `my-device-01`)
   - **Station Name**: Descriptive name (e.g., `My Device - Lab`)
   - **Latitude**: GPS coordinate (e.g., `6.9271`)
   - **Longitude**: GPS coordinate (e.g., `79.9831`)
   - **Warning Level**: Water level threshold in meters (e.g., `5.0`)
   - **Danger Level**: Critical threshold in meters (e.g., `7.0`)
3. Click **"Create Station"**
4. Your new station appears on the map immediately!

**Example Values for Testing:**
```
Station ID: test-device-01
Name: Test Device - My Room
Latitude: 6.9271
Longitude: 79.9831
Warning: 5.0
Danger: 7.0
```

---

### 2️⃣ **Edit Station Thresholds**

Modify warning and danger levels for existing stations:

1. Find your station in the table
2. Click **"Edit"** button
3. Update the threshold values
4. Click **"Update Station"**

**Use Case**: Adjust thresholds based on seasonal changes or calibration results.

---

### 3️⃣ **Device Simulator** 🎮

Test your system without physical hardware!

#### Quick Test (Single Reading):
1. Click **"🎮 Device Simulator"** button
2. Select a station from dropdown
3. Set water level (e.g., `4.5` meters)
4. Set battery level (e.g., `95` %)
5. Click **"📤 Send Once"**
6. Watch the dashboard update in real-time!

#### Continuous Simulation:
1. Select your station
2. Set initial values
3. Click **"▶️ Start Simulation (Every 10s)"**
4. System will send data every 10 seconds with slight variations
5. Watch the activity log for confirmation
6. Click **"⏹️ Stop Simulation"** when done

**Activity Log Shows:**
- ✅ Successful transmissions with alert level
- ❌ Any errors with details
- Timestamp for each event

---

### 4️⃣ **View All Stations**

The main table shows:
- **Station ID**: Unique identifier
- **Name**: Full station name
- **Location**: GPS coordinates
- **Warning**: Warning threshold
- **Danger**: Danger threshold
- **Status**: Current alert level (color-coded)
- **Actions**: Edit or View buttons

**Color Codes:**
- 🟢 Green = NORMAL
- 🟠 Orange = WARNING
- 🔴 Red = DANGER

---

## Connecting Your Real Device

Once you've created a station in the Admin Panel:

### Step 1: Note Your Station ID
After creating a station, copy the Station ID (e.g., `my-device-01`)

### Step 2: Get Your Computer's IP
```powershell
ipconfig
# Look for IPv4 Address, e.g., 192.168.1.100
```

### Step 3: Use This ESP32/Arduino Code
```cpp
const char* serverIP = "192.168.1.100";  // Your computer's IP
const char* stationId = "my-device-01";   // Your station ID from admin panel

void sendData(float waterLevel, int battery) {
  String url = "http://" + String(serverIP) + ":5000/api/readings";
  HTTPClient http;
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  
  String json = "{\"stationId\":\"" + String(stationId) + 
                "\",\"waterLevel\":" + String(waterLevel) + 
                ",\"batteryLevel\":" + String(battery) + "}";
  
  http.POST(json);
  http.end();
}
```

### Step 4: Test Connection
1. Open Device Simulator
2. Select your station
3. Click "Send Once"
4. If you see ✅ success, your backend is working!
5. Now upload code to your device

---

## Workflow Example

### Setting Up a New IoT Device:

1. **Create Station** (Admin Panel)
   - Click "Add New Station"
   - Enter: `lab-sensor-01`, `Lab Sensor`, coordinates, thresholds
   - Save

2. **Test with Simulator** (Admin Panel)
   - Select `lab-sensor-01`
   - Click "Send Once"
   - Check dashboard - marker should appear!

3. **Configure Device** (Arduino/ESP32)
   - Set `stationId = "lab-sensor-01"`
   - Set your WiFi credentials
   - Set server IP address
   - Upload code

4. **Deploy & Monitor** (Dashboard)
   - Device starts sending data
   - Watch real-time updates on map
   - Click marker for details
   - View 24-hour trends

---

## Tips & Tricks

### 🎯 Testing Tips:
- Use the simulator to test different water levels
- Try values above warning/danger thresholds to see alerts
- Start simulation and watch the chart update in Station Detail page

### 🔧 Troubleshooting:
- **Can't create station?** Check if Station ID is unique
- **Simulator not working?** Make sure backend is running on port 5000
- **Device can't connect?** Check firewall allows port 5000

### 💡 Best Practices:
- Use descriptive station names
- Set realistic thresholds based on location
- Test with simulator before deploying device
- Check the activity log for errors

---

## Quick Reference

| Action | Location | Purpose |
|--------|----------|---------|
| Create Station | Admin Panel → Add New Station | Setup new IoT device |
| Edit Thresholds | Admin Panel → Edit button | Adjust alert levels |
| Test System | Admin Panel → Device Simulator | Verify without hardware |
| View Live Data | Dashboard → Click marker | See current status |
| Historical Data | Station Detail page | View 24h trends |

---

## Need Help?

1. **Backend not responding?**
   - Check: `cd backend` → `npm run dev`
   - Make sure MongoDB is connected

2. **Frontend not updating?**
   - Check: `cd frontend` → `npm run dev`
   - Refresh browser (Ctrl+F5)

3. **Device can't connect?**
   - Test with simulator first
   - Check IP address is correct
   - Verify port 5000 is open

**You now have full control of your flood monitoring system through the web interface! 🎉**
