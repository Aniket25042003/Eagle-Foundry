import { type PointerEvent, useCallback, useRef } from 'react';
import { HeroSection } from '@/features/landing/sections/HeroSection';
import { TrustStripSection } from '@/features/landing/sections/TrustStripSection';
import { CodeApiSection } from '@/features/landing/sections/CodeApiSection';
import { DeveloperExperienceSection } from '@/features/landing/sections/DeveloperExperienceSection';
import { ReactEmailSection } from '@/features/landing/sections/ReactEmailSection';
import { DeliverabilitySection } from '@/features/landing/sections/DeliverabilitySection';
import { TestimonialSection } from '@/features/landing/sections/TestimonialSection';
import { ControlSection } from '@/features/landing/sections/ControlSection';
import { ExpectationsSection } from '@/features/landing/sections/ExpectationsSection';
import { FinalCtaSection } from '@/features/landing/sections/FinalCtaSection';

export default function LandingPage(): JSX.Element {
  const rootRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<HTMLElement[] | null>(null);

  const handlePointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    if (!cardsRef.current && rootRef.current) {
      cardsRef.current = Array.from(rootRef.current.querySelectorAll<HTMLElement>('.ef-card'));
    }

    const cards = cardsRef.current ?? [];

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--x', `${event.clientX - rect.left}`);
      card.style.setProperty('--y', `${event.clientY - rect.top}`);
    });
  }, []);

  return (
    <main
      ref={rootRef}
      onPointerMove={handlePointerMove}
      className="relative overflow-hidden bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300"
    >
      <div className="pointer-events-none absolute inset-0 landing-grid opacity-[0.14]" />

      <div className="pointer-events-none absolute inset-x-0 top-[-30rem] mx-auto h-[52rem] w-[52rem] rounded-full blur-[220px] bg-white/10 dark:bg-white/10 [.light_&]:bg-violet-200/30" />

      <div className="pointer-events-none absolute right-[-24rem] top-[20rem] h-[35rem] w-[35rem] rounded-full blur-[180px] bg-blue-500/20 dark:bg-blue-500/20 [.light_&]:bg-amber-300/20" />

      <div className="relative z-10">
        <HeroSection />
        <TrustStripSection />
        <CodeApiSection />
        <DeveloperExperienceSection />
        <ReactEmailSection />
        <DeliverabilitySection />
        <TestimonialSection />
        <ControlSection />
        <ExpectationsSection />
        <FinalCtaSection />
      </div>
    </main>
  );
}
