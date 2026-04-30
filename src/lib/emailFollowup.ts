import { supabase } from './supabase';
import { Resend } from 'resend';
import type { EmailFollowupInsert, Student } from '@/types/database';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailFollowupData {
  studentId: string;
  subject: string;
  message: string;
}

/**
 * Create an email follow-up record
 */
export async function createEmailFollowup(data: EmailFollowupData) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: followup, error } = await (supabase as any)
    .from('email_followups')
    .insert({
      student_id: data.studentId,
      subject: data.subject,
      message: data.message,
      status: 'pending',
      email_provider: 'resend',
    })
    .select()
    .single();

  if (error) throw error;
  return followup;
}

/**
 * Send an email to a student
 */
export async function sendFollowupEmail(
  studentEmail: string,
  studentName: string,
  subject: string,
  message: string
) {
  try {
    const { data, error } = await resend.emails.send({
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

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

/**
 * Create and send an email follow-up in one operation
 */
export async function createAndSendFollowup(
  student: Student,
  subject: string,
  message: string
) {
  // Create the follow-up record
  const followup = await createEmailFollowup({
    studentId: student.id,
    subject,
    message,
  });

  // Send the email
  try {
    await sendFollowupEmail(student.email, student.name, subject, message);

    // Update the follow-up status to sent
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: updated, error } = await (supabase as any)
      .from('email_followups')
      .update({ status: 'sent', sent_at: new Date().toISOString() })
      .eq('id', followup.id)
      .select()
      .single();

    if (error) throw error;
    return updated;
  } catch (error) {
    // Update the follow-up status to failed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from('email_followups')
      .update({ status: 'failed' })
      .eq('id', followup.id);
    throw error;
  }
}

/**
 * Get all email follow-ups for a student
 */
export async function getStudentFollowups(studentId: string) {
  const { data, error } = await supabase
    .from('email_followups')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Get all pending follow-ups
 */
export async function getPendingFollowups() {
  const { data, error } = await supabase
    .from('email_followups')
    .select('*, students(*)')
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Get follow-up statistics
 */
export async function getFollowupStats() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: sent, error: sentError } = await (supabase as any)
    .from('email_followups')
    .select('id', { count: 'exact' })
    .eq('status', 'sent');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: pending, error: pendingError } = await (supabase as any)
    .from('email_followups')
    .select('id', { count: 'exact' })
    .eq('status', 'pending');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: failed, error: failedError } = await (supabase as any)
    .from('email_followups')
    .select('id', { count: 'exact' })
    .eq('status', 'failed');

  if (sentError || pendingError || failedError) {
    throw new Error('Error fetching follow-up stats');
  }

  return {
    sent: sent || 0,
    pending: pending || 0,
    failed: failed || 0,
    total: (sent || 0) + (pending || 0) + (failed || 0),
  };
}
