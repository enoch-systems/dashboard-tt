import { supabase } from './supabase';
import type { PaymentRequestInsert, PaymentRequestUpdate, Student } from '@/types/database';

export interface PaymentRequestData {
  studentId: string;
  name: string;
  email: string;
  phone: string;
  amount: number;
  paymentDate: string;
  imageUrl: string;
}

/**
 * Create a payment request
 */
export async function createPaymentRequest(data: PaymentRequestData) {
  const { data: payment, error } = await supabase
    .from('payment_requests')
    .insert({
      student_id: data.studentId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      amount: data.amount,
      payment_date: data.paymentDate,
      image_url: data.imageUrl,
      status: 'pending',
      submitted_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return payment;
}

/**
 * Get all payment requests
 */
export async function getPaymentRequests(filters?: {
  status?: 'pending' | 'approved' | 'rejected';
  studentId?: string;
}) {
  let query = supabase
    .from('payment_requests')
    .select('*, students(*)')
    .order('submitted_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.studentId) {
    query = query.eq('student_id', filters.studentId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * Get a single payment request by ID
 */
export async function getPaymentRequestById(id: string) {
  const { data, error } = await supabase
    .from('payment_requests')
    .select('*, students(*)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Approve a payment request
 */
export async function approvePaymentRequest(
  id: string,
  reviewedBy: string
) {
  // Get the payment request first
  const payment = await getPaymentRequestById(id);

  // Update payment request status
  const { data: updatedPayment, error: paymentError } = await supabase
    .from('payment_requests')
    .update({
      status: 'approved',
      reviewed_at: new Date().toISOString(),
      reviewed_by: reviewedBy,
    })
    .eq('id', id)
    .select()
    .single();

  if (paymentError) throw paymentError;

  // Update student's amount paid and balance
  if (payment.students) {
    const currentAmountPaid = payment.students.amount_paid || 0;
    const currentBalance = payment.students.balance_remaining || 0;
    const paymentAmount = payment.amount;

    const { error: studentError } = await supabase
      .from('students')
      .update({
        amount_paid: currentAmountPaid + paymentAmount,
        balance_remaining: Math.max(0, currentBalance - paymentAmount),
        status: 'Confirmed',
      })
      .eq('id', payment.student_id);

    if (studentError) throw studentError;
  }

  return updatedPayment;
}

/**
 * Reject a payment request
 */
export async function rejectPaymentRequest(
  id: string,
  reviewedBy: string,
  rejectionReason?: string
) {
  const { data, error } = await supabase
    .from('payment_requests')
    .update({
      status: 'rejected',
      reviewed_at: new Date().toISOString(),
      reviewed_by: reviewedBy,
      rejection_reason: rejectionReason,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get payment statistics
 */
export async function getPaymentStats() {
  const { data: pending, error: pendingError } = await supabase
    .from('payment_requests')
    .select('amount', { count: 'exact' })
    .eq('status', 'pending');

  const { data: approved, error: approvedError } = await supabase
    .from('payment_requests')
    .select('amount', { count: 'exact' })
    .eq('status', 'approved');

  const { data: rejected, error: rejectedError } = await supabase
    .from('payment_requests')
    .select('amount', { count: 'exact' })
    .eq('status', 'rejected');

  if (pendingError || approvedError || rejectedError) {
    throw new Error('Error fetching payment stats');
  }

  const pendingAmount = pending?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
  const approvedAmount = approved?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
  const rejectedAmount = rejected?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

  return {
    pending: {
      count: pending?.length || 0,
      amount: pendingAmount,
    },
    approved: {
      count: approved?.length || 0,
      amount: approvedAmount,
    },
    rejected: {
      count: rejected?.length || 0,
      amount: rejectedAmount,
    },
    total: {
      count: (pending?.length || 0) + (approved?.length || 0) + (rejected?.length || 0),
      amount: pendingAmount + approvedAmount + rejectedAmount,
    },
  };
}

/**
 * Get student payment history
 */
export async function getStudentPaymentHistory(studentId: string) {
  const { data, error } = await supabase
    .from('payment_requests')
    .select('*')
    .eq('student_id', studentId)
    .order('submitted_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Get students with pending payments
 */
export async function getStudentsWithPendingPayments() {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .gt('balance_remaining', 0)
    .order('reg_date', { ascending: false });

  if (error) throw error;
  return data;
}
