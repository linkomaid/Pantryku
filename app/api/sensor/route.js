import { NextResponse } from "next/server";

let sensorData = null;

export async function POST(request) {
    const body = await request.json();

    console.log("ESP32 HIT:", body);

    const { deviceID, temperature, humidity } = body;

    sensorData = {
        deviceID,
        temperature,
        humidity,
        updated_at: new Date()
    };

    return NextResponse.json({
        ok: true,
        message: "ESP32 data received",
        received: sensorData
    });
}

export async function GET() {
    if (!sensorData) {
        return NextResponse.json({
            connected: false,
            message: "No ESP32 connected"
        });
    }

    const lastUpdate = new Date(sensorData.updated_at).getTime();
    const now = Date.now();

    if (now - lastUpdate > 30000) {
        return NextResponse.json({
            connected: false,
            message: "ESP32 offline"
        });
    }

    return NextResponse.json({
        connected: true,
        data: sensorData
    });
}