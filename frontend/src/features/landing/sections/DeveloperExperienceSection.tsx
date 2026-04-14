import { motion } from 'framer-motion';
import { GlowCard } from '@/features/landing/components/glow-card';
import { SectionShell } from '@/features/landing/components/section-shell';
import { SectionHeading } from '@/components/ui/section-heading';

export function DeveloperExperienceSection(): JSX.Element {
  return (
    <SectionShell>
      <SectionHeading
        title="Built for founder-level execution"
        description="Gives student teams, company operators, and university admins one shared platform from submission to approved collaboration."
      />

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65 }}
        >
          <GlowCard className="h-full">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Startup lifecycle</p>
            <div className="mt-5 space-y-3 text-sm text-[var(--foreground)]">
              <div className="ef-card ef-card-soft rounded-lg border border-[var(--border)] bg-black/[0.04] dark:bg-black/50 p-3">
                Draft → Submitted → Needs Changes → Approved → Published
              </div>
              <div className="ef-card ef-card-soft rounded-lg border border-[var(--border)] bg-black/[0.04] dark:bg-black/50 p-3">
                Join a founder to start collaborating
              </div>
              <div className="ef-card ef-card-soft rounded-lg border border-[var(--border)] bg-black/[0.04] dark:bg-black/50 p-3">
                Upload files for resumes, startup media, and portfolio artifacts
              </div>
            </div>
          </GlowCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, delay: 0.05 }}
        >
          <GlowCard className="h-full">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Execution visibility</p>
            <div className="mt-5 space-y-4 text-sm text-[var(--foreground)]">
              <div className="ef-card ef-card-soft flex items-center justify-between rounded-lg border border-[var(--border)] bg-black/[0.04] dark:bg-black/50 p-3">
                <span>Pending startup reviews</span>
                <span className="font-semibold text-amber-500 dark:text-amber-300">14</span>
              </div>
              <div className="ef-card ef-card-soft flex items-center justify-between rounded-lg border border-[var(--border)] bg-black/[0.04] dark:bg-black/50 p-3">
                <span>Open opportunity applications</span>
                <span className="font-semibold text-cyan-600 dark:text-cyan-300">86</span>
              </div>
              <div className="ef-card ef-card-soft flex items-center justify-between rounded-lg border border-[var(--border)] bg-black/[0.04] dark:bg-black/50 p-3">
                <span>Unread notifications</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-300">9</span>
              </div>
            </div>
          </GlowCard>
        </motion.div>
      </div>
    </SectionShell>
  );
}
