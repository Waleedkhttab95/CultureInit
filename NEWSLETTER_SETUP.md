# Newsletter Subscription Setup Guide

This guide explains how to set up and use the newsletter subscription feature with Brevo integration.

## Features

- Email validation on frontend and backend
- Newsletter subscription form on the landing page
- Backend API integration with Brevo (formerly Sendinblue)
- Duplicate subscription prevention
- Toast notifications for user feedback
- Graceful fallback if Brevo is not configured

## Setup Instructions

### 1. Get Your Brevo API Key

1. Sign up or log in to [Brevo](https://www.brevo.com/)
2. Go to [API Keys Settings](https://app.brevo.com/settings/keys/api)
3. Create a new API key or copy an existing one

### 2. (Optional) Get Your List ID

If you want to add subscribers to a specific list in Brevo:

1. Go to [Contacts Lists](https://app.brevo.com/contacts/lists)
2. Find the list you want to use
3. Note the List ID (visible in the URL or list settings)

### 3. Configure Environment Variables

Create a `.env` file in the root directory (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit the `.env` file and add your credentials:

```env
BREVO_API_KEY=your_actual_api_key_here
BREVO_LIST_ID=123  # Optional: Your list ID number
```

### 4. Database Setup

The newsletter feature requires a database table for storing subscribers.

If using PostgreSQL with Drizzle:
```bash
npm run db:push
```

This will create the `newsletter_subscribers` table with the following schema:
- `id`: UUID primary key
- `email`: Text, unique, not null
- `subscribed_at`: Timestamp with default now()
- `brevo_contact_id`: Text (nullable)

### 5. Start the Application

```bash
npm run dev
```

## How It Works

### Backend Flow

1. **Email Validation**: The API endpoint `/api/newsletter/subscribe` validates the email using Zod schema
2. **Duplicate Check**: Checks if the email already exists in the database
3. **Database Storage**: Saves the email to the local database
4. **Brevo Integration**: If configured, adds the contact to Brevo with:
   - Email address
   - List assignment (if `BREVO_LIST_ID` is set)
   - Custom attributes (signup source and date)
5. **Response**: Returns success or error message

### Frontend Flow

1. User enters email in the newsletter form
2. Form validates email format
3. Submits POST request to `/api/newsletter/subscribe`
4. Shows toast notification with success or error message
5. Clears the form on successful subscription

## API Endpoint

### POST `/api/newsletter/subscribe`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Successfully subscribed to newsletter",
  "subscriber": {
    "id": "uuid-here",
    "email": "user@example.com"
  }
}
```

**Error Responses:**

- **400 Bad Request**: Invalid email format
```json
{
  "error": "Validation failed",
  "message": "Invalid email address"
}
```

- **409 Conflict**: Email already subscribed
```json
{
  "error": "Already subscribed",
  "message": "This email is already subscribed to our newsletter"
}
```

- **500 Internal Server Error**: Server error
```json
{
  "error": "Internal server error",
  "message": "Failed to subscribe to newsletter"
}
```

## Testing

### Without Brevo (Development)

The system works without Brevo configured. Emails will be saved to the local database only.

### With Brevo

1. Set up your `.env` file with valid credentials
2. Subscribe with a test email
3. Check your Brevo dashboard to confirm the contact was added
4. Verify the contact appears in your list (if `BREVO_LIST_ID` is set)

### Test Scenarios

1. **Valid Subscription**: Enter a valid email and submit
2. **Invalid Email**: Try submitting invalid email formats
3. **Duplicate Subscription**: Try subscribing with the same email twice
4. **Network Error**: Test with network disconnected (should show error toast)

## Architecture

### Files Created/Modified

**Backend:**
- `server/brevo.ts` - Brevo API integration service
- `server/routes.ts` - Newsletter subscription endpoint
- `server/storage.ts` - Database operations for newsletter subscribers
- `shared/schema.ts` - Database schema and validation

**Frontend:**
- `client/src/components/NewsletterSection.tsx` - Newsletter subscription form
- `client/src/pages/LandingPage.tsx` - Updated to include newsletter section

**Configuration:**
- `.env.example` - Environment variables template
- `package.json` - Added @getbrevo/brevo dependency

## Troubleshooting

### Brevo API Errors

- Verify your API key is correct
- Check your Brevo account status and limits
- Review server logs for detailed error messages

### Database Errors

- Ensure database is running and accessible
- Run `npm run db:push` to sync schema
- Check storage implementation matches your database setup

### Frontend Issues

- Check browser console for errors
- Verify API endpoint is accessible
- Ensure toast notifications are properly configured

## Future Enhancements

- Email confirmation/double opt-in
- Unsubscribe functionality
- Admin dashboard for managing subscribers
- Email preferences management
- Analytics and reporting
- Batch import subscribers
