'use client';

import { useParams, useRouter } from 'next/navigation';
import { useDeferredValue, useMemo, useReducer, useState } from 'react';

import { GroupMember } from '@/app/api';
import Button from '@/app/Button';

import { useToast } from '@/app/NotificationContext';
import MemberItem from './MemberItem';

type CheckedItemsAction =
  | { type: 'update'; key: number; checked: boolean }
  | { type: 'reset' };
type Props = {
  kind: 'members' | 'pending';
  members: GroupMember[];
};
export default function MemberList(props: Props) {
  const { kind, members } = props;
  const { id } = useParams();
  const router = useRouter();
  const showToast = useToast();

  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [checkedItems, dispatch] = useReducer(
    (state: Record<number, boolean>, action: CheckedItemsAction) => {
      switch (action.type) {
        case 'update':
          return { ...state, [action.key]: action.checked };
        case 'reset':
          return {};
        default:
          return state;
      }
    },
    {},
  );
  const [removeInProgress, setRemoveInProgress] = useState(false);

  const selectedCount = useMemo(
    () => Object.values(checkedItems).filter(Boolean).length,
    [checkedItems],
  );
  const filteredMembers = useMemo(
    () => {
      const query = deferredQuery.trim();
      if (query === '') {
        return members;
      }

      return members.filter(
        ({ name, studentNumber }) => (
          name.includes(deferredQuery) || studentNumber.includes(deferredQuery)
        ),
      );
    },
    [members, deferredQuery],
  );

  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }

  async function handleMembership(action: 'add' | 'remove') {
    if (selectedCount <= 0) {
      return;
    }

    const uid = members
      .map(member => member.uid)
      .filter(uid => Boolean(checkedItems[uid]));

    try {
      setRemoveInProgress(true);
      const resp = await fetch(`/group/${id}/membership`, {
        method: 'post',
        body: JSON.stringify({ action, uid }),
        credentials: 'same-origin',
        headers: {
          'content-type': 'application/json',
        },
      });

      if (!resp.ok) {
        const body = await resp.json();
        const message = body?.message;
        if (message) {
          showToast({
            type: 'error',
            message,
          });
        }
        return;
      }
    } finally {
      setRemoveInProgress(false);
    }

    if (action === 'add') {
      showToast({
        type: 'info',
        message: `${selectedCount}명의 신청을 승인했습니다.`,
      });
    } else if (kind === 'members') {
      showToast({
        type: 'info',
        message: `${selectedCount}명을 그룹에서 제외했습니다.`,
      });
    } else {
      showToast({
        type: 'info',
        message: `${selectedCount}명의 신청을 거절했습니다.`,
      });
    }

    dispatch({ type: 'reset' });
    router.refresh();
  }

  let controlButtons;
  if (kind === 'members') {
    controlButtons = (
      <Button
        className="flex-0 w-32"
        color="accent"
        type="button"
        disabled={selectedCount <= 0 || removeInProgress}
        onClick={() => handleMembership('remove')}
      >
        그룹에서 제외
      </Button>
    );
  } else {
    controlButtons = (
      <>
        <Button
          className="flex-0 w-24"
          type="button"
          disabled={selectedCount <= 0 || removeInProgress}
          onClick={() => handleMembership('remove')}
        >
          거절
        </Button>
        <Button
          className="flex-0 w-24"
          color="primary"
          type="button"
          disabled={selectedCount <= 0 || removeInProgress}
          onClick={() => handleMembership('add')}
        >
          승인
        </Button>
      </>
    );
  }

  return (
    <section className="flex flex-col items-stretch gap-2">
      <div className="flex flex-row items-center justify-end gap-2 mb-2">
        <span className="flex-none">{selectedCount}명 선택됨</span>
        {controlButtons}
      </div>
      <input
        className="min-w-0 bg-transparent border rounded p-1"
        placeholder="검색"
        value={query}
        onChange={handleQueryChange}
      />
      <table className="table-fixed border">
        <thead>
          <tr className="h-8">
            <th className="border w-8"></th>
            <th className="border w-1/3">학번</th>
            <th className="border">이름</th>
          </tr>
        </thead>
        <tbody>
          {filteredMembers.map(member => (
            <MemberItem
              {...member}
              key={member.uid}
              checked={Boolean(checkedItems[member.uid])}
              onChange={checked => dispatch({ type: 'update', key: member.uid, checked })}
            />
          ))}
        </tbody>
      </table>
    </section>
  );
}
