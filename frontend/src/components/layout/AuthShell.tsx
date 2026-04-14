import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AuthShell(): JSX.Element {
  const { pathname } = useLocation();
  const isRoleSelection = pathname === '/sign-up';

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-4 py-12 text-[var(--foreground)]">
      <div className="pointer-events-none absolute inset-0 landing-grid opacity-[0.08]" />
      <div className="pointer-events-none absolute left-1/2 top-[-16rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[var(--elements)]/10 blur-[180px]" />
      <div className="pointer-events-none absolute right-[-12rem] top-[10rem] h-[22rem] w-[22rem] rounded-full bg-blue-500/15 blur-[140px]" />

      <div className={`relative z-10 w-full ${isRoleSelection ? 'max-w-4xl' : 'max-w-md'}`}>
        <Link to="/" className="mb-8 flex items-center justify-center gap-3">
          <img src="/assets/brand/logo-dark-512.png" alt="Eagle-Foundry" className="h-16 w-16 rounded-full" />
          <span className="text-base font-semibold tracking-wide text-[var(--foreground)]">Eagle-Foundry</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-2xl border border-white/10 bg-[var(--elements)] p-6 backdrop-blur-lg md:p-8"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
