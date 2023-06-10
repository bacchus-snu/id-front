'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { GroupMember } from '@/app/api';
import { useToast } from '@/app/NotificationContext';

type Props = GroupMember & {
  checked?: boolean;
  onChange?(checked: boolean): void;
};
export default function MemberItem(props: Props) {
  const { id } = useParams();
  const router = useRouter();
  const showToast = useToast();

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  function handleAccept() {
  }

  function handleReject() {
  }

  return (
    <tr className="h-8 hover:bg-black/10 dark:hover:bg-white/10">
      <td className="text-right tabular-nums px-2 border-r">{props.studentNumber}</td>
      <td className="px-2 border-r">{props.name}</td>
      <td>
      </td>
    </tr>
  );
}
