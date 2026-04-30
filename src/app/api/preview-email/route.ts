import { NextRequest, NextResponse } from 'next/server';
import { emailTemplates, EmailData } from '@/lib/email-templates';

function generateEmailHtml(emailType: string, data: EmailData): string {
  switch (emailType) {
    case 'welcome':
      return emailTemplates.welcome(data);
    default:
      return `<p>Email type not supported for preview</p>`;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const emailType = searchParams.get('type') || 'welcome';
  const studentName = searchParams.get('studentName') || 'John Doe';
  const courseName = searchParams.get('courseName') || 'Tech Trailblazer Scholarship Bootcamp Cohort 1';
  const startDate = searchParams.get('startDate') || '27th May, 2026';
  const scholarshipDate = searchParams.get('scholarshipDate') || 'May 2026';

  const emailHtml = generateEmailHtml(emailType, {
    studentName,
    courseName,
    startDate,
    scholarshipDate
  });

  return new Response(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Email Preview - ${emailType}</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          background: #f5f5f5; 
          margin: 0; 
          padding: 20px;
        }
        .preview-container {
          max-width: 900px;
          margin: 0 auto;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .preview-header {
          background: #007bff;
          color: white;
          padding: 15px 20px;
          text-align: center;
        }
        .preview-controls {
          padding: 15px 20px;
          background: #f8f9fa;
          border-bottom: 1px solid #dee2e6;
        }
        .preview-controls input, .preview-controls select {
          padding: 8px 12px;
          margin: 5px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .preview-controls button {
          padding: 8px 16px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .email-content {
          padding: 20px;
        }
        .preview-info {
          padding: 15px 20px;
          background: #e9ecef;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="preview-container">
        <div class="preview-header">
          <h1> Email Preview - ${emailType} </h1>
        </div>
        
        <div class="preview-controls">
          <form method="get" style="display: inline;">
            <label>Email Type:</label>
            <select name="type" onchange="this.form.submit()">
              <option value="welcome" ${emailType === 'welcome' ? 'selected' : ''}>Welcome Email</option>
            </select>
            
            <label>Student Name:</label>
            <input type="text" name="studentName" value="${studentName}" placeholder="Student Name">
            
            <label>Start Date:</label>
            <input type="text" name="startDate" value="${startDate}" placeholder="Start Date">
            
            <label>Scholarship Date:</label>
            <input type="text" name="scholarshipDate" value="${scholarshipDate}" placeholder="Scholarship Date">
            
            <button type="submit">Update Preview</button>
          </form>
        </div>
        
        <div class="email-content">
          ${emailHtml}
        </div>
        
        <div class="preview-info">
          <p><strong>Preview Info:</strong> This is how your email will look in most email clients. Some styling may vary slightly.</p>
          <p><strong>Note:</strong> Images from your public folder (/banner.jpeg) will display correctly when sent through the actual email system.</p>
        </div>
      </div>
    </body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' }
  });
}
