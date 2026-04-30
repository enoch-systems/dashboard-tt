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
        
        <!-- Application Status -->
        <h2 style="color: #2563eb; font-size: 20px; font-weight: 600; margin-bottom: 25px; line-height: 1.3; text-align: center;">APPLICATION RECEIVED</h2>
        
        <!-- Introduction -->
        <p style="margin-bottom: 20px; font-size: 16px; line-height: 1.6;">Your application for the <strong>Tech Trailblazer Scholarship Bootcamp</strong> has been successfully received. We appreciate your interest in our program.</p>
        
        <p style="margin-bottom: 25px; font-size: 16px; line-height: 1.6;">Our selection process is competitive, and we carefully review each application. Previous cohorts have seen participants successfully transition into technology careers across various specializations.</p>
        
        <!-- Program Overview Section -->
        <div style="margin-bottom: 30px;">
          <h3 style="color: #1a365d; font-size: 18px; font-weight: 600; border-bottom: 2px solid #1a365d; padding-bottom: 8px; margin-bottom: 20px;">Program Overview</h3>
          
          <div style="background: #f8fafc; padding: 25px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
            <p style="color: #1a365d; font-weight: 600; margin-bottom: 15px; font-size: 16px;">What You'll Get:</p>
            <ul style="margin: 15px 0; padding-left: 25px; color: #4a5568; font-size: 15px; line-height: 1.6;">
              <li style="margin-bottom: 8px;">Live Classes with Expert Instructors</li>
              <li style="margin-bottom: 8px;">Industry-Recognized Certificates (ACTD, USA)</li>
              <li style="margin-bottom: 8px;">Hands-on Capstone Projects</li>
              <li style="margin-bottom: 8px;">Personal Mentorship & Career Support</li>
              <li style="margin-bottom: 0;">16 weeks of intensive training</li>
            </ul>
          </div>
        </div>
        
        <!-- Important Dates Section -->
        <div style="margin-bottom: 30px;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 25px; border-radius: 8px;">
            <p style="color: #1a365d; font-weight: 600; margin-bottom: 15px; font-size: 16px;">Important Dates</p>
            <ul style="margin: 15px 0; padding-left: 25px; color: #4a5568; font-size: 15px; line-height: 1.6;">
              <li style="margin-bottom: 8px;"><strong>Admission Notifications:</strong> ${data.scholarshipDate || 'May 2026'}</li>
              <li style="margin-bottom: 8px;"><strong>Program Start Date:</strong> ${data.startDate || '27th May, 2026'}</li>
              <li style="margin-bottom: 0;"><strong>Acceptance Deadline:</strong> 3-5 days after offer</li>
            </ul>
          </div>
        </div>
        
                
        <!-- Community Section -->
        <div style="text-align: center; margin: 40px 0; padding: 30px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
          <h4 style="color: #1a365d; font-size: 18px; font-weight: 600; margin-bottom: 15px;">Join Our Community</h4>
          <p style="margin-bottom: 25px; color: #4a5568; font-size: 15px; line-height: 1.5;">Connect with us on WhatsApp to meet other study mates and join ${data.courseName || 'your selected course'} groups.</p>
          
          <div style="margin: 20px 0;">
            <a href="https://chat.whatsapp.com/your-whatsapp-link" style="background-color: #25D366; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; display: inline-flex; align-items: center; gap: 10px; font-weight: 600; font-size: 14px; transition: background-color 0.3s;">
              <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>Join WhatsApp Community</span>
            </a>
          </div>
        </div>
        
      </div>
      
      <!-- Signature Section -->
      <div style="padding: 30px 20px; border-top: 1px solid #e2e8f0; background: #fafafa;">
        <p style="color: #2d3748; margin-bottom: 8px; font-size: 16px;"><strong>Best regards,</strong></p>
        <p style="color: #2d3748; margin-bottom: 5px; font-weight: 600; font-size: 16px;">Amah Precious,</p>
        <p style="color: #718096; font-size: 14px; margin-bottom: 5px;">Host</p>
        <p style="color: #718096; font-size: 14px;">Tech Trailblazer Academy</p>
      </div>
      
      <!-- Bottom Banner -->
      <div style="text-align: center; padding: 20px 0; background: #ffffff;">
        <img src="https://res.cloudinary.com/deafv5ovi/image/upload/v1777535098/Facebook_rp0eyf.jpg" alt="Tech Trailblazer Academy" style="width: 100%; max-width: 400px; max-height: 150px; height: auto; display: block; margin: 0 auto; border-radius: 8px; object-fit: cover;">
      </div>
      
      <!-- Social Media Section -->
      <div style="padding: 30px 20px; text-align: center; border-top: 1px solid #e2e8f0; background: #fafafa;">
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 20px; font-weight: 500;">Connect with us:</p>
        <div style="display: flex; justify-content: center; gap: 25px; flex-wrap: wrap;">
          <a href="https://www.facebook.com/techtailblazeracademy" target="_blank" style="text-decoration: none; display: flex; align-items: center; justify-content: center; transition: opacity 0.3s;">
            <img src="https://res.cloudinary.com/deafv5ovi/image/upload/v1777535344/facebook_h76p8l.png" alt="Facebook" style="width: 32px; height: 32px; object-fit: cover;">
          </a>
          <a href="https://twitter.com/techtailblazer" target="_blank" style="text-decoration: none; display: flex; align-items: center; justify-content: center; transition: opacity 0.3s;">
            <img src="https://res.cloudinary.com/deafv5ovi/image/upload/v1777535344/twitter_hsa5w8.png" alt="X" style="width: 32px; height: 32px; object-fit: cover;">
          </a>
          <a href="https://www.instagram.com/techtailblazeracademy" target="_blank" style="text-decoration: none; display: flex; align-items: center; justify-content: center; transition: opacity 0.3s;">
            <img src="https://res.cloudinary.com/deafv5ovi/image/upload/v1777535343/instagram_uqgpe4.png" alt="Instagram" style="width: 32px; height: 32px; object-fit: cover;">
          </a>
          <a href="https://www.linkedin.com/company/techtailblazeracademy" target="_blank" style="text-decoration: none; display: flex; align-items: center; justify-content: center; transition: opacity 0.3s;">
            <img src="https://res.cloudinary.com/deafv5ovi/image/upload/v1777535342/telegram_oqxhlk.png" alt="Telegram" style="width: 32px; height: 32px; object-fit: cover;">
          </a>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="text-align: center; padding: 25px 20px; background: #f8fafc; border-top: 1px solid #e2e8f0;">
        <p style="color: #718096; font-size: 12px; margin: 0;">Copyright &copy; 2026 Tech Trailblazer Academy. All rights reserved.</p>
      </div>
      
    </div>
  </body>
  </html>
`;

export const emailTemplates = {
  welcome: welcomeEmailTemplate,
};
