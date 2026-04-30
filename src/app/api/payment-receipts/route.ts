import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { uploadImageToCloudinary } from '@/lib/cloudinary';

// Create a Supabase client without strict typing for the new table
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xuohwrmofzqkyjpggwtv.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1b2h3cm1vZnpxa3lqcGdnd3R2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzU0MjkyOSwiZXhwIjoyMDkzMTE4OTI5fQ.sy2rUTZHzTG8DSaNIFZbugqt1GdbbeP-37izdWLKJW4';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const amount = formData.get('amount') as string;
    const paymentDate = formData.get('paymentDate') as string;
    const paymentType = formData.get('paymentType') as string || 'proof_submission';
    const proofImage = formData.get('proofImage') as File;

    // Validate required fields
    if (!name || !email || !amount || !paymentDate || !proofImage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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
    
    // Create payment receipt record
    const paymentReceipt = {
      student_name: name,
      email,
      phone: phone || undefined,
      amount: parseFloat(amount),
      payment_date: paymentDate,
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
