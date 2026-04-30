import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { emailTemplates, EmailData } from '@/lib/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

function generateEmailHtml(emailType: string, data: EmailData): string {
  switch (emailType) {
    case 'welcome':
      return emailTemplates.welcome(data);
    case 'payment_confirmation':
      return emailTemplates.payment_confirmation(data);
    case 'group_redirection':
      return emailTemplates.group_redirection(data);
    default:
      return '';
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, emailType, data } = body;

    if (!to || !emailType) {
      return NextResponse.json(
        { error: 'Missing required fields: to and emailType' },
        { status: 400 }
      );
    }

    let subject;
    switch (emailType) {
      case 'welcome':
        subject = `Welcome to Tech Trailblazer Academy, ${data.studentName}!`;
        break;
      case 'payment_confirmation':
        subject = `Payment Confirmation - ${data.courseName}`;
        break;
      case 'group_redirection':
        subject = `Join Your WhatsApp Group - ${data.courseName}`;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        );
    }

    const emailHtml = generateEmailHtml(emailType, data);

    const { data: emailData, error } = await resend.emails.send({
      from: 'noreply@techtailblazeracademy.site',
      to: [to],
      subject: subject,
      html: emailHtml,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, data: emailData },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}

