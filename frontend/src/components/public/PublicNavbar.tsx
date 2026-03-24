import { ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const navLinks = [
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'For Students', href: '/for-students' },
  { label: 'For Companies', href: '/for-companies' },
  { label: 'Funding', href: '/funding' },
  { label: 'Contact', href: '/contact' },
];

export default function PublicNavbar(): JSX.Element {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between gap-4 px-6 pt-8 md:px-10">
      <Link to="/" className="inline-flex items-center gap-3">
        <picture>
          <source media="(prefers-color-scheme: light)" srcSet="/assets/brand/logo-light-512.png" />
          <img src="/assets/brand/logo-dark-512.png" alt="Eagle-Foundry" className="h-8 w-8 rounded-full object-cover" />
        </picture>
        <span className="text-sm font-semibold tracking-wide text-zinc-100">Eagle-Foundry</span>
      </Link>
      <nav className="hidden items-center gap-7 text-xs text-zinc-300 md:flex">
        {navLinks.map((item) => (
          <Link key={item.href} to={item.href} className="transition-colors hover:text-white">
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <Button variant="ghost" className="hidden md:inline-flex" onClick={() => navigate('/login')}>Sign In</Button>
        <Button withBorderEffect={false} className="gap-2" onClick={() => navigate('/sign-up')}>
          Get Started <ArrowRight size={14} />
        </Button>
      </div>
    </header>
  );
}
