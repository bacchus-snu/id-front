'use client';

import Link from 'next/link';

import type { Group } from '../api';
import Button from '../Button';

type Props = {
  group: Group;
};
export default function GroupItem(props: Props) {
  const { group } = props;

  let joinState = null;
  let joinButton = null;
  if (group.joined) {
    joinState = <div>가입됨</div>;
    joinButton = <Button className="flex-1 max-w-[6rem]" color="accent">탈퇴</Button>;
  } else if (group.pending) {
    joinState = <div>승인 대기 중</div>;
    joinButton = <Button className="flex-1 max-w-[6rem]" disabled>대기 중</Button>;
  } else {
    joinButton = <Button className="flex-1 max-w-[6rem]">신청</Button>;
  }

  return (
    <div className="border rounded p-2">
      <div className="flex flex-row items-baseline justify-between">
        <h3 className="text-lg font-bold">{group.name}</h3>
        {joinState}
      </div>
      <p className="text-black/50 dark:text-white/75">
        {group.description}
      </p>
      <div className="flex flex-row-reverse gap-2 mt-2">
        {joinButton}
        {group.owner && (
          <Link className="flex-1 max-w-[6rem]" href={`/group/${group.idx}/admin`}>
            <Button className="w-full">관리</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
