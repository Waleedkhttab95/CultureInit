import * as brevo from '@getbrevo/brevo';

const apiInstance = new brevo.ContactsApi();
const emailApiInstance = new brevo.TransactionalEmailsApi();

// Get API key from environment variable
const apiKey = process.env.BREVO_API_KEY;

if (apiKey) {
  apiInstance.setApiKey(brevo.ContactsApiApiKeys.apiKey, apiKey);
  emailApiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, apiKey);
}

export interface BrevoContactData {
  email: string;
  listIds?: number[];
  attributes?: Record<string, string>;
}

export async function addContactToBrevo(data: BrevoContactData): Promise<{ id: number } | null> {
  if (!apiKey) {
    console.warn('BREVO_API_KEY not set. Skipping Brevo integration.');
    return null;
  }

  try {
    const createContact = new brevo.CreateContact();
    createContact.email = data.email;
    createContact.listIds = data.listIds || [];
    createContact.attributes = data.attributes || {};
    createContact.updateEnabled = true; // Update if contact already exists

    const response = await apiInstance.createContact(createContact);
    if (!response.body.id) {
      throw new Error('No contact ID returned from Brevo');
    }
    return { id: response.body.id };
  } catch (error: any) {
    // If contact already exists, get their ID
    if (error.response?.statusCode === 400 && error.response?.body?.message?.includes('already exist')) {
      console.log('Contact already exists in Brevo, updating...');
      try {
        await apiInstance.updateContact(data.email, {
          listIds: data.listIds || [],
          attributes: data.attributes || {},
        });
        // Try to get contact info to retrieve ID
        const contactInfo = await apiInstance.getContactInfo(data.email);
        if (!contactInfo.body.id) {
          throw new Error('No contact ID returned from Brevo');
        }
        return { id: contactInfo.body.id };
      } catch (updateError) {
        console.error('Error updating existing contact:', updateError);
        throw updateError;
      }
    }
    console.error('Error adding contact to Brevo:', error);
    throw error;
  }
}

export async function isBrevoConfigured(): Promise<boolean> {
  return !!apiKey;
}

export interface EmailAttachment {
  name: string;
  content: string; // base64 encoded
}

export interface SendEmailData {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  textContent?: string;
  sender?: { email: string; name?: string };
  attachment?: EmailAttachment[];
}

export async function sendEmail(data: SendEmailData): Promise<boolean> {
  if (!apiKey) {
    console.warn('BREVO_API_KEY not set. Skipping email sending.');
    return false;
  }

  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    // Use environment variable for sender or default
    sendSmtpEmail.sender = data.sender || {
      email: process.env.BREVO_SENDER_EMAIL || 'noreply@culturalinitiative.com',
      name: process.env.BREVO_SENDER_NAME || 'Cultural Initiative'
    };

    sendSmtpEmail.to = data.to;
    sendSmtpEmail.subject = data.subject;
    sendSmtpEmail.htmlContent = data.htmlContent;

    if (data.textContent) {
      sendSmtpEmail.textContent = data.textContent;
    }

    if (data.attachment && data.attachment.length > 0) {
      sendSmtpEmail.attachment = data.attachment;
    }

    await emailApiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Email sent successfully via Brevo');
    return true;
  } catch (error: any) {
    console.error('❌ Error sending email via Brevo:', error);
    console.error('Error details:', error.response?.body || error.message);
    return false;
  }
}
