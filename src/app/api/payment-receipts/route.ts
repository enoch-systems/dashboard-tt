import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { uploadImageToCloudinary } from '@/lib/cloudinary';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function createSupabaseAdmin() {
  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = createSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Missing required Supabase environment variables for payment receipts API.' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const amountRaw = (formData.get('amount') as string)?.trim();
    const paymentType = formData.get('paymentType') as string || 'proof_submission';
    const proofImage = formData.get('proofImage') as File;
    const amountIsNumeric = /^\d+$/.test(amountRaw || '');
    const amount = Number.parseInt(amountRaw || '', 10);

    // Validate required fields
    if (!name || !email || !amountRaw || !proofImage) {
      return NextResponse.json(
        { error: 'Name, email, amount, and proof image are required' },
        { status: 400 }
      );
    }

    if (!amountIsNumeric || !Number.isFinite(amount) || amount < 0) {
      return NextResponse.json(
        { error: 'Amount must contain numbers only.' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!proofImage.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an image.' },
        { status: 400 }
      );
    }

    // Upload image to Cloudinary
    const cloudinaryResult = await uploadImageToCloudinary(proofImage);

    const normalizedEmail = normalizeEmail(email);
    // Create payment receipt record
    const paymentReceipt = {
      student_name: name,
      email: normalizedEmail,
      amount,
      payment_date: new Date().toISOString().split('T')[0],
      payment_type: paymentType,
      status: 'pending',
      cloudinary_public_id: cloudinaryResult.publicId,
      cloudinary_url: cloudinaryResult.url,
      original_filename: cloudinaryResult.originalFilename,
    };

    const { data, error } = await supabaseAdmin
      .from('payment_receipts')
      .insert(paymentReceipt)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save payment receipt' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payment receipt uploaded successfully',
      data
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabaseAdmin = createSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Missing required Supabase environment variables for payment receipts API.' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabaseAdmin
      .from('payment_receipts')
      .select('*')
      .order('submitted_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch payment receipts' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
