# Vercel Environment Variables Setup

This document contains all the environment variables needed to deploy the TT Academy application to Vercel.

## Required Environment Variables

### 1. Supabase Configuration
```bash
# Public Supabase URL (accessible from client-side)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# Supabase Anonymous Key (public key for client-side access)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase Service Role Key (server-side only, for admin operations)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Email Service (Resend)
```bash
# Resend API Key for sending emails
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Cloudinary Configuration
```bash
# Cloudinary Cloud Name
CLOUDINARY_CLOUD_NAME=your-cloud-name

# Cloudinary API Key
CLOUDINARY_API_KEY=your-api-key

# Cloudinary API Secret
CLOUDINARY_API_SECRET=your-api-secret
```

## Environment Variable Types

### Client-Side Variables (NEXT_PUBLIC_*)
These variables are exposed to the browser and should be used for public-facing operations:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Server-Side Variables
These variables are only available on the server and should contain sensitive data:
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## How to Add Environment Variables in Vercel

### Method 1: Vercel Dashboard
1. Go to your Vercel project dashboard
2. Click on "Settings" tab
3. Select "Environment Variables"
4. Add each variable with its key and value
5. Choose the appropriate environment (Development, Preview, Production)

### Method 2: Vercel CLI
```bash
# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add RESEND_API_KEY
vercel env add CLOUDINARY_CLOUD_NAME
vercel env add CLOUDINARY_API_KEY
vercel env add CLOUDINARY_API_SECRET
```

### Method 3: vercel.json File
Create a `vercel.json` file in your project root:
```json
{
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase-service-role-key",
    "RESEND_API_KEY": "@resend-api-key",
    "CLOUDINARY_CLOUD_NAME": "@cloudinary-cloud-name",
    "CLOUDINARY_API_KEY": "@cloudinary-api-key",
    "CLOUDINARY_API_SECRET": "@cloudinary-api-secret"
  }
}
```

## Services Integration

### Supabase
- **Purpose**: Database and authentication
- **Used in**: Student data management, user authentication, payment tracking
- **Required**: URL, Anonymous Key (client), Service Role Key (server)

### Resend
- **Purpose**: Email sending service
- **Used in**: Welcome emails, payment confirmations, follow-up emails
- **Required**: API Key

### Cloudinary
- **Purpose**: Image storage and optimization
- **Used in**: Payment proof uploads, banner images, file management
- **Required**: Cloud Name, API Key, API Secret

## Security Notes

1. **Never expose sensitive keys**: Only use `NEXT_PUBLIC_` prefix for non-sensitive data
2. **Service Role Key**: Keep this server-side only, it has admin privileges
3. **API Secrets**: Treat all secrets as confidential and never commit them to git
4. **Environment-specific**: Use different keys for development and production

## Deployment Checklist

Before deploying to Vercel, ensure:

- [ ] All environment variables are added to Vercel
- [ ] Supabase project is created and URL is accessible
- [ ] Resend API key is valid and has necessary permissions
- [ ] Cloudinary account is set up with proper permissions
- [ ] Database schema is created in Supabase
- [ ] All API endpoints work with the configured services

## Testing After Deployment

After deployment, test the following:

1. **Authentication**: Login/logout functionality
2. **Database Operations**: Student data loading, payment updates
3. **Email Sending**: Registration emails, payment confirmations
4. **File Uploads**: Payment proof image uploads
5. **Image Display**: Cloudinary images loading correctly

## Troubleshooting

### Common Issues

1. **Supabase Connection**: Check URL and keys are correct
2. **Email Not Sending**: Verify Resend API key and domain settings
3. **Image Upload Failing**: Check Cloudinary credentials and permissions
4. **Environment Variables Not Loading**: Ensure proper naming conventions and Vercel configuration

### Debug Steps

1. Check Vercel function logs for errors
2. Verify environment variables in Vercel dashboard
3. Test individual API endpoints
4. Check service status (Supabase, Resend, Cloudinary)

## Current Values (for reference)

```bash
RESEND_API_KEY=re_NFxArgcD_21CGaQUXnm7LzNwdA7vvNw1F
NEXT_PUBLIC_SUPABASE_URL=https://xuohwrmofzqkyjpggwtv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1b2h3cm1vZnpxa3lqcGdnd3R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NDI5MjksImV4cCI6MjA5MzExODkyOX0.DisOYX3hLLHI8z-ztPKtHLDxelf-RPYmK0dh9RMJXS4
CLOUDINARY_CLOUD_NAME=deafv5ovi
CLOUDINARY_API_KEY=154519651234136
CLOUDINARY_API_SECRET=LWpWFH8T3YzO7uuiWWiQSjI_cmY
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1b2h3cm1vZnpxa3lqcGdnd3R2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzU0MjkyOSwiZXhwIjoyMDkzMTE4OTI5fQ.sy2rUTZHzTG8DSaNIFZbugqt1GdbbeP-37izdWLKJW4
```

⚠️ **Important**: Replace these with your own values for production deployment.
