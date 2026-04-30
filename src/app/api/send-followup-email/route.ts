import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { studentId, studentName, studentEmail, subject, message } = await request.json();

    if (!studentId || !studentName || !studentEmail || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create email followup record
    const { data: followup, error: followupError } = await supabase
      .from('email_followups')
      .insert({
        student_id: studentId,
        subject,
        message,
        status: 'pending',
        email_provider: 'resend',
      })
      .select()
      .single();

    if (followupError) {
      console.error('Error creating followup record:', followupError);
      return NextResponse.json(
        { error: 'Failed to create followup record' },
        { status: 500 }
      );
    }

    // Send the email
    try {
      const { data: emailData, error: emailError } = await resend.emails.send({
        from: 'Tech Trailblazer Academy <onboarding@resend.dev>',
        to: studentEmail,
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Hello ${studentName},</h2>
            <p style="color: #666; line-height: 1.6;">${message}</p>
            <p style="color: #666; margin-top: 20px;">Best regards,<br>Tech Trailblazer Academy Team</p>
          </div>
        `,
      });

      if (emailError) {
        throw emailError;
      }

      // Update the follow-up status to sent
      const { error: updateError } = await supabase
        .from('email_followups')
        .update({ status: 'sent', sent_at: new Date().toISOString() })
        .eq('id', followup.id);

      if (updateError) {
        console.error('Error updating followup status:', updateError);
      }

      return NextResponse.json({
        success: true,
        followupId: followup.id,
        emailId: emailData?.id
      });

    } catch (emailError) {
      console.error('Error sending email:', emailError);
      
      // Update the follow-up status to failed
      await supabase
        .from('email_followups')
        .update({ status: 'failed' })
        .eq('id', followup.id);

      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error in send-followup-email API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
