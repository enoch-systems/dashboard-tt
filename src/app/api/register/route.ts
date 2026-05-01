import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

function createSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

async function emailExists(email: string) {
  const supabase = createSupabaseClient();
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return false;
  }

  const { data, error } = await supabase
    .from("students")
    .select("id")
    .ilike("email", normalizedEmail)
    .limit(1);

  if (error) {
    throw error;
  }

  return Boolean(data?.length);
}

async function phoneExists(phone: string) {
  const supabase = createSupabaseClient();
  const trimmedPhone = phone.trim();
  const normalizedPhone = normalizePhone(phone);

  if (!trimmedPhone) {
    return false;
  }

  const { data: exactMatch, error: exactMatchError } = await supabase
    .from("students")
    .select("id")
    .eq("phone", trimmedPhone)
    .limit(1);

  if (exactMatchError) {
    throw exactMatchError;
  }

  if (exactMatch?.length) {
    return true;
  }

  if (normalizedPhone.length < 4) {
    return false;
  }

  const { data: possibleMatches, error: possibleMatchesError } = await supabase
    .from("students")
    .select("phone")
    .like("phone", `%${normalizedPhone.slice(-4)}%`)
    .limit(25);

  if (possibleMatchesError) {
    throw possibleMatchesError;
  }

  return (
    possibleMatches?.some((student) => normalizePhone(student.phone) === normalizedPhone) ??
    false
  );
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") ?? "";
    const phone = searchParams.get("phone") ?? "";

    const [hasEmail, hasPhone] = await Promise.all([
      email ? emailExists(email) : Promise.resolve(false),
      phone ? phoneExists(phone) : Promise.resolve(false),
    ]);

    return NextResponse.json({
      emailExists: hasEmail,
      phoneExists: hasPhone,
    });
  } catch (error) {
    console.error("Error checking registration availability:", error);

    return NextResponse.json(
      { error: "Failed to check registration availability." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      fullName,
      phoneWhatsApp,
      gender,
      stateOfResidence,
      learningTrack,
      howHeardAboutUs,
      hasLaptopAndInternet,
      email,
      employmentStatus,
      wantsScholarship,
      whyLearnThisSkill,
    } = body;

    if (
      !fullName ||
      !phoneWhatsApp ||
      !gender ||
      !stateOfResidence ||
      !learningTrack ||
      !howHeardAboutUs ||
      !hasLaptopAndInternet ||
      !email ||
      !employmentStatus ||
      !wantsScholarship ||
      !whyLearnThisSkill
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    const normalizedEmail = normalizeEmail(email);
    const normalizedPhone = normalizePhone(phoneWhatsApp);

    const [hasEmail, hasPhone] = await Promise.all([
      emailExists(normalizedEmail),
      phoneExists(normalizedPhone),
    ]);

    if (hasEmail || hasPhone) {
      return NextResponse.json(
        {
          error:
            hasEmail && hasPhone
              ? "Email and phone number already exist."
              : hasEmail
                ? "Email already exists."
                : "Phone number already exists.",
          emailExists: hasEmail,
          phoneExists: hasPhone,
        },
        { status: 409 },
      );
    }

    const submittedAt = new Date();
    const supabase = createSupabaseClient();
    const registrationData = {
      name: fullName.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      course: learningTrack.trim(),
      reg_date: submittedAt.toLocaleDateString("en-GB"),
      reg_time: submittedAt.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      payment_plan: "Not Paid Yet",
      amount_paid: 0,
      balance_remaining: 0,
      status: "None",
      timestamp: submittedAt.toISOString(),
      gender: gender.trim(),
      state_of_residence: stateOfResidence.trim(),
      learning_track: learningTrack.trim(),
      how_did_you_hear: howHeardAboutUs.trim(),
      has_laptop_and_internet: hasLaptopAndInternet.trim(),
      current_employment_status: employmentStatus.trim(),
      wants_scholarship: wantsScholarship.trim(),
      why_learn_this_skill: whyLearnThisSkill.trim(),
    };

    const { error } = await supabase.from("students").insert(registrationData);

    if (error) {
      console.error("Error saving registration:", error);

      return NextResponse.json(
        { error: "Failed to save registration. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Registration received successfully. We will reach out to you through email.",
    });
  } catch (error) {
    console.error("Error processing registration:", error);

    return NextResponse.json(
      { error: "Failed to process registration" },
      { status: 500 },
    );
  }
}
