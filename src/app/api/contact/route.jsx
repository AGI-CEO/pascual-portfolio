import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req = NextRequest, res = NextResponse) {
  const body = await req.json();

  const { name, email, message } = body;

  const newMessage = await supabase
    .from("messages")
    .insert([{ name, email, message }]);
  return NextResponse.json(newMessage, { status: 201 });
}
