"use client";

import React, { useEffect, useRef, useState } from "react";

interface RegistrationFormData {
  fullName: string;
  phoneWhatsApp: string;
  gender: string;
  stateOfResidence: string;
  learningTrack: string;
  howHeardAboutUs: string;
  hasLaptopAndInternet: string;
  email: string;
  employmentStatus: string;
  wantsScholarship: string;
  whyLearnThisSkill: string;
}

type SubmissionState =
  | { type: "success"; message: string }
  | { type: "error"; message: string }
  | null;

type AvailabilityStatus = "idle" | "checking" | "available" | "taken";

interface AvailabilityResponse {
  emailExists: boolean;
  phoneExists: boolean;
}

const initialFormData: RegistrationFormData = {
  fullName: "",
  phoneWhatsApp: "",
  gender: "",
  stateOfResidence: "",
  learningTrack: "",
  howHeardAboutUs: "",
  hasLaptopAndInternet: "",
  email: "",
  employmentStatus: "",
  wantsScholarship: "",
  whyLearnThisSkill: "",
};

const nigerianStates = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

const learningTracks = [
  "Cybersecurity",
  "Data Science",
  "AI Automation",
  "Computer Networking",
  "Ethical Hacking",
  "UI/UX Design",
  "Full Stack Development",
  "Frontend Development",
  "Backend Development",
  "Web Development",
  "Digital Marketing",
  "Cloud Computing",
];

const employmentStatuses = [
  "Student",
  "Employed",
  "Unemployed",
  "Self-Employed",
  "Freelancer",
  "NYSC",
];

const discoveryChannels = [
  "Facebook",
  "Instagram",
  "LinkedIn",
  "WhatsApp",
  "Friend or Referral",
  "Google Search",
  "Community Event",
  "Advertisement",
  "Other",
];

const whatsappGroupLink =
  "https://chat.whatsapp.com/Bi5XuFToVdjBPRvIawWz5W";

const inputClassName =
  "w-full rounded-2xl border border-stone-200 bg-white px-4 py-3.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#9f0712] focus:ring-4 focus:ring-[#9f0712]/10";

const duplicateInputClassName =
  "border-rose-300 bg-rose-50/70 focus:border-rose-500 focus:ring-rose-500/10";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

