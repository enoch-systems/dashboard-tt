// Using direct Cloudinary URL for banner image
const BANNER_IMAGE_URL = 'https://res.cloudinary.com/deafv5ovi/image/upload/f_auto,q_auto/banner_pxcyr3';

export interface EmailData {
  studentName: string;
  courseName?: string;
  startDate?: string;
  scholarshipDate?: string;
  [key: string]: any;
}

export const emailStyles = {
  container: "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #2d3748; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 0;",
  header: "color: #000000; font-size: 24px; font-weight: 600; margin-bottom: 20px; padding: 0 20px;",
  subheader: "color: #2563eb; font-size: 20px; font-weight: 500; margin-bottom: 25px; padding: 0 20px;",
  sectionHeader: "color: #1a365d; font-size: 18px; font-weight: 600; border-bottom: 2px solid #1a365d; padding-bottom: 8px; margin-bottom: 20px; padding: 0 20px;",
  cardBackground: "#f8fafc",
  borderColor: "#e2e8f0",
  primaryColor: "#1a365d",
  textColor: "#2d3748",
  mutedColor: "#4a5568",
  lightColor: "#718096",
  buttonBackground: "#1a365d",
  buttonTextColor: "white"
};

export const welcomeEmailTemplate = (data: EmailData): string => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Tech Trailblazer Academy</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      
      <!-- Header Banner -->
      <div style="text-align: center; padding: 0; background-color: #ffffff;">
        <img src="${BANNER_IMAGE_URL}" alt="Tech Trailblazer Academy" style="width: 100%; height: auto; display: block; border-radius: 0;">
      </div>
      
      <!-- Main Content -->
      <div style="padding: 30px 20px;">
        
        <!-- Greeting -->
        <h1 style="color: #000000; font-size: 24px; font-weight: 600; margin-bottom: 20px; line-height: 1.3;">Dear ${data.studentName},</h1>
        
        <!-- Welcome Message -->
        <h2 style="color: #1a365d; font-size: 20px; font-weight: 600; margin-bottom: 25px; line-height: 1.3; text-align: center;">WELCOME TO TECH TRAILBLAZER ACADEMY</h2>
        
        <p style="margin-bottom: 20px; font-size: 16px; line-height: 1.6;">We are delighted to welcome you to Tech Trailblazer Academy. Your decision to invest in your professional development through our program demonstrates your commitment to excellence and growth.</p>
        
        <p style="margin-bottom: 25px; font-size: 16px; line-height: 1.6;">Our academy is dedicated to providing world-class education that empowers individuals to succeed in the technology industry. We look forward to supporting you throughout your learning journey.</p>
        
        <!-- Program Information -->
        <div style="margin-bottom: 30px;">
          <h3 style="color: #1a365d; font-size: 18px; font-weight: 600; border-bottom: 2px solid #1a365d; padding-bottom: 8px; margin-bottom: 20px;">Your Program Details</h3>
          
          <div style="background: #f8fafc; padding: 25px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
            <p style="color: #1a365d; font-weight: 600; margin-bottom: 15px; font-size: 16px;">Program: ${data.courseName || 'Your Selected Course'}</p>
            <p style="margin-bottom: 15px; color: #4a5568; font-size: 15px; line-height: 1.6;">Our comprehensive curriculum is designed to provide you with practical skills and industry knowledge that employers value.</p>
            <p style="margin-bottom: 0; color: #4a5568; font-size: 15px; line-height: 1.6;">You will receive hands-on training, mentorship from industry professionals, and career support throughout your journey with us.</p>
          </div>
        </div>
        
        <!-- Important Information -->
        <div style="margin-bottom: 30px;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 25px; border-radius: 8px;">
            <p style="color: #1a365d; font-weight: 600; margin-bottom: 15px; font-size: 16px;">Important Information</p>
            <ul style="margin: 15px 0; padding-left: 25px; color: #4a5568; font-size: 15px; line-height: 1.6;">
              <li style="margin-bottom: 8px;"><strong>Program Start:</strong> ${data.startDate || 'May 2026'}</li>
              <li style="margin-bottom: 8px;"><strong>Duration:</strong> 16 weeks of intensive training</li>
              <li style="margin-bottom: 0;"><strong>Certificate:</strong> Industry-recognized certification upon completion</li>
            </ul>
          </div>
        </div>
        
        <!-- Next Steps -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 25px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #1a365d; font-weight: 600; margin-bottom: 15px; font-size: 16px;">What's Next</p>
          <p style="margin-bottom: 15px; color: #4a5568; font-size: 15px; line-height: 1.6;">You will receive further instructions regarding your course schedule, access to learning materials, and onboarding information before the program begins.</p>
          <p style="margin-bottom: 0; color: #4a5568; font-size: 15px; line-height: 1.6;">Please ensure you have completed any pending requirements and are ready to commence your learning journey.</p>
        </div>
        
      </div>
      
      <!-- Signature Section -->
      <div style="padding: 30px 20px; border-top: 1px solid #e2e8f0; background: #fafafa;">
        <p style="color: #2d3748; margin-bottom: 8px; font-size: 16px;"><strong>Best regards,</strong></p>
        <p style="color: #2d3748; margin-bottom: 5px; font-weight: 600; font-size: 16px;">Amah Precious,</p>
        <p style="color: #718096; font-size: 14px; margin-bottom: 5px;">Host & Student Success Coordinator</p>
        <p style="color: #718096; font-size: 14px;">Tech Trailblazer Academy</p>
      </div>
      
      <!-- Bottom Banner -->
      <div style="text-align: center; padding: 20px 0; background: #ffffff;">
        <img src="https://res.cloudinary.com/deafv5ovi/image/upload/v1777535098/Facebook_rp0eyf.jpg" alt="Tech Trailblazer Academy" style="width: 100%; max-width: 400px; max-height: 150px; height: auto; display: block; margin: 0 auto; border-radius: 8px; object-fit: cover;">
      </div>
      
      <!-- Footer -->
      <div style="text-align: center; padding: 25px 20px; background: #f8fafc; border-top: 1px solid #e2e8f0;">
        <p style="color: #718096; font-size: 12px; margin: 0;">Copyright &copy; 2026 Tech Trailblazer Academy. All rights reserved.</p>
      </div>
      
    </div>
  </body>
  </html>
