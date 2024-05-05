'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavigationTab() {
  return (
    <div className="text-lg flex flex-row text-center">
      <Tab href="members">
        멤버 목록
      </Tab>
      <Tab href="pending">
        승인 대기 목록
      </Tab>
    </div>
  );
}

function Tab(props: { href: string; children: React.ReactNode }) {
  const { href, children } = props;
  const pathname = usePathname();
  const isActive = pathname.endsWith(href);

  let className = 'flex-1 rounded-t p-2 transition'
    + ' hover:bg-black/10 dark:hover:bg-white/10 active:bg-black/15 dark:active:bg-white/15';
  if (isActive) {
    className += ' font-bold border-b-2 border-primary-300 dark:border-primary-600';
  } else {
    className += ' border-b border-black/10 dark:border-white/10';
  }

  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
}
