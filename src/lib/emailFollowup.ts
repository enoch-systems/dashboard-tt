import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import type { EmailFollowup, Student } from '@/types/database';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const emailFollowupClient = createClient(supabaseUrl, supabaseAnonKey);

export interface EmailFollowupData {
  studentId: string;
  subject: string;
  message: string;
}

/**
 * Create an email follow-up record
 */
export async function createEmailFollowup(data: EmailFollowupData) {
  const { data: followup, error } = await emailFollowupClient
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
  return followup as EmailFollowup;
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
    const { data: updated, error } = await emailFollowupClient
      .from('email_followups')
      .update({ status: 'sent', sent_at: new Date().toISOString() })
      .eq('id', followup.id)
      .select()
      .single();

    if (error) throw error;
    return updated as EmailFollowup;
  } catch (error) {
    // Update the follow-up status to failed
    await emailFollowupClient
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
  const { data, error } = await emailFollowupClient
    .from('email_followups')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as EmailFollowup[];
}

/**
 * Get all pending follow-ups
 */
export async function getPendingFollowups() {
  const { data, error } = await emailFollowupClient
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
  const { count: sent, error: sentError } = await emailFollowupClient
    .from('email_followups')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'sent');

  const { count: pending, error: pendingError } = await emailFollowupClient
    .from('email_followups')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending');

  const { count: failed, error: failedError } = await emailFollowupClient
    .from('email_followups')
    .select('id', { count: 'exact', head: true })
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
