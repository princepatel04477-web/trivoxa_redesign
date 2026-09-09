import { ClipboardCheck, Factory, Handshake, Stamp } from 'lucide-react';
import { Reveal } from '@/components/motion/reveal';
import { Card } from '@/components/ui/card';
import { Container, Section } from '@/components/ui/layout';
import { SectionHeading } from '@/components/ui/typography';

/**
 * P7 · SECTION B — Why Businesses Choose Trivoxa.
 *
 * The live site's four pillars were good in shape and weak in substance
 * ("abstraction stacking"). Rewritten here so every pillar contains one
 * concrete noun — a process step, a document type, a port, a standard — and no
 * sentence exceeds 22 words. The banned vocabulary (leverage, synergy,
 * seamless, cutting-edge) appears nowhere.
 *
 * Order preserved from the live site: proof before story.
 */
const PILLARS = [
  {
    icon: Factory,
    title: 'Manufacturing Foundation',
    body: 'Our parent company Shiveshwar Textiles weaves export-grade cotton and polyester in Surat. That floor-level knowledge sets every specification we quote.',
  },
  {
    icon: ClipboardCheck,
    title: 'Quality-Driven Operations',
    body: 'Each order carries a written inspection plan: GSM and composition checks, carton drop tests, pre-shipment photos. You see the report before the vessel sails.',
  },
  {
    icon: Stamp,
    title: 'Global Trade Expertise',
    body: 'We prepare the paperwork buyers actually get asked for: COO, phytosanitary, material test certificates. Incoterms and lead times are quoted per line, not per brochure.',
  },
  {
    icon: Handshake,
    title: 'Long-Term Partnerships',
    body: 'Most of our capacity is reserved by buyers on their second and third programme. We price for the fifth order, not the first.',
  },
] as const;

export function WhyTrivoxa() {
  return (
    <Section surface="deep">
      <Container>
        <SectionHeading
          eyebrow="Why Businesses Choose Trivoxa"
          title="Built on Experience. Focused on Partnership."
        />

        <Reveal staggerChildren className="mt-3xl grid grid-cols-12 gap-lg">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Card
                key={pillar.title}
                trace
                className="col-span-12 flex flex-col gap-md p-lg md:col-span-6 xl:col-span-3"
              >
                <Icon aria-hidden className="text-accent size-5" strokeWidth={1.25} />
                <h3 className="text-heading-lg">{pillar.title}</h3>
                <p className="surface-muted text-body-md">{pillar.body}</p>
              </Card>
            );
          })}
        </Reveal>
      </Container>
    </Section>
  );
}
