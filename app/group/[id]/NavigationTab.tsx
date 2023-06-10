'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

export default function NavigationTab() {
  const { id } = useParams();

  return (
    <div className="text-lg flex flex-row text-center border-b border-black/10 dark:border-white/10">
      <Tab href={`/group/${id}/members`}>
        멤버 목록
      </Tab>
      <Tab href={`/group/${id}/pending`}>
        승인 대기 목록
      </Tab>
    </div>
  );
}

function Tab(props: { href: string; children: React.ReactNode }) {
  const { href, children } = props;
  const pathname = usePathname();
  const isActive = pathname === href;

  let className = 'flex-1 rounded-t p-2 transition';
  if (isActive) {
    className += ' font-bold border-b-2 border-primary-300 dark:border-primary-600'
      + ' bg-black/20 dark:bg-white/20';
  } else {
    className += ' hover:bg-black/10 dark:hover:bg-white/10';
  }

  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
}
