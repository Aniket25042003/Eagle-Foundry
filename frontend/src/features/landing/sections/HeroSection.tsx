import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { SectionShell } from '@/features/landing/components/section-shell';
import { PublicNavbar } from '@/components/public/PublicNavbar';

export function HeroSection(): JSX.Element {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden">
      <PublicNavbar />

      <SectionShell className="pb-8 -mt-40 md:pt-10">
        <div className="grid items-stretch gap-10 md:grid-cols-[1.05fr_1fr]">

          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex flex-col justify-center space-y-7"
          >
            <h1 className="ef-heading-gradient max-w-xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              The venture network where students and companies build together.
            </h1>
            <p className="max-w-lg text-sm leading-relaxed text-[var(--muted)] md:text-base">
              Students launch ideas, recruit co-founders, and raise support. Companies outsource strategic work, discover
              founder-ready talent, and invest early in high-conviction projects.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button withBorderEffect={false} className="px-6 py-2.5" onClick={() => navigate('/sign-up')}>
                Create a Project
              </Button>
            </div>
          </motion.div>

             <img
              src="/assets/brand/landing.png"
              alt="Eagle-Foundry"
              className="relative z-10 h-full w-full rounded-2xl object-cover"
              style={{ maxHeight: '460px' }}
            />
         
        </div>
      </SectionShell>
    </div>
  );
}



