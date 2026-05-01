const BANNER_TOP_IMAGE_URL =
  "https://res.cloudinary.com/deafv5ovi/image/upload/f_auto,q_auto,dpr_auto,c_limit,w_1280/banner_pxcyr3";
const BANNER_BOTTOM_IMAGE_URL =
  "https://res.cloudinary.com/deafv5ovi/image/upload/f_auto,q_auto,dpr_auto,c_limit,w_1280/v1777535098/Facebook_rp0eyf.jpg";

export interface EmailData {
  studentName: string;
  courseName?: string;
  startDate?: string;
  scholarshipDate?: string;
  paymentType?: "Fully Paid" | "1st Installment" | "2nd Installment";
  amountPaid?: number;
  paymentDate?: string;
  groupName?: string;
  groupLink?: string;
  [key: string]: unknown;
}

const KICKOFF_DATE = "20th May, 2026";
const PROGRAM_DURATION = "16 weeks";

const baseShell = ({
  title,
  preheader,
  body,
}: {
  title: string;
  preheader: string;
  body: string;
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#111827;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f3f4f6;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.08);">
          <tr>
            <td>
              <img
                src="${BANNER_TOP_IMAGE_URL}"
                alt="Tech Trailblazer Academy"
                width="640"
                style="display:block;width:100%;max-width:640px;height:auto;border:0;outline:none;text-decoration:none;"
              >
            </td>
          </tr>
          <tr>
            <td style="padding:28px 24px;">${body}</td>
          </tr>
          <tr>
            <td style="padding:0 24px 24px 24px;">
              <img
                src="${BANNER_BOTTOM_IMAGE_URL}"
                alt="Tech Trailblazer Academy"
                width="592"
                style="display:block;width:100%;max-width:592px;height:auto;border-radius:10px;border:0;outline:none;text-decoration:none;"
              >
            </td>
          </tr>
          <tr>
            <td style="padding:18px 24px 26px 24px;background:#f8fafc;border-top:1px solid #e5e7eb;">
              <p style="margin:0 0 6px 0;font-size:14px;color:#111827;"><strong>Warm regards,</strong></p>
              <p style="margin:0 0 4px 0;font-size:14px;color:#111827;">Programs Team, Tech Trailblazer Academy</p>
              <p style="margin:0;font-size:12px;color:#6b7280;">Copyright &copy; 2026 Tech Trailblazer Academy. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const courseCareerHint = (courseName?: string) => {
  const course = (courseName || "your selected track").trim();
  const hints: Record<string, string> = {
    "Cybersecurity":
      "You will build practical security skills for threat detection, incident response, and defensive operations.",
    "Data Science":
      "You will learn to turn datasets into insights and predictive models that solve real business problems.",
    "AI Automation":
      "You will build AI-powered workflows that automate repetitive tasks and improve team productivity.",
    "Computer Networking":
      "You will gain hands-on networking skills for modern infrastructure, troubleshooting, and reliable systems.",
    "Ethical Hacking":
      "You will develop penetration testing and vulnerability assessment skills with responsible security practices.",
    "UI/UX Design":
      "You will design user-centered digital products that combine usability, clarity, and strong visual communication.",
    "Full Stack Development":
      "You will build end-to-end web applications from frontend interfaces to backend services and deployment.",
    "Frontend Development":
      "You will create responsive, accessible interfaces and production-grade user experiences.",
    "Backend Development":
      "You will design APIs, data flows, and scalable server-side architecture for robust applications.",
    "Web Development":
      "You will build complete web solutions with modern tools, clean code practices, and real project delivery.",
    "Digital Marketing":
      "You will learn performance-driven marketing strategies for growth, conversion, and brand visibility.",
    "Cloud Computing":
      "You will deploy and manage scalable cloud infrastructure and modern application environments.",
  };

  return hints[course] || `You are on track to build real-world capability in ${course}.`;
};

// Course to WhatsApp Group Mapping
const courseGroupMapping: { [key: string]: { name: string; link: string } } = {
  'UI/UX Design': {
    name: 'UI/UX Design Group',
    link: 'https://chat.whatsapp.com/BQ4M5ms4h6u5VnEqzBQE1T'
  },
  'Cloud computing': {
    name: 'Cloud Computing Group',
    link: 'https://chat.whatsapp.com/LThgVYa8ctuEUqow4YjZuI'
  },
  'Web Development': {
    name: 'Web Development Group',
    link: 'https://chat.whatsapp.com/GpwwWZbl8p3BDHwKmPFSvn'
  },
  'Mobile Development': {
    name: 'Mobile Development Group',
    link: 'https://chat.whatsapp.com/CMqxNxiy2toJYJdAvZtEKx'
  },
  'Data Science': {
    name: 'Data Science Group',
    link: 'https://chat.whatsapp.com/DKMXWi3fvmHEsb5bimLaJy'
  },
  'Artificial Intelligence': {
    name: 'Artificial Intelligence Group',
    link: 'https://chat.whatsapp.com/GB6UVLaEVh1KkgBWUaZjw9'
  },
  'Cybersecurity': {
    name: 'Cybersecurity Group',
    link: 'https://chat.whatsapp.com/IKKOqN0a3EpHPHoPCiE9tL'
  },
  'Digital Marketing': {
    name: 'Digital Marketing Group',
    link: 'https://chat.whatsapp.com/HwCcz7RG0YAECqChTUGr9d'
  },
  // Fallback mappings for variations
  '3D Animation': {
    name: 'Data Science Group',
    link: 'https://chat.whatsapp.com/DKMXWi3fvmHEsb5bimLaJy'
  },
  'Graphic Design': {
    name: 'Digital Marketing Group',
    link: 'https://chat.whatsapp.com/HwCcz7RG0YAECqChTUGr9d'
  },
  'Front End Development': {
    name: 'Web Development Group',
    link: 'https://chat.whatsapp.com/GpwwWZbl8p3BDHwKmPFSvn'
  },
  'UI/UX': {
    name: 'UI/UX Design Group',
    link: 'https://chat.whatsapp.com/BQ4M5ms4h6u5VnEqzBQE1T'
  },
  'Mobile App Development': {
    name: 'Mobile Development Group',
    link: 'https://chat.whatsapp.com/CMqxNxiy2toJYJdAvZtEKx'
  },
  'Backend Development': {
    name: 'Web Development Group',
    link: 'https://chat.whatsapp.com/GpwwWZbl8p3BDHwKmPFSvn'
  },
  'Cloud Computing': {
    name: 'Cloud Computing Group',
    link: 'https://chat.whatsapp.com/LThgVYa8ctuEUqow4YjZuI'
  },
  'Computer Networking': {
    name: 'Cybersecurity Group',
    link: 'https://chat.whatsapp.com/IKKOqN0a3EpHPHoPCiE9tL'
  },
  'AI Automation': {
    name: 'Artificial Intelligence Group',
    link: 'https://chat.whatsapp.com/GB6UVLaEVh1KkgBWUaZjw9'
  }
};

export function normalizeCourseName(courseName?: string) {
  return (courseName || "")
    .replace(" - Select a plan", "")
    .replace(" - Not Paid Yet", "")
    .trim();
}

export function getGroupInfoForCourse(courseName?: string) {
  const cleanCourseName = normalizeCourseName(courseName);
  return {
    cleanCourseName,
    groupInfo: courseGroupMapping[cleanCourseName] || {
      name: "General Group",
      link: "https://chat.whatsapp.com/YOUR_GENERAL_LINK",
    },
  };
}

export function getEmailSubject(emailType: string, data: EmailData) {
  switch (emailType) {
    case "welcome":
      return `Welcome to Tech Trailblazer Academy, ${data.studentName}`;
    case "payment_confirmation":
      if (data.paymentType === "Fully Paid") {
        return `Payment Confirmed - Full Tuition Received (${normalizeCourseName(data.courseName)})`;
      }
      return `Payment Confirmed - ${data.paymentType} (${normalizeCourseName(data.courseName)})`;
    case "group_redirection": {
      const { cleanCourseName } = getGroupInfoForCourse(data.courseName);
      return `Join Your ${cleanCourseName || "Course"} WhatsApp Group`;
    }
    default:
      return "Tech Trailblazer Academy Update";
  }
}

export const emailTemplates = {
  welcome: (data: EmailData): string =>
    baseShell({
      title: "Welcome to Tech Trailblazer Academy",
      preheader: `${data.studentName}, congratulations! You have been selected for the scholarship cohort starting ${KICKOFF_DATE}.`,
      body: `
        <p style="margin:0 0 16px 0;font-size:18px;font-weight:700;color:#111827;">Hey ${data.studentName},</p>
        <p style="margin:0 0 16px 0;font-size:16px;line-height:1.7;color:#374151;"><strong>Congratulations - you have been selected for the Tech Trailblazer Academy Scholarship Bootcamp.</strong></p>
        <p style="margin:0 0 16px 0;font-size:16px;line-height:1.7;color:#374151;">
          This is a major milestone, and we are genuinely excited to welcome you into our learning community.
          Your decision to build a career in <strong>${normalizeCourseName(data.courseName) || "your selected tech track"}</strong> is bold and future-focused.
          ${courseCareerHint(data.courseName)}
        </p>
        <div style="margin:20px 0;padding:18px;border:1px solid #e5e7eb;border-radius:10px;background:#f9fafb;">
          <p style="margin:0 0 8px 0;font-size:15px;color:#111827;"><strong>Scholarship Status:</strong> Selected</p>
          <p style="margin:0 0 8px 0;font-size:15px;color:#111827;"><strong>Program Track:</strong> ${normalizeCourseName(data.courseName) || "Selected Track"}</p>
          <p style="margin:0 0 8px 0;font-size:15px;color:#111827;"><strong>Class Kickoff:</strong> ${data.startDate || KICKOFF_DATE}</p>
          <p style="margin:0;font-size:15px;color:#111827;"><strong>Format:</strong> Virtual live classes (${PROGRAM_DURATION})</p>
        </div>

        <h3 style="margin:24px 0 12px 0;font-size:17px;line-height:1.4;color:#111827;">What your virtual learning experience will look like</h3>
        <p style="margin:0 0 12px 0;font-size:16px;line-height:1.7;color:#374151;">
          Your cohort runs fully online, so you can join from anywhere with stable internet access.
          Classes include instructor-led live sessions, guided practical tasks, feedback loops, and accountability checkpoints to keep you progressing every week.
        </p>
        <p style="margin:0 0 12px 0;font-size:16px;line-height:1.7;color:#374151;">
          You will not be learning in isolation: you will be part of a structured community where you can ask questions, collaborate with peers, and get clarity from mentors in real time.
        </p>

        <h3 style="margin:24px 0 12px 0;font-size:17px;line-height:1.4;color:#111827;">What you stand to gain from this scholarship bootcamp</h3>
        <div style="margin:0 0 16px 0;padding:16px 18px;border:1px solid #e5e7eb;border-radius:10px;background:#ffffff;">
          <ul style="margin:0;padding-left:20px;color:#374151;font-size:15px;line-height:1.7;">
            <li style="margin-bottom:6px;">Hands-on project experience in your selected track</li>
            <li style="margin-bottom:6px;">Industry-relevant skills employers are actively hiring for</li>
            <li style="margin-bottom:6px;">Portfolio-ready outputs you can showcase publicly</li>
            <li style="margin-bottom:6px;">Mentorship, peer community, and practical guidance</li>
            <li style="margin-bottom:6px;">Career growth support with real implementation focus</li>
            <li style="margin-bottom:0;">A clear path from beginner/intermediate level to job-ready execution</li>
          </ul>
        </div>

        <p style="margin:0 0 12px 0;font-size:16px;line-height:1.7;color:#374151;">
          At Tech Trailblazer Academy, we believe world-class tech education should be practical, accessible, and transformational.
          This scholarship gives you the structure and support to move from intention to measurable progress.
        </p>

        <p style="margin:0 0 16px 0;font-size:16px;line-height:1.7;color:#374151;">
          In the coming days, we will send your onboarding instructions, class schedule, and preparation checklist.
          Please watch your email closely so you do not miss key announcements before kickoff.
        </p>
        <p style="margin:0;font-size:16px;line-height:1.7;color:#374151;">
          Once again, congratulations on your scholarship selection. We are proud to have you with us.
          Let us build your next chapter in tech - together.
        </p>
      `,
    }),
  payment_confirmation: (data: EmailData): string => {
    const paymentType = data.paymentType || "Fully Paid";
    const messageByType: Record<string, string> = {
      "Fully Paid":
        "Fantastic commitment. Your full tuition has been received and your enrollment is now fully secured.",
      "1st Installment":
        "Great start. We have received your first installment and your onboarding remains active.",
      "2nd Installment":
        "Excellent follow-through. Your second installment has been received and your payment update is now complete.",
    };

    return baseShell({
      title: "Payment Confirmation",
      preheader: `${paymentType} payment confirmed for ${data.studentName}.`,
      body: `
        <p style="margin:0 0 16px 0;font-size:18px;font-weight:700;color:#111827;">Hi ${data.studentName},</p>
        <p style="margin:0 0 16px 0;font-size:16px;line-height:1.7;color:#374151;">This is to confirm that we have received your payment for <strong>${normalizeCourseName(data.courseName) || "your selected course"}</strong>.</p>
        <p style="margin:0 0 16px 0;font-size:16px;line-height:1.7;color:#374151;">${messageByType[paymentType] || messageByType["Fully Paid"]}</p>
        <div style="margin:20px 0;padding:18px;border:1px solid #d1fae5;border-radius:10px;background:#ecfdf5;">
          <p style="margin:0 0 8px 0;font-size:15px;color:#065f46;"><strong>Payment Type:</strong> ${paymentType}</p>
          <p style="margin:0 0 8px 0;font-size:15px;color:#065f46;"><strong>Amount Received:</strong> N${Number(data.amountPaid || 0).toLocaleString()}</p>
          <p style="margin:0;font-size:15px;color:#065f46;"><strong>Date:</strong> ${data.paymentDate || new Date().toLocaleDateString("en-GB")}</p>
        </div>
        <p style="margin:0;font-size:16px;line-height:1.7;color:#374151;">Thank you for your trust. We look forward to seeing you in class on ${KICKOFF_DATE}.</p>
      `,
    });
  },
  group_redirection: (data: EmailData): string => {
    const { cleanCourseName, groupInfo } = getGroupInfoForCourse(data.courseName);
    return baseShell({
      title: "Join Your Course Community",
      preheader: `Join your ${cleanCourseName || "course"} WhatsApp group before classes start.`,
      body: `
        <p style="margin:0 0 16px 0;font-size:18px;font-weight:700;color:#111827;">Hi ${data.studentName},</p>
        <p style="margin:0 0 16px 0;font-size:16px;line-height:1.7;color:#374151;">
          Your learning community is ready. Based on your selected course, you should join <strong>${groupInfo.name}</strong> to get important updates and pre-class support.
        </p>
        <div style="margin:20px 0;padding:18px;border:1px solid #e5e7eb;border-radius:10px;background:#f9fafb;">
          <p style="margin:0 0 8px 0;font-size:15px;color:#111827;"><strong>Course:</strong> ${cleanCourseName || "Selected Track"}</p>
          <p style="margin:0 0 8px 0;font-size:15px;color:#111827;"><strong>Group:</strong> ${groupInfo.name}</p>
          <p style="margin:0;font-size:15px;color:#111827;"><strong>Kickoff Date:</strong> ${KICKOFF_DATE}</p>
        </div>
        <div style="text-align:center;margin:26px 0;">
          <a href="${groupInfo.link}" style="background:#16a34a;color:#fff;text-decoration:none;padding:13px 24px;border-radius:8px;font-size:15px;font-weight:700;display:inline-block;">
            Join WhatsApp Group
          </a>
        </div>
        <p style="margin:0;font-size:16px;line-height:1.7;color:#374151;">
          Please join now so you do not miss orientation updates, first-week instructions, and live communication from the team.
        </p>
      `,
    });
  },
};
