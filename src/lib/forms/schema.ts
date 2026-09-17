import { z } from 'zod';

/**
 * Shared Zod submission schemas for RFQ and Contact enquiries.
 * Used on both client (for blur/submit validation) and server (Next route handlers).
 */

export const HONEYPOT_FIELD = 'company_website_url' as const;

export const RfqSubmissionSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: 'Tell us who to reply to.' })
    .max(120, { message: 'Name cannot exceed 120 characters.' }),
  companyName: z
    .string()
    .trim()
    .min(2, { message: 'A company name lets us check the market and credit terms.' })
    .max(160, { message: 'Company name cannot exceed 160 characters.' }),
  email: z
    .string()
    .trim()
    .email({ message: 'A working business email address is required.' }),
  phone: z
    .string()
    .trim()
    .refine((val) => val === '' || val.replace(/[\s\-\+\(\)]/g, '').length >= 6, {
      message: 'That does not look like a reachable telephone number.',
    })
    .default(''),
  destination: z.string().trim().max(100).default(''),
  industry: z.string().trim().default(''),
  category: z.string().trim().default(''),
  product: z.string().trim().default(''),
  requirement: z
    .string()
    .trim()
    .min(20, { message: 'A little more detail, please — grade, quantity, destination port and target Incoterm.' })
    .max(3000, { message: 'Specification details cannot exceed 3000 characters.' }),
  referral: z.string().trim().default(''),
  // Context fields
  path: z.enum(['standard', 'sample', 'audit', '']).default(''),
  division: z.string().trim().default(''),
  productSlug: z.string().trim().default(''),
  categorySlug: z.string().trim().default(''),
  referringUrl: z.string().trim().default(''),
  // Anti-spam
  submittedAt: z.number().optional(),
  turnstileToken: z.string().trim().optional(),
  [HONEYPOT_FIELD]: z.string().trim().optional(),
});

export type RfqSubmissionInput = z.infer<typeof RfqSubmissionSchema>;

export const ContactSubmissionSchema = z.object({
  inquiryType: z
    .string()
    .trim()
    .min(1, { message: 'Please choose what this inquiry is about.' }),
  fullName: z
    .string()
    .trim()
    .min(2, { message: 'Tell us who to reply to.' })
    .max(120, { message: 'Name cannot exceed 120 characters.' }),
  companyName: z.string().trim().max(160).default(''),
  email: z
    .string()
    .trim()
    .email({ message: 'A working email address is required.' }),
  callback: z
    .string()
    .trim()
    .refine((val) => val === '' || val.replace(/[\s\-\+\(\)]/g, '').length >= 6, {
      message: 'That does not look like a reachable callback number.',
    })
    .default(''),
  message: z
    .string()
    .trim()
    .min(15, { message: 'A sentence or two about what you need.' })
    .max(3000, { message: 'Message cannot exceed 3000 characters.' }),
  // Anti-spam
  submittedAt: z.number().optional(),
  turnstileToken: z.string().trim().optional(),
  [HONEYPOT_FIELD]: z.string().trim().optional(),
});

export type ContactSubmissionInput = z.infer<typeof ContactSubmissionSchema>;

export const NewsletterSubmissionSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: 'A working email address is required.' }),
  submittedAt: z.number().optional(),
  turnstileToken: z.string().trim().optional(),
  [HONEYPOT_FIELD]: z.string().trim().optional(),
});

export type NewsletterSubmissionInput = z.infer<typeof NewsletterSubmissionSchema>;
