import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function createSupabaseAdmin() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Supabase admin environment variables are not configured.");
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "20");
    const query = (searchParams.get("query") || "").trim().toLowerCase();

    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeLimit =
      Number.isFinite(limit) && limit > 0 && limit <= 100 ? limit : 20;
    const offset = (safePage - 1) * safeLimit;
    const rangeEnd = offset + safeLimit - 1;

    const supabase = createSupabaseAdmin();

    let historyQuery = supabase
      .from("email_followups")
      .select(
        "id, subject, message, status, sent_at, created_at, student_id, students(name, email, course)",
        { count: "exact" },
      )
      .eq("status", "sent");

    if (query) {
      historyQuery = historyQuery.or(
        `subject.ilike.%${query}%,students.name.ilike.%${query}%,students.email.ilike.%${query}%`,
      );
    }

    const { data, error, count } = await historyQuery
      .order("sent_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .range(offset, rangeEnd);

    if (error) {
      throw error;
    }

    const rows = (data || []).map((item) => {
      const student = Array.isArray(item.students) ? item.students[0] : item.students;
      const studentName = student?.name || "Unknown student";
      const studentEmail = student?.email || "";
      const courseName = student?.course || "";
      const subject = item.subject || "";
      const emailType = subject.toLowerCase().includes("payment")
        ? "payment_confirmation"
        : subject.toLowerCase().includes("group")
          ? "group_redirection"
          : "welcome";

      return {
        id: item.id,
        studentId: item.student_id,
        studentName,
        studentEmail,
        courseName,
        emailType,
        subject,
        html: item.message || "",
        sentAt: item.sent_at || item.created_at,
      };
    });

    const filteredTotal = count || 0;

    return NextResponse.json({
      success: true,
      data: rows,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total: filteredTotal,
        totalPages: Math.max(1, Math.ceil(filteredTotal / safeLimit)),
      },
    });
  } catch (error) {
    console.error("Error fetching email history:", error);
    return NextResponse.json(
      { error: "Failed to fetch email history." },
      { status: 500 },
    );
  }
}
