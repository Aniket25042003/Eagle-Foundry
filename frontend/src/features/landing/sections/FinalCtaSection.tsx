import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionShell } from '@/features/landing/components/section-shell';
import { useTheme } from '@/hooks/useTheme';

export function FinalCtaSection(): JSX.Element {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  return (
    <SectionShell className="pb-12">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="ef-heading-gradient text-4xl font-semibold leading-tight md:text-5xl">
          Build the next category-defining venture together.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-[var(--muted)] md:text-base">
          Join the network where student ambition meets company momentum and investment-ready execution.
        </p>
        <div className="mt-7 flex items-center justify-center gap-3">
          <Button withBorderEffect={false} className="gap-2 px-6" onClick={() => navigate('/sign-up')}>
            Join Eagle-Foundry
            <ArrowUpRight size={14} />
          </Button>
          <Button variant="ghost" onClick={() => window.location.href = 'mailto:contact@eagle-foundry.example'}>
            Contact Sales
          </Button>
        </div>
      </div>

      <div className="ef-card mt-16 rounded-2xl border border-[var(--border)] bg-[var(--elements)] p-5">
        <p className="text-center text-[clamp(3rem,14vw,10rem)] font-bold uppercase leading-[0.86] tracking-tight text-transparent">
          <span className="block [-webkit-text-stroke:2px_#FBBF24] [text-stroke:2px_#FBBF24]">
            Eagle
          </span>
          <span className="block [-webkit-text-stroke:2px_#C4B5FD] [text-stroke:2px_#C4B5FD]">
            Foundry
          </span>
        </p>
      </div>

      <footer className="mt-10 flex flex-col gap-6 border-t border-[var(--border)] pt-7 text-sm text-[var(--muted)] md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <img
            src={isDark ? '/assets/brand/logo-dark-512.png' : '/assets/brand/logo-light-512.png'}
            alt="Eagle-Foundry"
            className="h-16 w-16 rounded-full"
          />
          <span className="text-base font-semibold tracking-wide text-[var(--foreground)]">Eagle-Foundry</span>
        </div>

        <div className="flex flex-wrap items-center gap-5">
          <Link to="/docs" className="transition-colors hover:text-[var(--foreground)]">Docs</Link>
          <Link to="/privacy" className="transition-colors hover:text-[var(--foreground)]">Privacy</Link>
          <Link to="/terms" className="transition-colors hover:text-[var(--foreground)]">Terms</Link>
          <Link to="/contact" className="transition-colors hover:text-[var(--foreground)]">Contact</Link>
        </div>
      </footer>
    </SectionShell>
  );
}
