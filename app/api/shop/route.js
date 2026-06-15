import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const genid = searchParams.get("genid");

    let query = supabase.from("ShoppingList").select("*");

    if (genid) {
        query = query.eq("genid", genid);
    }

    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
        return NextResponse.json(
            { ok: false, message: error.message },
            { status: 500 }
        );
    }

    return NextResponse.json({ ok: true, data });
}

export async function POST(request) {
    try {
        const body = await request.json();

        const { genid, nama_bahan, kuantitas } = body;

        if (!genid || !nama_bahan) {
            return NextResponse.json(
                { ok: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from("ShoppingList")
            .insert([
                {
                    genid,
                    nama_bahan,
                    kuantitas: Number(kuantitas) || 1,
                    habis: false,
                    timestamp: null,
                    created_at: new Date().toISOString()
                }
            ])
            .select();

        if (error) {
            return NextResponse.json(
                { ok: false, message: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ ok: true, data });

    } catch (err) {
        return NextResponse.json(
            { ok: false, message: err.message },
            { status: 500 }
        );
    }
}

export async function PATCH(request) {
    try {
        const body = await request.json();

        const { id } = body;

        if (!id) {
            return NextResponse.json(
                { ok: false, message: "Missing id" },
                { status: 400 }
            );
        }

        const { data: item, error: fetchError } = await supabase
            .from("ShoppingList")
            .select("*")
            .eq("id", id)
            .single();

        if (fetchError || !item) {
            return NextResponse.json(
                { ok: false, message: "Item not found" },
                { status: 404 }
            );
        }

        if (item.kuantitas <= 0) {
            return NextResponse.json({
                ok: false,
                message: "Item already empty"
            });
        }

        const newQty = item.kuantitas - 1;

        const updatePayload = {
            kuantitas: newQty,
            habis: newQty === 0,
            timestamp: newQty === 0 ? new Date().toISOString() : item.timestamp
        };

        const { data, error } = await supabase
            .from("ShoppingList")
            .update(updatePayload)
            .eq("id", id)
            .select();

        if (error) {
            return NextResponse.json(
                { ok: false, message: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ ok: true, data });

    } catch (err) {
        return NextResponse.json(
            { ok: false, message: err.message },
            { status: 500 }
        );
    }
}