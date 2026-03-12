// app/api/register/route.js

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { cookies } from 'next/headers'; 

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data,error } = await supabase.from("auth_users").insert([
      {
        email,
        password: hashedPassword,
        
      },
    ]).select("id");

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    const userId = data?.[0]?.id;
      const cookieStore = await cookies(); 
      cookieStore.set('user_id', userId, {
      httpOnly: true,
      secure: true,
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
