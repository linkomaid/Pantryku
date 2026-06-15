import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rateLimit';


export async function POST(request) {
    const body = await request.json();

    const { email, password } = body;

    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const limiter = rateLimit(ip);

    if ( !limiter.success ) { return NextResponse.json({ success: false, message: "Too many request"}, { status: 429 }) }


    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if ( error ) { return NextResponse.json({ success: false, message: "Invalid email or password"}, { status: 401 })}


    return NextResponse.json({ success: true, user: data.user, session: data.session })
} 