import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req = NextRequest, res = NextResponse) {
  try {
    const { data: skills, error } = await supabase.from("skills").select("*");

    if (error) throw error;

    return NextResponse.json(skills);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while fetching skills." },
      { status: 500 }
    );
  }
}
