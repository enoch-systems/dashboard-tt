import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseClient =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

function getSupabaseClient() {
  if (!supabaseClient) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY for payment receipt service.');
    return null;
  }
  return supabaseClient;
}

function getSupabaseErrorMessage(error: unknown) {
  if (!error || typeof error !== 'object') {
    return '';
  }

  const errorRecord = error as {
    message?: string;
    details?: string;
    hint?: string;
    code?: string;
  };

  return [
    errorRecord.code,
    errorRecord.message,
    errorRecord.details,
    errorRecord.hint,
  ]
    .filter(Boolean)
    .join(' | ')
    .toLowerCase();
}

function isOptionalViewedReceiptError(error: unknown) {
  const message = getSupabaseErrorMessage(error);

  return (
    !message ||
    message.includes('viewed_payment_receipts') ||
    message.includes('does not exist') ||
    message.includes('permission denied') ||
    message.includes('not found')
  );
}

export interface PaymentReceiptData {
  id: string;
  student_name: string;
  email: string;
  phone?: string;
  amount: number;
  payment_date: string;
  payment_type: string;
  status: 'pending' | 'approved' | 'rejected';
  cloudinary_public_id?: string;
  cloudinary_url?: string;
  original_filename?: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export async function fetchPaymentReceipts(
  status?: string,
  limit: number = 50,
  offset: number = 0
): Promise<PaymentReceiptData[]> {
  try {
    const client = getSupabaseClient();
    if (!client) {
      return [];
    }

    let query = client
      .from('payment_receipts')
      .select('*')
      .order('submitted_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching payment receipts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchPaymentReceipts:', error);
    return [];
  }
}

export async function updatePaymentReceiptStatus(
  id: string,
  status: 'approved' | 'rejected',
  notes?: string
): Promise<boolean> {
  try {
    const client = getSupabaseClient();
    if (!client) {
      return false;
    }

    const updateData: any = {
      status,
      reviewed_at: new Date().toISOString(),
    };

    if (notes) {
      updateData.notes = notes;
    }

    const { error } = await client
      .from('payment_receipts')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating payment receipt:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updatePaymentReceiptStatus:', error);
    return false;
  }
}

export async function getPendingPaymentReceiptsCount(): Promise<number> {
  try {
    const client = getSupabaseClient();
    if (!client) {
      return 0;
    }

    const { count, error } = await client
      .from('payment_receipts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (error) {
      console.error('Error getting pending receipts count:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Error in getPendingPaymentReceiptsCount:', error);
    return 0;
  }
}

export async function markReceiptAsViewed(receiptId: string, userId: string): Promise<boolean> {
  try {
    const client = getSupabaseClient();
    if (!client) {
      return false;
    }

    if (!receiptId || !userId) {
      return false;
    }

    const { error } = await client
      .from('viewed_payment_receipts')
      .insert({
        receipt_id: receiptId,
        user_id: userId
      });

    if (error) {
      if (isOptionalViewedReceiptError(error)) {
        return false;
      }

      console.error('Error marking receipt as viewed:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in markReceiptAsViewed:', error);
    return false;
  }
}

export async function getViewedReceipts(userId: string): Promise<Set<string>> {
  try {
    const client = getSupabaseClient();
    if (!client) {
      return new Set();
    }

    if (!userId) {
      return new Set();
    }

    const { data, error } = await client
      .from('viewed_payment_receipts')
      .select('receipt_id')
      .eq('user_id', userId);

    if (error) {
      if (isOptionalViewedReceiptError(error)) {
        return new Set();
      }

      console.error('Error getting viewed receipts:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      return new Set();
    }

    // Ensure data is an array before mapping
    if (!data || !Array.isArray(data)) {
      return new Set();
    }

    return new Set(data.map(item => item.receipt_id));
  } catch (error) {
    console.error('Error in getViewedReceipts:', error);
    return new Set();
  }
}
