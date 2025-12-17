'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Projects', href: '/projects' },
  { name: 'Info', href: '/info' },
  { name: 'Contact', href: '/contact' },
];

export default function MainNav() {
  const pathname = usePathname();

  return (
    <header className="fixed top-12 left-[70px] z-[100] md:top-12 md:left-[70px] top-6 left-6">
      <div className="flex flex-col gap-8 md:gap-8 gap-6">
        <div>
          <h1 className="text-[34px] md:text-[34px] text-[24px] font-light tracking-tight mb-2">Jack Ross</h1>
          <p className="text-[13px] md:text-[13px] text-[11px] font-light tracking-wide opacity-70">
            Photographer & Growth Professional
          </p>
        </div>

        <nav>
          <ul className="flex flex-col gap-3 md:gap-3 gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name} className="flex items-center gap-2.5">
                  <div className={`text-[13px] md:text-[13px] text-[11px] leading-none transition-opacity ${isActive ? 'opacity-100' : 'opacity-30'}`}>●</div>
                  <Link
                    href={item.href}
                    className="text-[13px] md:text-[13px] text-[11px] font-light tracking-wide hover:opacity-60 transition-opacity"
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
