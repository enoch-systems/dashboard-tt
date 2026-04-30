import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      fullName,
      phoneWhatsApp,
      gender,
      stateOfResidence,
      learningTrack,
      howHeardAboutUs,
      hasLaptopAndInternet,
      email,
      employmentStatus,
      wantsScholarship,
      whyLearnThisSkill
    } = body;

    // Validate required fields
    if (!fullName || !phoneWhatsApp || !gender || !stateOfResidence || 
        !learningTrack || !howHeardAboutUs || !hasLaptopAndInternet || 
        !email || !employmentStatus || !wantsScholarship || !whyLearnThisSkill) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create registration data with timestamp
    const registrationData = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      fullName,
      phoneWhatsApp,
      gender,
      stateOfResidence,
      learningTrack,
      howHeardAboutUs,
      hasLaptopAndInternet,
      email,
      employmentStatus,
      wantsScholarship,
      whyLearnThisSkill,
      regDateTime: new Date().toLocaleString()
    };

    // Here you would typically save to a database
    // For now, we'll just log the data and return success
    console.log('Registration submitted:', registrationData);

    return NextResponse.json({
      success: true,
      message: 'Registration submitted successfully',
      data: registrationData
    });

  } catch (error) {
    console.error('Error processing registration:', error);
    return NextResponse.json(
      { error: 'Failed to process registration' },
      { status: 500 }
    );
  }
}