function FieldLabel({
  children,
  hint,
}: {
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="mb-2 block text-sm font-semibold text-slate-800">
      {children}
      {hint ? (
        <span className="ml-2 text-xs font-medium text-slate-500">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

export function RegistrationForm() {
  const [formData, setFormData] = useState<RegistrationFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionState, setSubmissionState] = useState<SubmissionState>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    email: string | null;
    phoneWhatsApp: string | null;
  }>({
    email: null,
    phoneWhatsApp: null,
  });
  const [availabilityState, setAvailabilityState] = useState<{
    email: AvailabilityStatus;
    phoneWhatsApp: AvailabilityStatus;
  }>({
    email: "idle",
    phoneWhatsApp: "idle",
  });
  const emailRequestRef = useRef(0);
  const phoneRequestRef = useRef(0);

  const getInputStyles = (hasError: boolean) =>
    hasError ? `${inputClassName} ${duplicateInputClassName}` : inputClassName;

  const checkExistingStudent = async ({
    email,
    phone,
  }: {
    email?: string;
    phone?: string;
  }) => {
    const searchParams = new URLSearchParams();

    if (email) {
      searchParams.set("email", email);
    }

    if (phone) {
      searchParams.set("phone", phone);
    }

    const response = await fetch(`/api/register?${searchParams.toString()}`);
    const result = (await response.json().catch(() => null)) as AvailabilityResponse | null;

    if (!response.ok || !result) {
      throw new Error("Failed to verify student details.");
    }

    return result;
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (name === "email" || name === "phoneWhatsApp") {
      setFieldErrors((previous) => ({
        ...previous,
        [name]: null,
      }));
      setAvailabilityState((previous) => ({
        ...previous,
        [name]: "idle",
      }));
    }
  };

  useEffect(() => {
    const currentEmail = normalizeEmail(formData.email);

    if (!currentEmail || !emailPattern.test(currentEmail)) {
      setFieldErrors((previous) => ({ ...previous, email: null }));
      setAvailabilityState((previous) => ({ ...previous, email: "idle" }));
      return;
    }

    const requestId = emailRequestRef.current + 1;
    emailRequestRef.current = requestId;

    const timeoutId = window.setTimeout(async () => {
      setAvailabilityState((previous) => ({ ...previous, email: "checking" }));

      try {
        const result = await checkExistingStudent({ email: currentEmail });

        if (emailRequestRef.current !== requestId) {
          return;
        }

        setFieldErrors((previous) => ({
          ...previous,
          email: result.emailExists ? "Email already exists." : null,
        }));
        setAvailabilityState((previous) => ({
          ...previous,
          email: result.emailExists ? "taken" : "available",
        }));
      } catch {
        if (emailRequestRef.current !== requestId) {
          return;
        }

        setAvailabilityState((previous) => ({ ...previous, email: "idle" }));
      }
    }, 450);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [formData.email]);

  useEffect(() => {
    const currentPhone = formData.phoneWhatsApp.trim();
    const normalizedPhone = normalizePhone(currentPhone);

    if (!currentPhone || normalizedPhone.length < 7) {
      setFieldErrors((previous) => ({ ...previous, phoneWhatsApp: null }));
      setAvailabilityState((previous) => ({
        ...previous,
        phoneWhatsApp: "idle",
      }));
      return;
    }

    const requestId = phoneRequestRef.current + 1;
    phoneRequestRef.current = requestId;

    const timeoutId = window.setTimeout(async () => {
      setAvailabilityState((previous) => ({
        ...previous,
        phoneWhatsApp: "checking",
      }));

      try {
        const result = await checkExistingStudent({ phone: currentPhone });

        if (phoneRequestRef.current !== requestId) {
          return;
        }

        setFieldErrors((previous) => ({
          ...previous,
          phoneWhatsApp: result.phoneExists
            ? "Phone number already exists."
            : null,
        }));
        setAvailabilityState((previous) => ({
          ...previous,
          phoneWhatsApp: result.phoneExists ? "taken" : "available",
        }));
      } catch {
        if (phoneRequestRef.current !== requestId) {
          return;
        }

        setAvailabilityState((previous) => ({
          ...previous,
          phoneWhatsApp: "idle",
        }));
      }
    }, 450);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [formData.phoneWhatsApp]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });

    const hasEmptyRequiredField = Object.values(formData).some(
      (value) => value.trim() === "",
    );

    if (hasEmptyRequiredField) {
      setSubmissionState({
        type: "error",
        message: "Please complete all required fields before submitting.",
      });
      return;
    }

    if (
      availabilityState.email === "checking" ||
      availabilityState.phoneWhatsApp === "checking"
    ) {
      setSubmissionState({
        type: "error",
        message: "Please wait while we verify the email and phone number.",
      });
      return;
    }

    if (fieldErrors.email || fieldErrors.phoneWhatsApp) {
      setSubmissionState({
        type: "error",
        message: fieldErrors.email || fieldErrors.phoneWhatsApp || "Duplicate record found.",
      });
      return;
    }

    setSubmissionState(null);

    try {
      const availabilityResult = await checkExistingStudent({
        email: normalizeEmail(formData.email),
        phone: formData.phoneWhatsApp.trim(),
      });

      if (availabilityResult.emailExists || availabilityResult.phoneExists) {
        setFieldErrors({
          email: availabilityResult.emailExists ? "Email already exists." : null,
          phoneWhatsApp: availabilityResult.phoneExists
            ? "Phone number already exists."
            : null,
        });
        setAvailabilityState({
          email: availabilityResult.emailExists ? "taken" : "available",
          phoneWhatsApp: availabilityResult.phoneExists ? "taken" : "available",
        });
        setSubmissionState({
          type: "error",
          message:
            availabilityResult.emailExists && availabilityResult.phoneExists
              ? "Email and phone number already exist."
              : availabilityResult.emailExists
                ? "Email already exists."
                : "Phone number already exists.",
        });
        return;
      }

      setIsSubmitting(true);

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        if (result?.emailExists || result?.phoneExists) {
          setFieldErrors({
            email: result.emailExists ? "Email already exists." : null,
            phoneWhatsApp: result.phoneExists ? "Phone number already exists." : null,
          });
          setAvailabilityState({
            email: result.emailExists ? "taken" : "available",
            phoneWhatsApp: result.phoneExists ? "taken" : "available",
          });
        }

        throw new Error(
          result?.error || "We could not submit your registration right now.",
        );
      }

      setSubmissionState({
        type: "success",
        message:
          "Thank you. Your registration has been received successfully. We will reach out to you via email.",
      });
      setFormData(initialFormData);
      setFieldErrors({
        email: null,
        phoneWhatsApp: null,
      });
      setAvailabilityState({
        email: "idle",
        phoneWhatsApp: "idle",
      });
    } catch (error) {
      setSubmissionState({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCheckingAvailability =
    availabilityState.email === "checking" ||
    availabilityState.phoneWhatsApp === "checking";
  const hasDuplicateFieldError =
    Boolean(fieldErrors.email) || Boolean(fieldErrors.phoneWhatsApp);
  const isSubmitDisabled = isSubmitting || isCheckingAvailability || hasDuplicateFieldError;

  return (
    <div className="min-h-screen bg-[#f7f0f0] text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(120,120,120,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(120,120,120,0.12)_1px,transparent_1px)] bg-[size:72px_72px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(159,7,18,0.12),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(0,0,0,0.08),_transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          {submissionState ? (
            <div
              aria-live="polite"
              className={`mb-6 rounded-[26px] border px-5 py-4 shadow-sm sm:px-6 ${
                submissionState.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                  : "border-rose-200 bg-rose-50 text-rose-800"
              }`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold">
                    {submissionState.message}
                  </p>
                  {submissionState.type === "success" ? (
                    <p className="mt-1 text-sm text-emerald-800">
                      Follow up via our WhatsApp community for updates and
                      announcements.
                    </p>
                  ) : null}
                </div>
                {submissionState.type === "success" ? (
                  <a
                    href={whatsappGroupLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-[#0f172a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#9f0712]"
                  >
                    Join WhatsApp
                  </a>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr]">
            {/* Form Section - Shows first on mobile (order-1), second on desktop (lg:order-2) */}
            <div className="order-1 lg:order-2 rounded-[30px] border border-[#9f0712]/10 bg-white p-5 text-slate-900 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-8">
              <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9f0712]">
                    Application Form
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                    Enter student details
                  </h2>
                </div>
                <p className="text-sm text-slate-500">
                  All fields are required
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <section className="space-y-5">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Personal Information
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Basic details for student identification and contact.
                    </p>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <FieldLabel>Full Name *</FieldLabel>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className={inputClassName}
                        placeholder="Enter student full name"
                      />
                    </div>

                    <div>
                      <FieldLabel>Email Address *</FieldLabel>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className={getInputStyles(Boolean(fieldErrors.email))}
                        placeholder="student@example.com"
                      />
                      {availabilityState.email === "checking" ? (
                        <p className="mt-2 text-xs font-medium text-slate-500">
                          Checking email...
                        </p>
                      ) : null}
                      {fieldErrors.email ? (
                        <p className="mt-2 text-xs font-medium text-rose-600">
                          {fieldErrors.email}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <FieldLabel>Phone / WhatsApp Number *</FieldLabel>
                      <input
                        type="tel"
                        name="phoneWhatsApp"
                        value={formData.phoneWhatsApp}
                        onChange={handleInputChange}
                        required
                        className={getInputStyles(Boolean(fieldErrors.phoneWhatsApp))}
                        placeholder="0800 000 0000"
                      />
                      {availabilityState.phoneWhatsApp === "checking" ? (
                        <p className="mt-2 text-xs font-medium text-slate-500">
                          Checking phone number...
                        </p>
                      ) : null}
                      {fieldErrors.phoneWhatsApp ? (
                        <p className="mt-2 text-xs font-medium text-rose-600">
                          {fieldErrors.phoneWhatsApp}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <FieldLabel>Sex *</FieldLabel>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        required
                        className={inputClassName}
                      >
                        <option value="">Select sex</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <FieldLabel>State of Origin *</FieldLabel>
                      <select
                        name="stateOfResidence"
                        value={formData.stateOfResidence}
                        onChange={handleInputChange}
                        required
                        className={inputClassName}
                      >
                        <option value="">Select state of origin</option>
                        {nigerianStates.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </section>

                <section className="space-y-5 border-t border-slate-200 pt-8">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Academic Profile
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Select the course and indicate readiness for the program.
                    </p>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <FieldLabel>Course Applying For *</FieldLabel>
                      <select
                        name="learningTrack"
                        value={formData.learningTrack}
                        onChange={handleInputChange}
                        required
                        className={inputClassName}
                      >
                        <option value="">Select a course</option>
                        {learningTracks.map((track) => (
                          <option key={track} value={track}>
                            {track}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <FieldLabel>Employment Status *</FieldLabel>
                      <select
                        name="employmentStatus"
                        value={formData.employmentStatus}
                        onChange={handleInputChange}
                        required
                        className={inputClassName}
                      >
                        <option value="">Select status</option>
                        {employmentStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <FieldLabel>Do You Have a Laptop? *</FieldLabel>
                      <select
                        name="hasLaptopAndInternet"
                        value={formData.hasLaptopAndInternet}
                        onChange={handleInputChange}
                        required
                        className={inputClassName}
                      >
                        <option value="">Select option</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>

                    <div>
                      <FieldLabel>Scholarship Interest *</FieldLabel>
                      <select
                        name="wantsScholarship"
                        value={formData.wantsScholarship}
                        onChange={handleInputChange}
                        required
                        className={inputClassName}
                      >
                        <option value="">Select option</option>
                        <option value="Interested">Interested</option>
                        <option value="Not Interested">Not Interested</option>
                      </select>
                    </div>
                  </div>
                </section>

                <section className="space-y-5 border-t border-slate-200 pt-8">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Application Context
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Tell us how the student found the program and why they are applying.
                    </p>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <FieldLabel>How Did You Hear About Us? *</FieldLabel>
                      <select
                        name="howHeardAboutUs"
                        value={formData.howHeardAboutUs}
                        onChange={handleInputChange}
                        required
                        className={inputClassName}
                      >
                        <option value="">Select source</option>
                        {discoveryChannels.map((channel) => (
                          <option key={channel} value={channel}>
                            {channel}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2 rounded-2xl border border-[#9f0712]/10 bg-[#fff7f7] p-4 text-sm text-slate-700">
                      Need help with your application? Submit this form and follow
                      up through our WhatsApp community for updates.
                    </div>

                    <div className="md:col-span-2">
                      <FieldLabel
                        hint="Brief but specific"
                      >
                        Why Do You Want To Learn This Skill? *
                      </FieldLabel>
                      <textarea
                        name="whyLearnThisSkill"
                        value={formData.whyLearnThisSkill}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        className={inputClassName}
                        placeholder="Explain the student's interest, goals, or intended outcome from the course."
                      />
                    </div>
                  </div>
                </section>

                <button
                  type="submit"
                  disabled={isSubmitDisabled}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-[#9f0712] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#7f000a] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting
                    ? "Submitting registration..."
                    : isCheckingAvailability
                      ? "Checking student details..."
                      : "Submit Registration"}
                </button>
              </form>
            </div>

            {/* Info Section - Shows second on mobile (order-2), first on desktop (lg:order-1) */}
            <div className="order-2 lg:order-1 space-y-6 rounded-[30px] border border-[#9f0712]/15 bg-white/85 p-6 text-slate-900 shadow-[0_20px_60px_rgba(159,7,18,0.08)] backdrop-blur sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="inline-flex items-center rounded-full border border-[#9f0712]/15 bg-[#9f0712] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-white">
                  Tech Trailblazer Academy
                </div>
                <a
                  href={whatsappGroupLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[#9f0712]/15 bg-white px-4 py-2 text-sm font-semibold text-[#9f0712] transition hover:bg-[#9f0712] hover:text-white"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-white">
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M20.52 3.48A11.86 11.86 0 0012.06 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.15 1.59 5.95L0 24l6.33-1.66a11.8 11.8 0 005.72 1.46h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.44-8.42zm-8.46 18.3h-.01a9.8 9.8 0 01-5-1.37l-.36-.21-3.76.99 1-3.66-.24-.38A9.8 9.8 0 012.25 11.9C2.25 6.49 6.65 2.1 12.06 2.1c2.62 0 5.08 1.02 6.93 2.87a9.72 9.72 0 012.87 6.93c0 5.41-4.4 9.88-9.8 9.88zm5.38-7.36c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.08-.3-.15-1.26-.46-2.4-1.46-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.08-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.08 4.48.71.31 1.27.49 1.7.62.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.69.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35z" />
                    </svg>
                  </span>
                  Join WhatsApp
                </a>
              </div>

              <div className="space-y-5">
                <div className="inline-flex bg-[#7f000a] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white shadow-lg shadow-[#7f000a]/20">
                  Tech Trailblazer Scholarship
                </div>
                <div className="space-y-3">
                  <h1 className="text-4xl font-black uppercase tracking-tight text-[#9f0712] sm:text-5xl lg:text-6xl">
                    Trailblazer <span className="text-slate-950">Bootcamp</span>
                  </h1>
                  <div className="inline-flex border-2 border-slate-900 bg-white px-5 py-2 text-lg font-black uppercase tracking-wide text-slate-950">
                    Cohort 1
                  </div>
                </div>
                <p className="max-w-2xl text-sm leading-7 text-slate-700 sm:text-base">
                  Join our intensive virtual tech skill training program and
                  complete this application professionally. Your submission goes
                  directly into our student records for follow-up and review.
                </p>
              </div>

              <div className="rounded-[28px] bg-[linear-gradient(135deg,#a30713_0%,#540107_100%)] p-5 text-white shadow-xl shadow-[#9f0712]/20">
                <div className="mb-4 inline-flex rounded-full bg-black px-5 py-2 text-sm font-bold uppercase tracking-wide text-white">
                  Learning Tracks
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2 text-base">
                    <p>• Cybersecurity</p>
                    <p>• Data Science</p>
                    <p>• AI Automation</p>
                    <p>• Computer Networking</p>
                    <p>• Ethical Hacking</p>
                    <p>• UI/UX Design</p>
                  </div>
                  <div className="space-y-2 text-base">
                    <p>• Full Stack Development</p>
                    <p>• Frontend Development</p>
                    <p>• Backend Development</p>
                    <p>• Web Development</p>
                    <p>• Digital Marketing</p>
                    <p>• Cloud Computing</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[28px] bg-[linear-gradient(180deg,#ff8f96_0%,#f4a1a7_100%)] p-5 text-slate-950 shadow-lg">
                  <div className="mb-4 inline-flex rounded-full bg-black px-5 py-2 text-sm font-bold uppercase tracking-wide text-white">
                    Program Benefits
                  </div>
                  <div className="space-y-2 text-sm font-medium">
                    <p>• Live classes</p>
                    <p>• Certificate pathway</p>
                    <p>• Capstone project</p>
                    <p>• CV and LinkedIn optimization</p>
                    <p>• Mentorship</p>
                    <p>• Community access and resources</p>
                  </div>
                </div>
                <div className="space-y-4 rounded-[28px] border border-[#9f0712]/10 bg-[#faf6f6] p-5">
                  <div className="rounded-2xl border border-stone-200 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Duration
                    </p>
                    <p className="mt-2 text-lg font-black text-slate-950">
                      16 weeks (4 months)
                    </p>
                  </div>
                  <div className="rounded-2xl border border-stone-200 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Format
                    </p>
                    <p className="mt-2 text-lg font-black text-slate-950">
                      Virtual (Online)
                    </p>
                  </div>
                  <a
                    href={whatsappGroupLink}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-3 rounded-2xl bg-[linear-gradient(135deg,#25D366_0%,#128C7E_100%)] px-4 py-3 text-white shadow-lg shadow-[#25D366]/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#25D366]/30"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#25D366] shadow-sm transition-transform duration-200 group-hover:scale-105">
                      <svg
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M20.52 3.48A11.86 11.86 0 0012.06 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.15 1.59 5.95L0 24l6.33-1.66a11.8 11.8 0 005.72 1.46h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.44-8.42zm-8.46 18.3h-.01a9.8 9.8 0 01-5-1.37l-.36-.21-3.76.99 1-3.66-.24-.38A9.8 9.8 0 012.25 11.9C2.25 6.49 6.65 2.1 12.06 2.1c2.62 0 5.08 1.02 6.93 2.87a9.72 9.72 0 012.87 6.93c0 5.41-4.4 9.88-9.8 9.88zm5.38-7.36c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.08-.3-.15-1.26-.46-2.4-1.46-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.08-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.08 4.48.71.31 1.27.49 1.7.62.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.69.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35z" />
                      </svg>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-white/80">
                        Follow Up
                      </span>
                      <span className="mt-1 block text-sm font-bold leading-tight sm:text-[15px]">
                        Join our WhatsApp community
                      </span>
                    </span>
                    <span className="hidden text-sm font-semibold text-white/90 sm:inline">
                      Open
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
