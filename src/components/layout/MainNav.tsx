'use client';

import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Projects', href: '/projects' },
  { name: 'Info', href: '/info' },
  { name: 'Contact', href: '/contact' },
];

export default function MainNav() {
  return (
    <header className="fixed top-12 left-[70px] z-[100]">
      <div className="flex flex-col gap-10">
        <div>
          <h1 className="text-[42px] font-light tracking-tight mb-2">Jack Ross</h1>
          <p className="text-base font-light tracking-wide opacity-70">
            Photographer & Growth Professional
          </p>
        </div>

        <NavigationMenu orientation="vertical">
          <NavigationMenuList className="flex-col items-start space-x-0 space-y-3">
            {navItems.map((item) => (
              <NavigationMenuItem key={item.name}>
                <Link href={item.href} legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <div className="flex items-center gap-2.5">
                      <div className="text-base leading-none opacity-30">●</div>
                      <span className="text-base font-light tracking-wide">{item.name}</span>
                    </div>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}
