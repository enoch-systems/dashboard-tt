import { supabase } from './supabase';
import type { Student as SupabaseStudent } from '@/types/database';

export interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  course: string;
  regDate: string;
  regTime?: string;
  paymentPlan: string;
  amountPaid: number;
  balanceRemaining: number;
  status: "None" | "Awaiting" | "Confirmed";
  timestamp: string;
  gender: string;
  stateOfResidence: string;
  learningTrack: string;
  howDidYouHear: string;
  hasLaptopAndInternet: string;
  currentEmploymentStatus: string;
  wantsScholarship: string;
  whyLearnThisSkill: string;
  lastProgress?: string;
  originalId: string;
}

function mapSupabaseStudent(student: SupabaseStudent, index: number): Student {
  return {
    id: index + 1,
    name: student.name,
    email: student.email,
    phone: student.phone,
    course: student.course,
    regDate: student.reg_date,
    regTime: student.reg_time || undefined,
    paymentPlan: student.payment_plan,
    amountPaid: student.amount_paid,
    balanceRemaining: student.balance_remaining,
    status: student.status as "None" | "Awaiting" | "Confirmed",
    timestamp: student.timestamp,
    gender: student.gender,
    stateOfResidence: student.state_of_residence,
    learningTrack: student.learning_track,
    howDidYouHear: student.how_did_you_hear,
    hasLaptopAndInternet: student.has_laptop_and_internet,
    currentEmploymentStatus: student.current_employment_status,
    wantsScholarship: student.wants_scholarship,
    whyLearnThisSkill: student.why_learn_this_skill,
    lastProgress: student.last_progress || undefined,
    originalId: student.id,
  };
}

export async function fetchStudents(): Promise<Student[]> {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching students:', error);
    throw new Error(`Failed to fetch students: ${error.message}`);
  }

  if (!data) {
    return [];
  }

  return data.map(mapSupabaseStudent);
}

export async function searchStudents(searchTerm: string): Promise<Student[]> {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,course.ilike.%${searchTerm}%`)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error searching students:', error);
    throw new Error(`Failed to search students: ${error.message}`);
  }

  if (!data) {
    return [];
  }

  return data.map(mapSupabaseStudent);
}

export async function getStudentById(id: string): Promise<Student | null> {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching student:', error);
    throw new Error(`Failed to fetch student: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return mapSupabaseStudent(data, 0);
}

export async function updateStudentPaymentPlan(
  id: string,
  paymentPlan: string,
  amountPaid: number,
  balanceRemaining: number
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('students')
    .update({
      payment_plan: paymentPlan,
      amount_paid: amountPaid,
      balance_remaining: balanceRemaining,
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating student payment plan:', error);
    throw new Error(`Failed to update payment plan: ${error.message}`);
  }
}
