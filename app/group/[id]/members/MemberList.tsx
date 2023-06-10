'use client';

import { GroupMember } from '@/app/api';
import { useDeferredValue, useMemo, useReducer, useState } from 'react';
import MemberItem from './MemberItem';
import Button from '@/app/Button';

type CheckedItemsAction =
  | { type: 'update'; key: number; checked: boolean }
;
type Props = {
  members: GroupMember[];
};
export default function MemberList(props: Props) {
  const { members } = props;
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [checkedItems, dispatch] = useReducer(
    (state: Record<number, boolean>, action: CheckedItemsAction) => {
      switch (action.type) {
        case 'update':
          return { ...state, [action.key]: action.checked };
        default:
          return state;
      }
    },
    {},
  );

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
        )
      );
    },
    [members, deferredQuery],
  );

  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }

  return (
    <section className="flex flex-col items-stretch gap-2">
      <div className="flex flex-row items-center justify-end gap-2 mb-2">
        <span>{selectedCount}명 선택됨</span>
        <Button
          color="accent"
          type="button"
        >
          그룹에서 제외
        </Button>
      </div>
      <input
        className="min-w-0 bg-transparent border rounded p-1"
        placeholder="검색"
        value={query}
        onChange={handleQueryChange}
      />
      <table className="border">
        <thead>
          <tr className="h-8">
            <th className="border"></th>
            <th className="border">학번</th>
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
