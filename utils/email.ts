import emailjs from '@emailjs/browser';
import Constants from 'expo-constants';

// Get EmailJS configuration from environment variables or app config (for upload and coaching forms)
const serviceId = Constants.expoConfig?.extra?.emailjsServiceId || process.env.EXPO_PUBLIC_EMAILJS_SERVICE_ID;
const publicKey = Constants.expoConfig?.extra?.emailjsPublicKey || process.env.EXPO_PUBLIC_EMAILJS_PUBLIC_KEY;
const templateUploadAdmin = Constants.expoConfig?.extra?.emailjsTemplateUploadAdmin || process.env.EXPO_PUBLIC_EMAILJS_TEMPLATE_UPLOAD_ADMIN;
const templateUploadUser = Constants.expoConfig?.extra?.emailjsTemplateUploadUser || process.env.EXPO_PUBLIC_EMAILJS_TEMPLATE_UPLOAD_USER;
const templateCoaching = Constants.expoConfig?.extra?.emailjsTemplateCoaching || process.env.EXPO_PUBLIC_EMAILJS_TEMPLATE_COACHING;
const templateCoachingUser = Constants.expoConfig?.extra?.emailjsTemplateCoachingUser || process.env.EXPO_PUBLIC_EMAILJS_TEMPLATE_COACHING_USER;

// Get Resend configuration (for contact form)
const RESEND_API_KEY = Constants.expoConfig?.extra?.resendApiKey || process.env.EXPO_PUBLIC_RESEND_API_KEY;
const RESEND_FROM_EMAIL = Constants.expoConfig?.extra?.resendFromEmail || process.env.EXPO_PUBLIC_RESEND_FROM_EMAIL || 'support@tennisprocoaching.com';
const RESEND_TO_EMAIL = Constants.expoConfig?.extra?.resendToEmail || process.env.EXPO_PUBLIC_RESEND_TO_EMAIL;

// Initialize EmailJS with public key
if (publicKey) {
  emailjs.init(publicKey);
}

export interface UploadFormEmailData {
  player_name: string;
  email: string;
  phone?: string;
  age: string;
  skill_level: string;
  goals?: string;
  how_did_you_hear?: string;
  notes?: string;
  video_url: string;
  video_file_name?: string;
  video_file_size?: string;
  video_duration?: string;
}

export interface CoachingFormEmailData {
  full_name: string;
  phone: string;
  email: string;
  session_type: string;
  goals?: string;
}

