import { supabase } from '@/lib/supabase';
import { PaymentPlan } from '@/context/PaymentPlanContext';

export const PAYMENT_PLAN_PLACEHOLDER: PaymentPlan = 'Select a plan';
export const EDITABLE_PAYMENT_PLANS: PaymentPlan[] = ['Not Paid Yet'];
export const LOCKED_PAYMENT_PLANS: PaymentPlan[] = ['Fully Paid', '1st installment', '2nd installment'];
export const PAYMENT_PLAN_OPTIONS: PaymentPlan[] = [
  'Not Paid Yet',
  'Fully Paid',
  '1st installment',
  '2nd installment',
];

export function normalizePaymentPlan(plan?: string | null): PaymentPlan {
  if (plan === 'Not Paid Yet' || plan === 'Fully Paid' || plan === '1st installment' || plan === '2nd installment') {
    return plan;
  }

  return PAYMENT_PLAN_PLACEHOLDER;
}

export function isLockedPaymentPlan(plan: PaymentPlan): boolean {
  return LOCKED_PAYMENT_PLANS.includes(plan);
}

export function getPaymentPlanAmounts(plan: PaymentPlan): { amountPaid: number; balanceRemaining: number } | null {
  switch (plan) {
    case 'Fully Paid':
      return { amountPaid: 50000, balanceRemaining: 0 };
    case '1st installment':
      return { amountPaid: 30000, balanceRemaining: 20000 };
    case '2nd installment':
      return { amountPaid: 20000, balanceRemaining: 0 };
    case 'Not Paid Yet':
    case 'Select a plan':
    default:
      return null;
  }
}

export interface StudentData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  reg_date: string;
  reg_time?: string;
  payment_plan: PaymentPlan;
  amount_paid?: number;
  balance_remaining?: number;
  status?: string;
  timestamp: string;
  gender: string;
  state_of_residence: string;
  learning_track: string;
  how_did_you_hear: string;
  has_laptop_and_internet: string;
  current_employment_status: string;
  wants_scholarship: string;
  why_learn_this_skill: string;
}

export class PaymentPlanService {
  // Save or update student with payment plan
  static async upsertStudentPaymentPlan(studentData: StudentData): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const normalizedPlan = normalizePaymentPlan(studentData.payment_plan);
      const paymentAmounts = getPaymentPlanAmounts(normalizedPlan);

      const { data, error } = await supabase.rpc('upsert_student_payment_plan', {
        p_student_id: studentData.id || null,
        p_name: studentData.name,
        p_email: studentData.email,
        p_phone: studentData.phone,
        p_course: studentData.course,
        p_reg_date: studentData.reg_date,
        p_reg_time: studentData.reg_time || null,
        p_payment_plan: normalizedPlan,
        p_amount_paid: paymentAmounts?.amountPaid ?? 0,
        p_balance_remaining: paymentAmounts?.balanceRemaining ?? 0,
        p_status: studentData.status || 'None',
        p_timestamp: studentData.timestamp,
        p_gender: studentData.gender,
        p_state_of_residence: studentData.state_of_residence,
        p_learning_track: studentData.learning_track,
        p_how_did_you_hear: studentData.how_did_you_hear,
        p_has_laptop_and_internet: studentData.has_laptop_and_internet,
        p_current_employment_status: studentData.current_employment_status,
        p_wants_scholarship: studentData.wants_scholarship,
        p_why_learn_this_skill: studentData.why_learn_this_skill
      } as any);

      if (error) {
        console.error('Error upserting student payment plan:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (err) {
      console.error('Unexpected error:', err);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  // Update only payment plan for existing student
  static async updateStudentPaymentPlan(studentId: string, paymentPlan: PaymentPlan): Promise<{ success: boolean; error?: string }> {
    try {
      const normalizedPlan = normalizePaymentPlan(paymentPlan);
      const paymentAmounts = getPaymentPlanAmounts(normalizedPlan);

      console.log('Updating payment plan:', { studentId, paymentPlan: normalizedPlan });
      
      // First try RPC function
      const { data, error } = await supabase.rpc('update_student_payment_plan', {
        p_student_id: studentId,
        p_payment_plan: normalizedPlan
      } as any);

      console.log('Supabase RPC response:', { data, error });

      if (error) {
        console.log('RPC failed, trying direct table update:', error);
        
        // Fallback to direct table update
        const { error: updateError } = await supabase
          .from('students')
          .update({ 
            payment_plan: normalizedPlan,
            amount_paid: paymentAmounts?.amountPaid ?? 0,
            balance_remaining: paymentAmounts?.balanceRemaining ?? 0,
            updated_at: new Date().toISOString()
          } as any)
          .eq('id', studentId);

        if (updateError) {
          console.error('Direct table update failed:', updateError);
          return { success: false, error: updateError.message || 'Failed to update payment plan' };
        }

        console.log('Direct table update succeeded');
        return { success: true };
      }

      return { success: true };
    } catch (err) {
      console.error('Unexpected error:', err);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  // Get payment plan statistics
  static async getPaymentPlanStats(): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const { data, error } = await supabase.rpc('get_payment_plan_stats');

      if (error) {
        console.error('Error getting payment plan stats:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (err) {
      console.error('Unexpected error:', err);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  // Get student by ID
  static async getStudentById(studentId: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', studentId)
        .single();

      if (error) {
        console.error('Error getting student:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (err) {
      console.error('Unexpected error:', err);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  // Get all students
  static async getAllStudents(): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error getting all students:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (err) {
      console.error('Unexpected error:', err);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  // Delete student
  static async deleteStudent(studentId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', studentId);

      if (error) {
        console.error('Error deleting student:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      console.error('Unexpected error:', err);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }
}
