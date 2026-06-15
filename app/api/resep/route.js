import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET (request) {
    const { searchParams } = new URL(request.url);
    const uniqueID = searchParams.get("uuid");
    const search = searchParams.get("search");

    let query = supabase.from("Resep").select("*");

    if (uniqueID) {
        query = query.eq("uuid", uniqueID).single();
    }
    else if (search) {
        query = query.ilike("nama_resep", `%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }

    let result = data;

    if (Array.isArray(data)) {
        result = data.map(items => {
            let imageUrl = null;

            if (items.thumbnail) {
                imageUrl = supabase.storage
                    .from("resep")
                    .getPublicUrl(items.thumbnail)
                    .data.publicUrl;
            }

            return {
                ...items,
                thumbnail_url: imageUrl
            };
        });
    }

    // 4. SINGLE ITEM (uuid detail)
    else if (data && data.thumbnail) {
        result = {
            ...data,
            thumbnail_url: supabase.storage
                .from("resep")
                .getPublicUrl(data.thumbnail)
                .data.publicUrl
        };
    }

    return NextResponse.json({ data: result }, { status: 200 });
}