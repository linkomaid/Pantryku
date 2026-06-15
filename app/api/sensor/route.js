import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request) {
    try {
        const body = await request.json();

        const { deviceID, temperature, humidity } = body;

        const sensorData = { uuid: deviceID,
            history: {
                aht21: { temperature, humidity },
            }, created_at: new Date() };

        const { data, error } = await supabase
            .from("History")
            .insert([sensorData])
            .select();

        if (error) {
            return NextResponse.json(
                { ok: false, message: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ ok: true, message: "Sensor data stored", saved: data });

    } catch (err) {
        return NextResponse.json(
            { ok: false, message: err.message },
            { status: 500 }
        );
    }
}

export async function GET() {
    const { data, error } = await supabase
        .from("History")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);

    if (error) {
        return NextResponse.json(
            { connected: false, message: error.message }, 
            { status: 500 }
        );
    }

    if (!data || data.length === 0) {
        return NextResponse.json({ connected:false, message: "No sensor data found" });
    }

    const latest = data[0];

    return NextResponse.json({
        connected: true,
        data: {
            uuid: latest.uuid,
            ...latest.history,
            created_at: latest.created_at
        }
    });
}