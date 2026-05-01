import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function createSupabaseAdmin() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase admin environment variables are not configured.");
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

function createSupabaseAuthClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase public environment variables are not configured.");
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const authorizationHeader = request.headers.get("authorization");
    const accessToken = authorizationHeader?.startsWith("Bearer ")
      ? authorizationHeader.slice(7)
      : null;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Unauthorized request." },
        { status: 401 },
      );
    }

    const supabaseAuth = createSupabaseAuthClient();
    const {
      data: { user },
      error: authError,
    } = await supabaseAuth.auth.getUser(accessToken);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized request." },
        { status: 401 },
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: "Student ID is required." },
        { status: 400 },
      );
    }

    const supabase = createSupabaseAdmin();

    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("id, email, phone, name")
      .eq("id", id)
      .single();

    if (studentError || !student) {
      return NextResponse.json(
        { error: "Student not found." },
        { status: 404 },
      );
    }

    const { error: deleteStudentError } = await supabase
      .from("students")
      .delete()
      .eq("id", id);

    if (deleteStudentError) {
      throw deleteStudentError;
    }

    return NextResponse.json({
      success: true,
      message: `${student.name} was deleted successfully.`,
    });
  } catch (error) {
    console.error("Error deleting student:", error);

    return NextResponse.json(
      { error: "Failed to delete student." },
      { status: 500 },
    );
  }
}
