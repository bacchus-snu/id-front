'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

export default function NavigationTab() {
  const { id } = useParams();
  const pathname = usePathname();

  return (
    <ul className="text-lg flex flex-row gap-2">
      <li className="flex-1 text-center">
        <Link
          className={pathname.endsWith('members') ? 'font-bold' : ''}
          href={`/group/${id}/members`}
        >
          멤버 목록
        </Link>
      </li>
      <li className="flex-1 text-center">
        <Link
          className={pathname.endsWith('pending') ? 'font-bold' : ''}
          href={`/group/${id}/pending`}
        >
          신청 대기 목록
        </Link>
      </li>
    </ul>
  );
}
