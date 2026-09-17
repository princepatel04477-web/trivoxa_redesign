'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { gsap } from 'gsap';
import { animate } from '@/lib/motion/anime';
import { Input, Select, Textarea } from '@/components/ui/field';
import { Eyebrow, Prose } from '@/components/ui/typography';
import { CATEGORIES, CONTACT, INDUSTRIES, PRODUCTS, PORTS } from '@/content/taxonomy';
import { track } from '@/lib/analytics/events';
import { focusFirstInvalid } from '@/lib/forms/focus-first-invalid';
import { composeEnquiry, type Enquiry } from '@/lib/forms/mailto';
import { HONEYPOT_FIELD, RfqSubmissionSchema } from '@/lib/forms/schema';
import type { SubmissionResult } from '@/lib/forms/transport';
import { TurnstileWidget } from '@/components/forms/turnstile-widget';
import { BRAND } from '@/lib/tokens/colors';
import OptionWheel from '@/components/reactbits/OptionWheel/OptionWheel';
import SpecularButton from '@/components/reactbits/SpecularButton/SpecularButton';
import ClickSpark from '@/components/reactbits/ClickSpark/ClickSpark';
import CountUp from '@/components/reactbits/CountUp/CountUp';

const INCOTERMS = ['EXW', 'FOB', 'CFR', 'CIF', 'DAP', 'DDP'];

const REFERRAL_OPTIONS = [
  { value: '', label: 'Prefer not to say' },
  { value: 'search', label: 'Search engine' },
  { value: 'referral', label: 'Referral from a buyer or partner' },
  { value: 'trade-show', label: 'Trade show or exhibition' },
  { value: 'existing-client', label: 'We have shipped together before' },
  { value: 'shiveshwar', label: 'Shiveshwar Textiles' },
  { value: 'other', label: 'Other' },
];

const SUGGESTED_PORTS = [
  'Nhava Sheva (JNPT), India [INNSA]',
  'Mundra, India [INMUN]',
  'Kandla, India [INIXY]',
  'Jebel Ali, UAE [AEJEA]',
  'Rotterdam, Netherlands [NLRTM]',
  'Hamburg, Germany [DEHAM]',
  'Singapore, Singapore [SGSIN]',
  'Antwerp, Belgium [BEANR]',
  'Felixstowe, UK [GBFXT]',
  'Los Angeles, USA [USLAX]',
  'New York, USA [USNYC]',
  'Dammam, Saudi Arabia [SADMM]',
  'Mombasa, Kenya [KEMBA]',
  'Durban, South Africa [ZADUR]',
];

type FormState = {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  destination: string;
  industry: string;
  category: string;
  product: string;
  requirement: string;
  referral: string;
} & { [K in typeof HONEYPOT_FIELD]: string };

export type RfqPrefill = {
  product?: string;
  category?: string;
  division?: string;
  path?: string;
  industry?: string;
};

export function PathNote({ title, body }: { title: string; body: string }) {
  return (
    <div className="border-bronze/40 surface-raised mb-2xl flex flex-col gap-xs border p-lg">
      <Eyebrow tick={false} className="surface-faint">
        {title}
      </Eyebrow>
      <p className="surface-muted text-body-md max-w-[74ch]">{body}</p>
    </div>
  );
}

export function RfqPathNote() {
  const searchParams = useSearchParams();
  const path = searchParams.get('path');
  if (path === 'audit') {
    return (
      <PathNote
        title="Factory audit request"
        body="Marked for the audit route: tell us the protocol, the dates and who is attending. We arrange access at our parent company's mill in Surat or at the partner factory, and send the documentation set in advance."
      />
    );
  }
  if (path === 'sample') {
    return (
      <PathNote
        title="Sample request"
        body="Marked for sampling: give us the specification and the courier account or address. Textile samples typically ship within 20 days of specification lock, and your approval is recorded against the sample reference."
      />
    );
  }
  return null;
}

