import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { emailTemplates, EmailData } from '@/lib/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

function generateEmailHtml(emailType: string, data: EmailData): string {
  switch (emailType) {
    case 'welcome':
      return emailTemplates.welcome(data);
    case 'payment_reminder':
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Payment Reminder - ${data.courseName}</h1>
          <p>Dear ${data.studentName},</p>
          <p>This is a friendly reminder that you have an outstanding payment of $${data.amountDue} for your ${data.courseName} course.</p>
          <p>Payment is due by: ${data.dueDate}</p>
          <p>Please ensure your payment is made on time to avoid any interruption in your access to the course materials.</p>
          <p>Thank you for your prompt attention to this matter.</p>
          <p>Best regards,<br />The Team</p>
        </div>
      `;
    case 'installment':
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Installment Payment - ${data.courseName}</h1>
          <p>Dear ${data.studentName},</p>
          <p>This is a reminder for your installment payment for the ${data.courseName} course.</p>
          <p><strong>Installment Details:</strong></p>
          <ul>
            <li>Installment Number: ${data.installmentNumber} of ${data.totalInstallments}</li>
            <li>Amount Due: $${data.installmentAmount}</li>
            <li>Due Date: ${data.dueDate}</li>
          </ul>
          <p>Please make your payment on time to continue enjoying uninterrupted access to your course.</p>
          <p>Thank you for your continued enrollment!</p>
          <p>Best regards,<br />The Team</p>
        </div>
      `;
    case 'full_payment':
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Payment Confirmation - ${data.courseName}</h1>
          <p>Dear ${data.studentName},</p>
          <p>Thank you for your full payment! We're pleased to confirm that we have received your payment of $${data.totalAmount} for the ${data.courseName} course.</p>
          <p><strong>Payment Details:</strong></p>
          <ul>
            <li>Course: ${data.courseName}</li>
            <li>Total Amount Paid: $${data.totalAmount}</li>
            <li>Payment Date: ${data.paymentDate}</li>
            <li>Expected Completion: ${data.completionDate}</li>
          </ul>
          <p>Your enrollment is now fully confirmed and you have complete access to all course materials. We wish you success in your learning journey!</p>
          <p>Best regards,<br />The Team</p>
        </div>
      `;
    case 'resumption':
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Welcome Back to ${data.courseName}!</h1>
          <p>Dear ${data.studentName},</p>
          <p>We're excited to welcome you back to your ${data.courseName} course! Your learning journey continues on ${data.resumptionDate}.</p>
          <p><strong>Your Progress:</strong></p>
          <p>Last completed: ${data.lastProgress}</p>
          <p>You can pick up right where you left off and continue your path to mastery. All your previous progress and materials will be available to you.</p>
          <p>If you have any questions or need assistance getting back into the flow, please don't hesitate to reach out to our support team.</p>
          <p>We're thrilled to have you back and look forward to helping you achieve your learning goals!</p>
          <p>Best regards,<br />The Team</p>
        </div>
      `;
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
      case 'payment_reminder':
        subject = `Payment Reminder - ${data.courseName}`;
        break;
      case 'installment':
        subject = `Installment Payment - ${data.courseName}`;
        break;
      case 'full_payment':
        subject = `Payment Confirmation - ${data.courseName}`;
        break;
      case 'resumption':
        subject = `Welcome Back to ${data.courseName}!`;
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