`;

// Course to WhatsApp Group Mapping
const courseGroupMapping: { [key: string]: { name: string; link: string } } = {
  'UI/UX Design': {
    name: 'UI/UX Design Group',
    link: 'https://chat.whatsapp.com/BQ4M5ms4h6u5VnEqzBQE1T'
  },
  'Cloud computing': {
    name: 'Cloud Computing Group',
    link: 'https://chat.whatsapp.com/LThgVYa8ctuEUqow4YjZuI'
  },
  'Web Development': {
    name: 'Web Development Group',
    link: 'https://chat.whatsapp.com/GpwwWZbl8p3BDHwKmPFSvn'
  },
  'Mobile Development': {
    name: 'Mobile Development Group',
    link: 'https://chat.whatsapp.com/CMqxNxiy2toJYJdAvZtEKx'
  },
  'Data Science': {
    name: 'Data Science Group',
    link: 'https://chat.whatsapp.com/DKMXWi3fvmHEsb5bimLaJy'
  },
  'Artificial Intelligence': {
    name: 'Artificial Intelligence Group',
    link: 'https://chat.whatsapp.com/GB6UVLaEVh1KkgBWUaZjw9'
  },
  'Cybersecurity': {
    name: 'Cybersecurity Group',
    link: 'https://chat.whatsapp.com/IKKOqN0a3EpHPHoPCiE9tL'
  },
  'Digital Marketing': {
    name: 'Digital Marketing Group',
    link: 'https://chat.whatsapp.com/HwCcz7RG0YAECqChTUGr9d'
  },
  // Fallback mappings for variations
  '3D Animation': {
    name: 'Data Science Group',
    link: 'https://chat.whatsapp.com/DKMXWi3fvmHEsb5bimLaJy'
  },
  'Graphic Design': {
    name: 'Digital Marketing Group',
    link: 'https://chat.whatsapp.com/HwCcz7RG0YAECqChTUGr9d'
  },
  'Front End Development': {
    name: 'Web Development Group',
    link: 'https://chat.whatsapp.com/GpwwWZbl8p3BDHwKmPFSvn'
  },
  'UI/UX': {
    name: 'UI/UX Design Group',
    link: 'https://chat.whatsapp.com/BQ4M5ms4h6u5VnEqzBQE1T'
  },
  'Mobile App Development': {
    name: 'Mobile Development Group',
    link: 'https://chat.whatsapp.com/CMqxNxiy2toJYJdAvZtEKx'
  },
  'Backend Development': {
    name: 'Web Development Group',
    link: 'https://chat.whatsapp.com/GpwwWZbl8p3BDHwKmPFSvn'
  },
  'Cloud Computing': {
    name: 'Cloud Computing Group',
    link: 'https://chat.whatsapp.com/LThgVYa8ctuEUqow4YjZuI'
  },
  'Computer Networking': {
    name: 'Cybersecurity Group',
    link: 'https://chat.whatsapp.com/IKKOqN0a3EpHPHoPCiE9tL'
  },
  'AI Automation': {
    name: 'Artificial Intelligence Group',
    link: 'https://chat.whatsapp.com/GB6UVLaEVh1KkgBWUaZjw9'
  }
};

export const emailTemplates = {
  welcome: welcomeEmailTemplate,
  payment_confirmation: (data: EmailData): string => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Confirmation - Tech Trailblazer Academy</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        
        <!-- Header Banner -->
        <div style="text-align: center; padding: 0; background-color: #ffffff;">
          <img src="${BANNER_IMAGE_URL}" alt="Tech Trailblazer Academy" style="width: 100%; height: auto; display: block; border-radius: 0;">
        </div>
        
        <!-- Main Content -->
        <div style="padding: 30px 20px;">
          
          <!-- Greeting -->
          <h1 style="color: #000000; font-size: 24px; font-weight: 600; margin-bottom: 20px; line-height: 1.3;">Dear ${data.studentName},</h1>
          
          <!-- Payment Confirmation Message -->
          <h2 style="color: #059669; font-size: 20px; font-weight: 600; margin-bottom: 25px; line-height: 1.3; text-align: center;">PAYMENT CONFIRMATION</h2>
          
          <p style="margin-bottom: 20px; font-size: 16px; line-height: 1.6;">We are pleased to confirm that we have successfully received your payment for the <strong>${data.courseName || 'your selected program'}</strong>. Thank you for your investment in your future.</p>
          
          <!-- Payment Type Selection -->
          <div style="background: #f0fdf4; border: 1px solid #86efac; padding: 25px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #059669; font-weight: 600; margin-bottom: 15px; font-size: 16px;">Payment Type Received:</p>
            <p style="margin-bottom: 0; color: #065f46; font-size: 18px; line-height: 1.6; font-weight: 700;">${data.paymentType || 'Fully Paid'}</p>
          </div>
          
          <!-- Payment Details -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 25px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #1a365d; font-weight: 600; margin-bottom: 15px; font-size: 16px;">Payment Details:</p>
            <ul style="margin: 15px 0; padding-left: 25px; color: #4a5568; font-size: 15px; line-height: 1.6;">
              <li style="margin-bottom: 8px;"><strong>Program:</strong> ${data.courseName || 'Your Selected Program'}</li>
              <li style="margin-bottom: 8px;"><strong>Amount Paid:</strong> N${data.amountPaid?.toLocaleString() || 'TBD'}</li>
              <li style="margin-bottom: 8px;"><strong>Payment Date:</strong> ${data.paymentDate || new Date().toLocaleDateString('en-GB')}</li>
              <li style="margin-bottom: 0;"><strong>Payment Status:</strong> <span style="color: #059669; font-weight: 600;">CONFIRMED</span></li>
            </ul>
          </div>
          
          <!-- Next Steps -->
          <div style="margin-bottom: 30px;">
            <h3 style="color: #1a365d; font-size: 18px; font-weight: 600; border-bottom: 2px solid #1a365d; padding-bottom: 8px; margin-bottom: 20px;">What Happens Next</h3>
            <p style="margin-bottom: 15px; font-size: 16px; line-height: 1.6;">Your enrollment is now confirmed. Here's what you can expect:</p>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 15px 0; border: 1px solid #e2e8f0;">
              <ul style="margin: 10px 0; padding-left: 20px; color: #4a5568; font-size: 14px; line-height: 1.5;">
                <li style="margin-bottom: 5px;">Access to course materials and resources</li>
                <li style="margin-bottom: 5px;">Invitation to join our learning community</li>
                <li style="margin-bottom: 5px;">Updates on class schedules and sessions</li>
                <li style="margin-bottom: 0;">Support from our dedicated team</li>
              </ul>
            </div>
          </div>
          
          <!-- Contact Information -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 25px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #1a365d; font-weight: 600; margin-bottom: 15px; font-size: 16px;">Need Assistance?</p>
            <p style="margin-bottom: 0; color: #4a5568; font-size: 15px; line-height: 1.6;">If you have any questions about your payment or enrollment, please don't hesitate to reach out to our support team. We're here to help you succeed.</p>
          </div>
          
        </div>
        
        <!-- Signature Section -->
        <div style="padding: 30px 20px; border-top: 1px solid #e2e8f0; background: #fafafa;">
          <p style="color: #2d3748; margin-bottom: 8px; font-size: 16px;"><strong>Best regards,</strong></p>
          <p style="color: #2d3748; margin-bottom: 5px; font-weight: 600; font-size: 16px;">Amah Precious,</p>
          <p style="color: #718096; font-size: 14px; margin-bottom: 5px;">Host & Student Success Coordinator</p>
          <p style="color: #718096; font-size: 14px;">Tech Trailblazer Academy</p>
        </div>
        
        <!-- Bottom Banner -->
        <div style="text-align: center; padding: 20px 0; background: #ffffff;">
          <img src="https://res.cloudinary.com/deafv5ovi/image/upload/v1777535098/Facebook_rp0eyf.jpg" alt="Tech Trailblazer Academy" style="width: 100%; max-width: 400px; max-height: 150px; height: auto; display: block; margin: 0 auto; border-radius: 8px; object-fit: cover;">
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; padding: 25px 20px; background: #f8fafc; border-top: 1px solid #e2e8f0;">
          <p style="color: #718096; font-size: 12px; margin: 0;">Copyright &copy; 2026 Tech Trailblazer Academy. All rights reserved.</p>
        </div>
        
      </div>
    </body>
    </html>
  `,
  group_redirection: (data: EmailData): string => {
    // Clean course name by removing " - Select a plan" suffix
    const cleanCourseName = (data.courseName || '').replace(' - Select a plan', '');
    
    // Get the group info based on course name
    const groupInfo = courseGroupMapping[cleanCourseName] || {
      name: 'General Group',
      link: 'https://chat.whatsapp.com/YOUR_GENERAL_LINK'
    };

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Join Your WhatsApp Group - Tech Trailblazer Academy</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        
        <!-- Header Banner -->
        <div style="text-align: center; padding: 0; background-color: #ffffff;">
          <img src="${BANNER_IMAGE_URL}" alt="Tech Trailblazer Academy" style="width: 100%; height: auto; display: block; border-radius: 0;">
        </div>
        
        <!-- Main Content -->
        <div style="padding: 30px 20px;">
          
          <!-- Greeting -->
          <h1 style="color: #000000; font-size: 24px; font-weight: 600; margin-bottom: 20px; line-height: 1.3;">Dear ${data.studentName},</h1>
          
          <!-- Welcome Message -->
          <h2 style="color: #1a365d; font-size: 20px; font-weight: 600; margin-bottom: 25px; line-height: 1.3; text-align: center;">JOIN YOUR WHATSAPP GROUP</h2>
          
          <p style="margin-bottom: 20px; font-size: 16px; line-height: 1.6;">We are excited to have you join our learning community! Based on your enrollment in the <strong>${cleanCourseName || 'your program'}</strong>, we have created a dedicated WhatsApp group for you and your fellow students.</p>
          
          <p style="margin-bottom: 25px; font-size: 16px; line-height: 1.6;">This group is where you will connect with your classmates, receive important updates, participate in discussions, and get support throughout your learning journey.</p>
          
          <!-- Group Information -->
          <div style="background: #f0fdf4; border: 1px solid #86efac; padding: 25px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #059669; font-weight: 600; margin-bottom: 15px; font-size: 16px;">Your WhatsApp Group:</p>
            <p style="margin-bottom: 0; color: #065f46; font-size: 18px; line-height: 1.6; font-weight: 700;">${groupInfo.name}</p>
          </div>
          
          <!-- WhatsApp Join Button -->
          <div style="text-align: center; margin: 40px 0; padding: 30px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
            <h4 style="color: #1a365d; font-size: 18px; font-weight: 600; margin-bottom: 15px;">Click to Join Your Group</h4>
            <p style="margin-bottom: 25px; color: #4a5568; font-size: 15px; line-height: 1.5;">Join the ${groupInfo.name} to connect with your classmates and instructors.</p>
            
            <div style="margin: 20px 0;">
              <a href="${groupInfo.link}" style="background-color: #25D366; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-flex; align-items: center; gap: 10px; font-weight: 600; font-size: 16px; transition: background-color 0.3s;">
                <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>Join ${cleanCourseName || 'WhatsApp'} Group</span>
              </a>
            </div>
          </div>
          
          <!-- What to Expect -->
          <div style="margin-bottom: 30px;">
            <h3 style="color: #1a365d; font-size: 18px; font-weight: 600; border-bottom: 2px solid #1a365d; padding-bottom: 8px; margin-bottom: 20px;">What to Expect in Your Group</h3>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 15px 0; border: 1px solid #e2e8f0;">
              <ul style="margin: 10px 0; padding-left: 20px; color: #4a5568; font-size: 14px; line-height: 1.5;">
                <li style="margin-bottom: 5px;">Connect with fellow students in your course</li>
                <li style="margin-bottom: 5px;">Receive important announcements and updates</li>
                <li style="margin-bottom: 5px;">Participate in group discussions and Q&A sessions</li>
                <li style="margin-bottom: 5px;">Share resources and learning materials</li>
                <li style="margin-bottom: 0;">Get support from instructors and peers</li>
              </ul>
            </div>
          </div>
          
          <!-- Contact Information -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 25px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #1a365d; font-weight: 600; margin-bottom: 15px; font-size: 16px;">Need Help?</p>
            <p style="margin-bottom: 0; color: #4a5568; font-size: 15px; line-height: 1.6;">If you have any trouble joining the group or have questions, please don't hesitate to reach out to our support team. We're here to help you get started.</p>
          </div>
          
        </div>
        
        <!-- Signature Section -->
        <div style="padding: 30px 20px; border-top: 1px solid #e2e8f0; background: #fafafa;">
          <p style="color: #2d3748; margin-bottom: 8px; font-size: 16px;"><strong>Best regards,</strong></p>
          <p style="color: #2d3748; margin-bottom: 5px; font-weight: 600; font-size: 16px;">Amah Precious,</p>
          <p style="color: #718096; font-size: 14px; margin-bottom: 5px;">Host & Student Success Coordinator</p>
          <p style="color: #718096; font-size: 14px;">Tech Trailblazer Academy</p>
        </div>
        
        <!-- Bottom Banner -->
        <div style="text-align: center; padding: 20px 0; background: #ffffff;">
          <img src="https://res.cloudinary.com/deafv5ovi/image/upload/v1777535098/Facebook_rp0eyf.jpg" alt="Tech Trailblazer Academy" style="width: 100%; max-width: 400px; max-height: 150px; height: auto; display: block; margin: 0 auto; border-radius: 8px; object-fit: cover;">
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; padding: 25px 20px; background: #f8fafc; border-top: 1px solid #e2e8f0;">
          <p style="color: #718096; font-size: 12px; margin: 0;">Copyright &copy; 2026 Tech Trailblazer Academy. All rights reserved.</p>
        </div>
        
      </div>
    </body>
    </html>
  `;
  }
};