export function RfqForm({ prefill }: { prefill?: RfqPrefill } = {}) {
  const searchParams = useSearchParams();
  const paramCategory = searchParams.get('category') ?? prefill?.category ?? '';
  const paramIndustry = searchParams.get('industry') ?? prefill?.industry ?? '';
  const paramProduct = searchParams.get('product') ?? prefill?.product ?? '';
  const paramDivision = searchParams.get('division') ?? prefill?.division ?? '';
  const paramPath = searchParams.get('path') ?? prefill?.path ?? '';

  const [mountTime] = useState<number>(() => Date.now());
  const [prefillChip, setPrefillChip] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>('');

  // Stepper state: 1 Product & Industry -> 2 Grade / Specification -> 3 Quantity & Destination Port -> 4 Incoterm & Timeline -> 5 Contact & Review
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Sub-fields for specific step-by-step inputs that synthesize into standard requirement
  const [gradeSpec, setGradeSpec] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [targetIncoterm, setTargetIncoterm] = useState<string>('CIF');
  const [targetTimeline, setTargetTimeline] = useState<string>('Standard (30–45 days)');
  const [additionalNotes, setAdditionalNotes] = useState<string>('');

  // Port suggestions state with Anime.js
  const [portFilter, setPortFilter] = useState<string>('');
  const [showPortSuggestions, setShowPortSuggestions] = useState<boolean>(false);
  const portSuggestionsRef = useRef<HTMLUListElement | null>(null);

  const [values, setValues] = useState<FormState>(() => {
    let initialCategory = '';
    let initialIndustry = '';
    let initialProduct = '';
    let initialRequirement = '';

    if (paramProduct) {
      const match = PRODUCTS.find((p) => p.slug === paramProduct);
      if (match) {
        initialProduct = match.name;
        initialCategory = match.categorySlug;
        const catObj = CATEGORIES.find((c) => c.slug === match.categorySlug);
        if (catObj) initialIndustry = catObj.industrySlug;
        initialRequirement = `Sourcing inquiry for ${match.name} (HS Code: ${match.hsCode || 'TBD'}). Target grade, quantity, destination port, and delivery Incoterms:`;
      } else {
        initialProduct = paramProduct;
      }
    } else if (paramCategory) {
      const catObj = CATEGORIES.find((c) => c.slug === paramCategory);
      if (catObj) {
        initialCategory = catObj.slug;
        initialIndustry = catObj.industrySlug;
      } else {
        const indObj = INDUSTRIES.find((i) => i.slug === paramCategory);
        if (indObj) {
          initialIndustry = indObj.slug;
          const firstCat = CATEGORIES.find((c) => c.industrySlug === indObj.slug);
          if (firstCat) initialCategory = firstCat.slug;
        }
      }
    } else if (paramIndustry) {
      const indObj = INDUSTRIES.find((i) => i.slug === paramIndustry);
      if (indObj) {
        initialIndustry = indObj.slug;
        const firstCat = CATEGORIES.find((c) => c.industrySlug === indObj.slug);
        if (firstCat) initialCategory = firstCat.slug;
      }
    }

    if (!initialRequirement) {
      if (paramPath === 'sample') {
        initialRequirement =
          'Sample request: please specify sample grade, delivery address or courier account, and required testing metrics.';
      } else if (paramPath === 'audit') {
        initialRequirement =
          'Factory audit inquiry: please specify proposed dates, audit standards (e.g. ISO/SMETA), attendee details, and target facility.';
      }
    }

    return {
      fullName: '',
      companyName: '',
      email: '',
      phone: '',
      destination: '',
      industry: initialIndustry,
      category: initialCategory,
      product: initialProduct,
      requirement: initialRequirement,
      referral: '',
      [HONEYPOT_FIELD]: '',
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [fallbackMailto, setFallbackMailto] = useState<string | null>(null);
  const [sent, setSent] = useState<SubmissionResult | 'nothing' | null>(null);

  const formRef = useRef<HTMLFormElement | null>(null);
  const stepContainerRef = useRef<HTMLDivElement | null>(null);

  // Sync synthesized requirement if user edited granular steps
  useEffect(() => {
    if (gradeSpec || quantity || targetIncoterm || targetTimeline) {
      const synthesized = [
        values.product ? `Product: ${values.product}` : '',
        gradeSpec ? `Grade/Specification: ${gradeSpec}` : '',
        quantity ? `Target Quantity: ${quantity}` : '',
        values.destination ? `Destination Port: ${values.destination}` : '',
        targetIncoterm ? `Target Incoterm: ${targetIncoterm}` : '',
        targetTimeline ? `Delivery Timeline: ${targetTimeline}` : '',
        additionalNotes ? `Additional Market Specifications: ${additionalNotes}` : '',
      ]
        .filter(Boolean)
        .join(' · ');

      if (synthesized.length >= 20) {
        setValues((v) => ({ ...v, requirement: synthesized }));
      }
    }
  }, [gradeSpec, quantity, targetIncoterm, targetTimeline, additionalNotes, values.product, values.destination]);

  // Initial chips
  useEffect(() => {
    const pProd = searchParams.get('product');
    const pCat = searchParams.get('category');
    const pInd = searchParams.get('industry');
    const pPath = searchParams.get('path');

    if (pProd) {
      const match = PRODUCTS.find((p) => p.slug === pProd);
      if (match) {
        setPrefillChip(`Prefilled from catalogue: ${match.name}`);
      }
    } else if (pCat) {
      const match = CATEGORIES.find((c) => c.slug === pCat) || INDUSTRIES.find((i) => i.slug === pCat);
      if (match) {
        setPrefillChip(`Prefilled from category: ${match.name}`);
      }
    } else if (pInd) {
      const match = INDUSTRIES.find((i) => i.slug === pInd);
      if (match) {
        setPrefillChip(`Prefilled from industry: ${match.name}`);
        setValues((v) => ({ ...v, industry: match.slug }));
      }
    } else if (pPath === 'sample') {
      setPrefillChip('Prefilled: Sample Request route');
    } else if (pPath === 'audit') {
      setPrefillChip('Prefilled: Factory Audit route');
    }
  }, [searchParams]);

  // Anime.js Port Suggestions list animation
  useEffect(() => {
    if (showPortSuggestions && portSuggestionsRef.current) {
      const items = portSuggestionsRef.current.querySelectorAll('li');
      if (items.length > 0) {
        animate(items, {
          opacity: [0, 1],
          translateY: [-8, 0],
          delay: (_el, i) => (i ?? 0) * 35,
          duration: 250,
          easing: 'outQuad',
        });
      }
    }
  }, [showPortSuggestions, portFilter]);

  const set = (key: keyof FormState, value: string): void => {
    setValues((current) => {
      const next = { ...current, [key]: value };
      if (key === 'industry') {
        const owned = CATEGORIES.filter((category) => category.industrySlug === value).map(
          (category) => category.slug,
        );
        if (next.category && !owned.includes(next.category)) next.category = '';
      }
      return next;
    });
    if (errors[key]) {
      setErrors((current) => ({ ...current, [key]: '' }));
    }
  };

  const validateField = (field: keyof FormState): void => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const singleParse = RfqSubmissionSchema.shape[field as keyof typeof RfqSubmissionSchema.shape]?.safeParse(
      values[field],
    );
    if (singleParse && !singleParse.success) {
      setErrors((prev) => ({
        ...prev,
        [field]: singleParse.error.issues[0]?.message || 'Invalid field',
      }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const categoryOptions = useMemo(() => {
    const pool = values.industry
      ? CATEGORIES.filter((category) => category.industrySlug === values.industry)
      : CATEGORIES;
    return [
      { value: '', label: values.industry ? 'Select a category' : 'Select a category (optional)' },
      ...pool.map((category) => ({ value: category.slug, label: category.name })),
    ];
  }, [values.industry]);

  const validateAll = (): boolean => {
    const result = RfqSubmissionSchema.safeParse({
      ...values,
      path: paramPath === 'sample' || paramPath === 'audit' ? paramPath : '',
      division: paramDivision,
    });

    if (!result.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const p = issue.path[0]?.toString();
        if (p && !nextErrors[p]) {
          nextErrors[p] = issue.message;
        }
      }
      setErrors(nextErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  // Shake animation using Anime.js on validation errors
  const triggerErrorShake = (element: HTMLElement | null) => {
    if (!element) return;
    animate(element, {
      translateX: [0, -12, 10, -8, 6, -3, 0],
      duration: 500,
      easing: 'inOutQuad',
    });
  };

  // GSAP 0.5s x-slide + fade transition for Stepper steps
  const goToStep = (nextStep: number) => {
    if (nextStep < 1 || nextStep > 5) return;
    const isForward = nextStep > currentStep;

    if (stepContainerRef.current) {
      gsap.to(stepContainerRef.current, {
        opacity: 0,
        x: isForward ? -30 : 30,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          setCurrentStep(nextStep);
          gsap.fromTo(
            stepContainerRef.current,
            { opacity: 0, x: isForward ? 30 : -30 },
            { opacity: 1, x: 0, duration: 0.25, ease: 'power2.out' },
          );
        },
      });
    } else {
      setCurrentStep(nextStep);
    }
  };

  // Step-specific validation checks before stepping forward
  const handleStepNext = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (currentStep === 1) {
      if (!values.industry && !values.product) {
        setErrors((prev) => ({ ...prev, industry: 'Please select an industry tile or enter a product.' }));
        triggerErrorShake(stepContainerRef.current);
        return;
      }
    }
    if (currentStep === 2) {
      if (!gradeSpec && (!values.requirement || values.requirement.length < 5)) {
        setErrors((prev) => ({ ...prev, gradeSpec: 'Please enter grade or specification requirements.' }));
        triggerErrorShake(stepContainerRef.current);
        return;
      }
    }
    if (currentStep === 3) {
      if (!values.destination) {
        setErrors((prev) => ({ ...prev, destination: 'Destination country or port is recommended for pricing.' }));
      }
    }
    setErrors({});
    goToStep(currentStep + 1);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setSubmissionError(null);

    // Honeypot check
    if (values[HONEYPOT_FIELD]?.trim().length > 0) {
      track('bot_discarded', { form: 'rfq' });
      setSent('nothing');
      return;
    }

    if (!validateAll()) {
      triggerErrorShake(formRef.current);
      focusFirstInvalid(formRef.current);
      return;
    }

    setIsSubmitting(true);

    const industryObj = INDUSTRIES.find((entry) => entry.slug === values.industry);
    const categoryObj = CATEGORIES.find((entry) => entry.slug === values.category);
    const serviceSide = paramDivision === 'service-exports' || values.industry === 'technology';
    const deskMailbox = serviceSide ? CONTACT.general : CONTACT.sales;

    const about =
      values.product.trim() || categoryObj?.name || industryObj?.name || (serviceSide ? 'Service enquiry' : 'Enquiry');
    const subject = values.companyName.trim()
      ? `RFQ — ${about} — ${values.companyName.trim()}`
      : `RFQ — ${about}`;

    const mailtoEnquiry: Enquiry = {
      to: deskMailbox,
      subject,
      fields: [
        { label: 'Name', value: values.fullName },
        { label: 'Company', value: values.companyName },
        { label: 'Email', value: values.email },
        { label: 'Phone', value: values.phone },
        { label: 'Destination', value: values.destination },
        { label: 'Target Incoterm', value: targetIncoterm },
        { label: 'Industry', value: industryObj?.name ?? '' },
        { label: 'Category', value: categoryObj?.name ?? '' },
        { label: 'Product of interest', value: values.product },
        { label: 'Requirement', value: values.requirement },
        { label: 'Referral', value: referralLabel(values.referral) },
        { label: 'Path', value: pathLabel(paramPath) },
      ],
      footer: `Sent from trivoxagroup.com/rfq · ${new Date().toISOString().slice(0, 10)}`,
    };

    const mailtoHref = composeEnquiry(mailtoEnquiry);
    setFallbackMailto(mailtoHref);

    try {
      const response = await fetch('/api/rfq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          path: paramPath === 'sample' || paramPath === 'audit' ? paramPath : '',
          division: paramDivision,
          submittedAt: mountTime,
          turnstileToken,
          referringUrl: typeof window !== 'undefined' ? window.location.href : '',
        }),
      });

      const outcome = (await response.json()) as {
        ok?: boolean;
        reference?: string;
        error?: string;
        errors?: Record<string, string>;
      };

      if (!response.ok || !outcome.ok) {
        if (outcome.errors) {
          setErrors(outcome.errors);
          triggerErrorShake(formRef.current);
          focusFirstInvalid(formRef.current);
        }
        setSubmissionError(
          outcome.error || 'The server could not accept your enquiry. Please verify details or use email fallback.',
        );
        setIsSubmitting(false);
        return;
      }

      const reference = outcome.reference || 'TRV-RFQ-OK';
      setSent({ kind: 'queued', reference });
      setIsSubmitting(false);

      track('rfq_compose', {
        division: serviceSide ? 'service-exports' : 'product-exports',
        industry: industryObj?.slug,
        category: categoryObj?.slug,
        path: paramPath || undefined,
        destination: values.destination.trim() || undefined,
      });

      if (paramPath === 'audit') {
        track('audit_request', { from: 'rfq' });
      }
    } catch {
      setSubmissionError(
        'Network error connecting to the export desk. Your typed information has been saved.',
      );
      setIsSubmitting(false);
    }
  };

  if (sent === 'nothing') {
    return <SentPanel href="" />;
  }
  if (sent) {
    return (
      <SentPanel
        href={sent.kind === 'mailto' ? sent.href : ''}
        reference={sent.kind === 'queued' ? sent.reference : undefined}
      />
    );
  }

  const stepTitles = [
    '1. Product & Industry',
    '2. Specification',
    '3. Quantity & Port',
    '4. Incoterm & Timeline',
    '5. Contact & Review',
  ];

  const filteredPortSuggestions = SUGGESTED_PORTS.filter(
    (p) => !portFilter || p.toLowerCase().includes(portFilter.toLowerCase()),
  );

  return (
    <form ref={formRef} onSubmit={(e) => void onSubmit(e)} noValidate className="flex flex-col gap-lg">
      {prefillChip ? (
        <div className="border-bronze/50 surface-raised flex items-center justify-between gap-md border px-md py-sm text-body-sm rounded-lg">
          <span className="surface-fg font-medium">{prefillChip}</span>
          <button
            type="button"
            onClick={() => setPrefillChip(null)}
            className="surface-muted hover:surface-fg text-body-sm font-semibold focus-visible:outline-none"
            aria-label="Dismiss prefilled context"
          >
            ✕
          </button>
        </div>
      ) : null}

      {/* Stepper Progress Bar */}
      <div className="surface-raised surface-hairline border rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between text-xs font-mono mb-3">
          <span className="text-bronze font-semibold uppercase tracking-wider">
            Step {currentStep} of 5 — {stepTitles[currentStep - 1]}
          </span>
          <span className="surface-faint">{Math.round((currentStep / 5) * 100)}% complete</span>
        </div>
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
          {[1, 2, 3, 4, 5].map((step) => {
            const isDone = step < currentStep;
            const isCurrent = step === currentStep;
            return (
              <button
                key={step}
                type="button"
                onClick={() => (step < currentStep ? goToStep(step) : undefined)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  isDone
                    ? 'bg-bronze cursor-pointer'
                    : isCurrent
                      ? 'ring-bronze/50 bg-stone-900 ring-2'
                      : 'bg-stone-200 cursor-not-allowed'
                }`}
                aria-label={`Jump to step ${step}: ${stepTitles[step - 1]}`}
              />
            );
          })}
        </div>
      </div>

      {submissionError ? (
        <div role="alert" className="border-accent/60 bg-accent/10 flex flex-col gap-sm border p-md text-body-sm rounded-xl">
          <p className="font-medium text-accent">{submissionError}</p>
          {fallbackMailto ? (
            <p className="surface-fg text-body-xs">
              You can send this exact specification directly via your email client:{' '}
              <a href={fallbackMailto} className="link-underline font-semibold text-bronze-ink">
                Open formatted email fallback →
              </a>
            </p>
          ) : null}
        </div>
      ) : null}

      {/* Animated Step Container */}
      <div ref={stepContainerRef} className="min-h-[360px] flex flex-col justify-between">
        {/* STEP 1: Product & Industry */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="font-serif text-2xl font-bold text-stone-900">Select Industry & Sourcing Domain</h3>
              <p className="text-body-sm surface-muted mt-1">
                Choose the export division matching your sourcing contract. Selecting a sector loads verified HS codes and export standards.
              </p>
            </div>

            {/* ChromaGrid-styled 9 Tiles */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5" role="radiogroup" aria-label="Select Industry">
              {INDUSTRIES.map((ind) => {
                const isSelected = values.industry === ind.slug;
                return (
                  <button
                    key={ind.slug}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => {
                      set('industry', ind.slug);
                      const cat = CATEGORIES.find((c) => c.industrySlug === ind.slug);
                      if (cat) set('category', cat.slug);
                    }}
                    className={`relative p-3.5 sm:p-4 rounded-xl text-left border transition-all duration-200 flex flex-col justify-between min-h-[90px] sm:min-h-[105px] ${
                      isSelected
                        ? 'bg-espresso text-ivory border-bronze ring-bronze/30 shadow-md ring-2'
                        : 'bg-white/80 hover:bg-stone-50 border-stone-200/80 text-stone-900'
                    }`}
                  >
                    <div>
                      <span
                        className={`block font-mono text-[10px] uppercase tracking-wider ${
                          isSelected ? 'text-bronze' : 'text-stone-500'
                        }`}
                      >
                        {ind.slug === 'technology' ? 'Service Export' : 'Product Export'}
                      </span>
                      <strong className="block text-sm sm:text-base font-serif font-bold mt-1 leading-snug">
                        {ind.name}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-current/10 text-[11px] font-mono">
                      <span>{ind.status === 'live' ? 'Live Catalogue' : 'Onboarding'}</span>
                      {isSelected && <span aria-hidden="true">✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-12 gap-md pt-2">
              <Select
                className="col-span-12 sm:col-span-6"
                label="Narrow Category"
                options={categoryOptions}
                value={values.category}
                onChange={(event) => set('category', event.target.value)}
                disabled={isSubmitting}
              />
              <Input
                className="col-span-12 sm:col-span-6"
                label="Specific Product of Interest"
                list="rfq-products"
                placeholder="e.g. Suiting Fabric, Grey Fabric, Basmati Rice"
                value={values.product}
                onChange={(event) => set('product', event.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>
        )}

        {/* STEP 2: Grade / Specification */}
        {currentStep === 2 && (
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="font-serif text-2xl font-bold text-stone-900">Grade & Material Specification</h3>
              <p className="text-body-sm surface-muted mt-1">
                State exact technical grades (e.g. GSM/count for textiles, ASTM/ISO standard, 1121 steam for rice, purity %).
              </p>
            </div>

            <Textarea
              label="Grade / Technical Parameters"
              required
              rows={4}
              placeholder="e.g. 100% Cotton 30s Combed Compact, 140 GSM, Width 58 inches, Piece dyed, Shrinkage < 3%"
              value={gradeSpec}
              onChange={(e) => setGradeSpec(e.target.value)}
              hint="Be as specific as possible. Our technical export desk directly evaluates feasibility."
            />

            <Textarea
              label="Compliance & Certification Demanded"
              rows={3}
              placeholder="e.g. OEKO-TEX Standard 100, GOTS organic certificate, FDA registration, REACH compliance statement"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              hint="List any destination customs test protocols or third-party audits required (SGS / Intertek)."
            />
          </div>
        )}

        {/* STEP 3: Quantity & Destination Port */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="font-serif text-2xl font-bold text-stone-900">Order Quantity & Destination Port</h3>
              <p className="text-body-sm surface-muted mt-1">
                Enter target commercial volume and delivery port. Our Surat desk calculates freight routes from Mundra, Kandla or Nhava Sheva.
              </p>
            </div>

            <div className="grid grid-cols-12 gap-md">
              <Input
                className="col-span-12 sm:col-span-6"
                label="Target Order Volume / Quantity"
                placeholder="e.g. 1 x 20ft FCL (approx 18 MT) or 10,000 meters"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                hint="Unit price scales with full container loads (FCL) vs LCL."
              />

              <div className="col-span-12 sm:col-span-6 relative">
                <Input
                  label="Destination Port & Country"
                  placeholder="e.g. Jebel Ali, Rotterdam, Los Angeles"
                  value={values.destination}
                  onChange={(e) => {
                    set('destination', e.target.value);
                    setPortFilter(e.target.value);
                    setShowPortSuggestions(true);
                  }}
                  onFocus={() => setShowPortSuggestions(true)}
                  hint="Type port name or 5-letter UN/LOCODE."
                />

                {/* Animated suggestions popup via Anime.js */}
                {showPortSuggestions && filteredPortSuggestions.length > 0 && (
                  <ul
                    ref={portSuggestionsRef}
                    className="absolute z-50 left-0 right-0 top-[102%] mt-1 max-h-48 overflow-y-auto rounded-xl border border-stone-300 bg-white/95 backdrop-blur-md p-1.5 shadow-xl font-mono text-xs text-stone-800"
                  >
                    {filteredPortSuggestions.slice(0, 6).map((port) => (
                      <li
                        key={port}
                        onClick={() => {
                          set('destination', port);
                          setShowPortSuggestions(false);
                        }}
                        className="cursor-pointer rounded-lg px-3 py-2 hover:bg-stone-100 hover:text-stone-950 transition-colors flex items-center justify-between"
                      >
                        <span>{port}</span>
                        <span className="text-bronze text-[10px]">Select ↵</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Quick Port Chips from Taxonomy */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-bronze font-mono text-xs uppercase tracking-wider block mb-2">
                Common Loading Ports from Gujarat Belt:
              </span>
              <div className="flex flex-wrap gap-2">
                {PORTS.map((p) => (
                  <button
                    key={p.slug}
                    type="button"
                    onClick={() => {
                      set('destination', `${p.name} [${p.locode}]`);
                      setShowPortSuggestions(false);
                    }}
                    className="hover:border-bronze hover:text-bronze font-mono text-xs px-2.5 py-1 rounded-md border border-stone-300 bg-white transition-colors"
                  >
                    {p.name} ({p.locode})
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Incoterm & Timeline */}
        {currentStep === 4 && (
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="font-serif text-2xl font-bold text-stone-900">Target Incoterm & Delivery Schedule</h3>
              <p className="text-body-sm surface-muted mt-1">
                Select your contract terms. FOB/CIF from Western India ports are our standard operating baselines.
              </p>
            </div>

            {/* OptionWheel with native fallback */}
            <div className="grid grid-cols-12 gap-6 items-center">
              <div className="col-span-12 sm:col-span-7">
                <div className="h-44 rounded-2xl border border-stone-200 bg-white/60 p-2 overflow-hidden shadow-inner flex flex-col justify-center">
                  <span className="font-mono text-[10px] text-stone-500 uppercase tracking-wider px-3 mb-1">
                    Scroll or drag to set Incoterm:
                  </span>
                  <div className="h-32 w-full">
                    <OptionWheel
                      items={INCOTERMS}
                      defaultSelected={INCOTERMS.indexOf(targetIncoterm) !== -1 ? INCOTERMS.indexOf(targetIncoterm) : 3}
                      onChange={(_idx, item) => setTargetIncoterm(item)}
                      activeColor="#241C18"
                      textColor={BRAND.bronze.hex}
                      fontSize={1.4}
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-12 sm:col-span-5 flex flex-col gap-4">
                {/* Accessible native select fallback */}
                <Select
                  label="Incoterm (Select fallback)"
                  options={INCOTERMS.map((term) => ({ value: term, label: term }))}
                  value={targetIncoterm}
                  onChange={(e) => setTargetIncoterm(e.target.value)}
                  hint="EXW (Factory gate), FOB (Port), CFR (Freight), CIF (Insurance & Freight), DAP, DDP"
                />

                <Select
                  label="Target Delivery Lead Time"
                  options={[
                    { value: 'Urgent (15–20 days)', label: 'Urgent (15–20 days air / express)' },
                    { value: 'Standard (30–45 days)', label: 'Standard (30–45 days sea freight)' },
                    { value: 'Flexible / Recurring contracts', label: 'Flexible / Recurring supply agreement' },
                  ]}
                  value={targetTimeline}
                  onChange={(e) => setTargetTimeline(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Contact & Review */}
        {currentStep === 5 && (
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="font-serif text-2xl font-bold text-stone-900">Contact Details & Final Review</h3>
              <p className="text-body-sm surface-muted mt-1">
                Where should the export desk send the formal commercial quotation and proforma documentation?
              </p>
            </div>

            <div className="grid grid-cols-12 gap-md">
              <Input
                className="col-span-12 sm:col-span-6"
                label="Full name"
                required
                autoComplete="name"
                value={values.fullName}
                error={touched.fullName ? errors.fullName : undefined}
                onBlur={() => validateField('fullName')}
                onChange={(event) => set('fullName', event.target.value)}
                disabled={isSubmitting}
              />
              <Input
                className="col-span-12 sm:col-span-6"
                label="Company"
                required
                autoComplete="organization"
                value={values.companyName}
                error={touched.companyName ? errors.companyName : undefined}
                onBlur={() => validateField('companyName')}
                onChange={(event) => set('companyName', event.target.value)}
                disabled={isSubmitting}
              />
              <Input
                className="col-span-12 sm:col-span-6"
                label="Work Email"
                type="email"
                required
                autoComplete="email"
                value={values.email}
                error={touched.email ? errors.email : undefined}
                onBlur={() => validateField('email')}
                onChange={(event) => set('email', event.target.value)}
                disabled={isSubmitting}
              />
              <Input
                className="col-span-12 sm:col-span-6"
                label="Phone (with country code)"
                type="tel"
                autoComplete="tel"
                value={values.phone}
                error={touched.phone ? errors.phone : undefined}
                onBlur={() => validateField('phone')}
                onChange={(event) => set('phone', event.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <Textarea
              label="Synthesized Requirement & Notes"
              required
              rows={4}
              value={values.requirement}
              error={touched.requirement ? errors.requirement : undefined}
              onBlur={() => validateField('requirement')}
              onChange={(event) => set('requirement', event.target.value)}
              disabled={isSubmitting}
              hint="You can review and refine this composite specification before transmitting."
            />

            <Select
              label="How did you hear about Trivoxa Group?"
              options={REFERRAL_OPTIONS}
              value={values.referral}
              onChange={(event) => set('referral', event.target.value)}
              disabled={isSubmitting}
            />

            <TurnstileWidget onVerify={setTurnstileToken} onExpire={() => setTurnstileToken('')} />
          </div>
        )}

        {/* Stepper Navigation Actions */}
        <div className="mt-8 pt-6 border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-4">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => goToStep(currentStep - 1)}
                className="font-mono text-xs uppercase px-4 py-2.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 transition-colors"
              >
                ← Back
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleStepNext}
                className="font-mono text-xs uppercase font-semibold px-6 py-3 rounded-lg bg-stone-900 text-white hover:bg-stone-800 transition-colors shadow-sm"
              >
                Continue to Step {currentStep + 1} →
              </button>
            ) : (
              <ClickSpark sparkColor={BRAND.bronze.hex} sparkCount={12} duration={400}>
                <SpecularButton
                  type="submit"
                  size="md"
                  disabled={isSubmitting}
                  radius={12}
                  tint={BRAND.bronze.hex}
                  tintOpacity={0.15}
                  lineColor={BRAND.bronze.hex}
                  textColor={BRAND.ivory.hex}
                  baseColor={BRAND.espresso.hex}
                  className="bg-espresso text-ivory px-8 py-3.5 font-medium"
                >
                  {isSubmitting ? 'Transmitting to Export Desk...' : 'Transmit RFQ to Export Desk →'}
                </SpecularButton>
              </ClickSpark>
            )}
          </div>
        </div>
      </div>

      <datalist id="rfq-products">
        {PRODUCTS.map((product) => (
          <option key={product.slug} value={product.name} />
        ))}
      </datalist>

      {/* honeypot */}
      <div className="absolute -left-[9999px] top-0" aria-hidden>
        <Input
          label="Company website URL"
          tabIndex={-1}
          autoComplete="off"
          value={values[HONEYPOT_FIELD] ?? ''}
          onChange={(event) => set(HONEYPOT_FIELD, event.target.value)}
        />
      </div>

      <Prose className="text-body-xs mt-2">
        <p className="surface-muted max-w-[50ch]">
          Enquiries are received securely by our export desk and processed in accordance with our{' '}
          <Link href="/legal/privacy" className="link-underline text-bronze-ink">
            Privacy Policy
          </Link>.
        </p>
      </Prose>
    </form>
  );
}

/* ------------------------------------------------------------------------ */

function SentPanel({ href, reference }: { href: string; reference?: string }) {
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const checkRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    headingRef.current?.focus();

    // Anime.js draw SVG check
    if (checkRef.current) {
      const path = checkRef.current.querySelector('path');
      if (path) {
        animate(path, {
          strokeDashoffset: [100, 0],
          duration: 900,
          easing: 'easeOutQuad',
        });
      }
    }
  }, []);

  return (
    <ClickSpark sparkColor={BRAND.bronze.hex} sparkCount={16} duration={500}>
      <div role="status" className="border-bronze/50 surface-raised flex flex-col gap-md border p-xl rounded-2xl shadow-xl bg-white">
        <div className="flex items-center gap-3">
          <svg
            ref={checkRef}
            className="w-8 h-8 text-emerald-600 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="100"
              strokeDashoffset="100"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <Eyebrow tick={false} className="surface-faint text-emerald-700 font-semibold">
            Enquiry Received & Verified
          </Eyebrow>
        </div>

        <h2 ref={headingRef} tabIndex={-1} className="text-heading-lg max-w-[32ch] rounded-sm font-serif">
          {reference
            ? `Enquiry received — reference ${reference}.`
            : `Your mail client has the enquiry.`}
        </h2>

        <div className="text-bronze bg-espresso text-ivory font-mono text-sm font-semibold px-4 py-2.5 rounded-xl inline-block max-w-fit">
          Answered within <CountUp to={24} duration={1.5} className="text-bronze text-xl font-bold" /> business hours (IST)
        </div>

        <Prose className="text-body-md">
          <p className="surface-muted max-w-[62ch] leading-relaxed">
            {reference
              ? 'A confirmation email with your specification details has been sent to your address. Our export desk in Surat reviews specifications Monday to Saturday, 10:00–19:00 IST.'
              : 'If nothing opened, use the link below or write to us directly. Either route reaches the same three people.'}
          </p>
        </Prose>

        <div className="mt-sm flex flex-wrap gap-md pt-2 border-t border-stone-200">
          {href ? (
            <a href={href} className="link-underline text-bronze-ink text-body-md font-medium">
              Open the enquiry again →
            </a>
          ) : null}
          <a href={`mailto:${CONTACT.sales}`} className="link-underline text-bronze-ink text-body-md font-medium">
            {CONTACT.sales}
          </a>
        </div>
      </div>
    </ClickSpark>
  );
}

function referralLabel(value: string): string {
  return REFERRAL_OPTIONS.find((option) => option.value === value)?.label ?? '';
}

function pathLabel(path?: string): string {
  if (path === 'audit') return 'Factory audit';
  if (path === 'sample') return 'Sample request';
  return '';
}
