'use client';

import { useDeferredValue, useMemo, useState } from 'react';

import { GroupMember } from '@/app/api';

import MemberItem from './MemberItem';

type Props = {
  members: GroupMember[];
};
export default function MemberList(props: Props) {
  const { members } = props;

  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

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

  return (
    <section className="flex flex-col items-stretch gap-2">
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
            />
          ))}
        </tbody>
      </table>
    </section>
  );
}