export interface ContactFormEmailData {
  first_name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

/**
 * Send email using Resend API
 */
async function sendResendEmail(params: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<void> {
  if (!RESEND_API_KEY) {
    throw new Error('Resend API key is missing. Please set EXPO_PUBLIC_RESEND_API_KEY');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: RESEND_FROM_EMAIL,
      to: params.to,
      reply_to: params.replyTo,
      subject: params.subject,
      html: params.html,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to send email' }));
    throw new Error(error.message || 'Failed to send email');
  }

  const result = await response.json();
  if (result.error) {
    throw new Error(result.error.message || 'Failed to send email');
  }
}

/**
 * Send admin notification email for video upload submission
 */
export async function sendUploadAdminEmail(data: UploadFormEmailData): Promise<void> {
  if (!serviceId || !publicKey || !templateUploadAdmin) {
    throw new Error('EmailJS configuration is missing. Please set EXPO_PUBLIC_EMAILJS_SERVICE_ID, EXPO_PUBLIC_EMAILJS_PUBLIC_KEY, and EXPO_PUBLIC_EMAILJS_TEMPLATE_UPLOAD_ADMIN');
  }

  const templateParams: Record<string, string> = {
    player_name: data.player_name ? String(data.player_name) : '',
    email: data.email ? String(data.email) : '',
    phone: data.phone ? String(data.phone) : '',
    age: data.age ? String(data.age) : '',
    skill_level: data.skill_level ? String(data.skill_level) : '',
    goals: data.goals ? String(data.goals) : '',
    how_did_you_hear: data.how_did_you_hear ? String(data.how_did_you_hear) : '',
    notes: data.notes ? String(data.notes) : '',
    video_url: data.video_url ? String(data.video_url) : '',
  };

  await emailjs.send(serviceId, templateUploadAdmin, templateParams);
}

/**
 * Send user confirmation email for video upload submission
 */
export async function sendUploadUserEmail(data: UploadFormEmailData): Promise<void> {
  if (!serviceId || !publicKey || !templateUploadUser) {
    throw new Error('EmailJS configuration is missing. Please set EXPO_PUBLIC_EMAILJS_SERVICE_ID, EXPO_PUBLIC_EMAILJS_PUBLIC_KEY, and EXPO_PUBLIC_EMAILJS_TEMPLATE_UPLOAD_USER');
  }

  const templateParams = {
    player_name: data.player_name || '',
    player_email: data.email || '',
    email: data.email || '',
    age: data.age || '',
    skill_level: data.skill_level || '',
    goals: data.goals || '',
    notes: data.notes || '',
  };

  await emailjs.send(serviceId, templateUploadUser, templateParams);
}

/**
 * Send admin notification email for coaching form submission (using Resend)
 */
export async function sendCoachingAdminEmail(data: CoachingFormEmailData): Promise<void> {
  if (!RESEND_API_KEY || !RESEND_TO_EMAIL) {
    throw new Error('Resend configuration is missing. Please set EXPO_PUBLIC_RESEND_API_KEY and EXPO_PUBLIC_RESEND_TO_EMAIL');
  }

  const html = `
    <h2>New Coaching Session Booking</h2>
    <p><strong>Name:</strong> ${data.full_name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Phone:</strong> ${data.phone}</p>
    <p><strong>Session Type:</strong> ${data.session_type}</p>
    ${data.goals ? `<p><strong>Goals:</strong></p><p>${data.goals.replace(/\n/g, '<br>')}</p>` : ''}
    <hr>
    <p><em>This booking was submitted from the Tennis Coach App coaching form.</em></p>
  `;

  await sendResendEmail({
    to: RESEND_TO_EMAIL,
    subject: `New Coaching Session Booking from ${data.full_name}`,
    html,
    replyTo: data.email,
  });
}

/**
 * Send user confirmation email for coaching form submission (using Resend)
 */
export async function sendCoachingUserEmail(data: CoachingFormEmailData): Promise<void> {
  if (!RESEND_API_KEY) {
    throw new Error('Resend API key is missing. Please set EXPO_PUBLIC_RESEND_API_KEY');
  }

  const html = `
    <h2>Coaching Session Booked!</h2>
    <p>Hi ${data.full_name},</p>
    <p>Thank you for booking a coaching session with us!</p>
    <p><strong>Session Details:</strong></p>
    <ul>
      <li><strong>Session Type:</strong> ${data.session_type}</li>
      <li><strong>Price:</strong> $40/hour</li>
    </ul>
    ${data.goals ? `<p><strong>Your Goals:</strong></p><p>${data.goals.replace(/\n/g, '<br>')}</p>` : ''}
    <p>We'll contact you soon at ${data.phone} or ${data.email} to confirm the details and schedule your session.</p>
    <p>If you have any questions, feel free to call us at 919-337-8859.</p>
    <p>Best regards,<br>Tennis Coach App Team</p>
  `;

  await sendResendEmail({
    to: data.email,
    subject: 'Coaching Session Booking Confirmation',
    html,
  });
}

/**
 * @deprecated Use sendCoachingAdminEmail instead
 * Send email for coaching form submission
 */
export async function sendCoachingEmail(data: CoachingFormEmailData): Promise<void> {
  return sendCoachingAdminEmail(data);
}

/**
 * Send admin notification email for contact form submission (using Resend)
 */
export async function sendContactAdminEmail(data: ContactFormEmailData): Promise<void> {
  if (!RESEND_API_KEY || !RESEND_TO_EMAIL) {
    throw new Error('Resend configuration is missing. Please set EXPO_PUBLIC_RESEND_API_KEY and EXPO_PUBLIC_RESEND_TO_EMAIL');
  }

  const subjectCategory = data.subject || 'General Inquiry';
  const html = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${data.first_name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
    <p><strong>Subject Category:</strong> ${subjectCategory}</p>
    <p><strong>Message:</strong></p>
    <p>${data.message.replace(/\n/g, '<br>')}</p>
    <hr>
    <p><em>This message was sent from the Tennis Coach App contact form.</em></p>
  `;

  await sendResendEmail({
    to: RESEND_TO_EMAIL,
    subject: `New Contact Form Submission from ${data.first_name}`,
    html,
    replyTo: data.email,
  });
}

/**
 * @deprecated Use sendContactAdminEmail instead
 * Send email for contact form submission
 */
export async function sendContactEmail(data: ContactFormEmailData): Promise<void> {
  return sendContactAdminEmail(data);
}

/**
 * Check if EmailJS is configured
 */
export function isEmailJSConfigured(): boolean {
  return !!(serviceId && publicKey);
}

