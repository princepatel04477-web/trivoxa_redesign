import { Resend } from 'resend';
import { CONTACT } from '@/content/taxonomy';
import type { RfqSubmissionInput, ContactSubmissionInput } from '@/lib/forms/schema';

/**
 * Takes the API key explicitly rather than reading `process.env` itself —
 * this runs inside a Cloudflare Pages Function (Workers runtime), which has
 * no `process.env`; the caller reads it from `context.env.RESEND_API_KEY`.
 */
function getResendClient(apiKey: string | undefined): Resend | null {
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export const FROM_EMAIL = 'Trivoxa Group Desk <sales@trivoxagroup.com>';

export type EmailDeliveryResult = {
  success: boolean;
  deskEmailId?: string;
  acknowledgementEmailId?: string;
  simulated?: boolean;
  error?: string;
};

export async function sendRfqEmails(
  data: RfqSubmissionInput,
  reference: string,
  apiKey: string | undefined,
): Promise<EmailDeliveryResult> {
  const client = getResendClient(apiKey);
  if (!client) {
    return { success: true, simulated: true };
  }

  const isService = data.division === 'service-exports' || data.industry === 'technology';
  const deskTo = isService ? CONTACT.general : CONTACT.sales;
  const subjectType =
    data.path === 'sample'
      ? 'Sample Request'
      : data.path === 'audit'
      ? 'Factory Audit Request'
      : 'RFQ';

  const companyTag = data.companyName ? ` — ${data.companyName}` : '';
  const productTag = data.product ? ` [${data.product}]` : data.category ? ` [${data.category}]` : '';
  const deskSubject = `${subjectType}${productTag}${companyTag} (${reference})`;

  const deskText = [
    'TRIVOXA GROUP — EXPORT DESK NOTIFICATION',
    `Reference: ${reference}`,
    `Submitted: ${new Date().toISOString()}`,
    '--------------------------------------------------',
    'INQUIRY SPECIFICATION',
    `  Path:             ${data.path || 'standard'}${data.path === 'audit' ? ' (FACTORY AUDIT)' : data.path === 'sample' ? ' (SAMPLE REQUEST)' : ''}`,
    `  Product/Service:  ${data.product || 'Not specified'}`,
    `  Industry:         ${data.industry || 'Not specified'}`,
    `  Category:         ${data.category || 'Not specified'}`,
    `  Destination Port: ${data.destination || 'Not specified'}`,
    `  Referral:         ${data.referral || 'Not specified'}`,
    '--------------------------------------------------',
    'BUYER DETAILS',
    `  Full Name:        ${data.fullName}`,
    `  Company:          ${data.companyName}`,
    `  Email:            ${data.email}`,
    `  Phone/WhatsApp:   ${data.phone || 'None provided'}`,
    '--------------------------------------------------',
    'REQUIREMENT & SPECIFICATION NOTES',
    data.requirement,
    '--------------------------------------------------',
    'Source / Context:',
    `  Referring URL:    ${data.referringUrl || 'Direct'}`,
    `  Division:         ${data.division || 'Product Exports'}`,
  ].join('\n');

  const senderSubject = `Quotation Request Received [${reference}] — Trivoxa Group Export Desk`;
  const senderText = [
    `Dear ${data.fullName},`,
    '',
    `Thank you for your enquiry with Trivoxa Group. This message confirms that our export desk in Surat has received your specification under reference ${reference}.`,
    '',
    'PUBLISHED RESPONSE COMMITMENT:',
    `Our desk answers ${CONTACT.responseWindow} (Monday to Saturday, 10:00–19:00 IST). A dated quotation — with unit price, MOQ, lead time, Incoterm and loading port — follows once your specification is reviewed.`,
    '',
    'SUMMARY OF SUBMITTED DETAILS:',
    `  Reference Number:  ${reference}`,
    `  Company:           ${data.companyName}`,
    `  Product / Sector:  ${data.product || data.category || data.industry || 'General sourcing'}`,
    `  Destination Port:  ${data.destination || 'To be confirmed'}`,
    `  Path:              ${data.path ? data.path.toUpperCase() : 'STANDARD RFQ'}`,
    '',
    'YOUR REQUIREMENT:',
    data.requirement,
    '',
    `If you need to append test standards, packing notes or destination compliance requirements before our review, simply reply directly to this email or write to ${deskTo} quoting reference ${reference}.`,
    '',
    'Yours faithfully,',
    'Export Desk · Trivoxa Group',
    'Surat, Gujarat, India',
    'trivoxagroup.com',
  ].join('\n');

  try {
    const [deskRes, senderRes] = await Promise.all([
      client.emails.send({
        from: FROM_EMAIL,
        to: [deskTo],
        replyTo: data.email,
        subject: deskSubject,
        text: deskText,
      }),
      client.emails.send({
        from: FROM_EMAIL,
        to: [data.email],
        replyTo: deskTo,
        subject: senderSubject,
        text: senderText,
      }),
    ]);

    return {
      success: true,
      deskEmailId: deskRes.data?.id,
      acknowledgementEmailId: senderRes.data?.id,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function sendContactEmails(
  data: ContactSubmissionInput,
  reference: string,
  apiKey: string | undefined,
): Promise<EmailDeliveryResult> {
  const client = getResendClient(apiKey);
  if (!client) {
    return { success: true, simulated: true };
  }

  let deskTo = CONTACT.general;
  if (
    data.inquiryType === 'product-enquiry' ||
    data.inquiryType === 'product' ||
    data.inquiryType === 'sample-request' ||
    data.inquiryType === 'sample' ||
    data.inquiryType === 'factory-audit' ||
    data.inquiryType === 'audit'
  ) {
    deskTo = CONTACT.sales;
  } else if (data.inquiryType === 'careers') {
    deskTo = CONTACT.careers;
  } else if (data.inquiryType === 'partnership') {
    deskTo = CONTACT.partnerships;
  }

  const companyTag = data.companyName ? ` — ${data.companyName}` : '';
  const deskSubject = `Enquiry [${data.inquiryType}]${companyTag} (${reference})`;

  const deskText = [
    'TRIVOXA GROUP — GENERAL / DIRECTORY ENQUIRY',
    `Reference: ${reference}`,
    `Submitted: ${new Date().toISOString()}`,
    '--------------------------------------------------',
    'ENQUIRY DETAILS',
    `  Inquiry Type:    ${data.inquiryType}`,
    `  Routed To:       ${deskTo}`,
    `  Full Name:       ${data.fullName}`,
    `  Company:         ${data.companyName || 'Not specified'}`,
    `  Email:           ${data.email}`,
    `  Callback Number: ${data.callback || 'None provided'}`,
    '--------------------------------------------------',
    'MESSAGE',
    data.message,
  ].join('\n');

  const senderSubject = `Enquiry Received [${reference}] — Trivoxa Group`;
  const senderText = [
    `Dear ${data.fullName},`,
    '',
    `Thank you for contacting Trivoxa Group. We have received your message under reference ${reference}.`,
    '',
    'PUBLISHED RESPONSE COMMITMENT:',
    `Our team answers all correspondence ${CONTACT.responseWindow} (Monday to Saturday, 10:00–19:00 IST).`,
    '',
    'SUMMARY:',
    `  Inquiry Type: ${data.inquiryType}`,
    `  Assigned To:  ${deskTo}`,
    `  Callback:     ${data.callback || 'None requested'}`,
    '',
    'YOUR MESSAGE:',
    data.message,
    '',
    'If this enquiry concerns an urgent shipment or existing contract, you may reply directly to this message.',
    '',
    'Yours faithfully,',
    'Trivoxa Group',
    'Surat, Gujarat, India',
    'trivoxagroup.com',
  ].join('\n');

  try {
    const [deskRes, senderRes] = await Promise.all([
      client.emails.send({
        from: FROM_EMAIL,
        to: [deskTo],
        replyTo: data.email,
        subject: deskSubject,
        text: deskText,
      }),
      client.emails.send({
        from: FROM_EMAIL,
        to: [data.email],
        replyTo: deskTo,
        subject: senderSubject,
        text: senderText,
      }),
    ]);

    return {
      success: true,
      deskEmailId: deskRes.data?.id,
      acknowledgementEmailId: senderRes.data?.id,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
