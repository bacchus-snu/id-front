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
    joinState = <div className="text-dimmed">가입됨</div>;
    joinButton = <Button className="flex-0 w-24" color="accent">탈퇴</Button>;
  } else if (group.pending) {
    joinState = <div className="text-dimmed">승인 대기 중</div>;
    joinButton = <Button className="flex-0 w-24" disabled>대기 중</Button>;
  } else {
    joinButton = <Button className="flex-0 w-24">신청</Button>;
  }

  return (
    <div className="border rounded p-2">
      <div className="flex flex-row items-baseline justify-between">
        <h3 className="text-h3">{group.name}</h3>
        {joinState}
      </div>
      <p className="text-dimmed">
        {group.description}
      </p>
      <div className="flex flex-row-reverse gap-2 mt-2">
        {joinButton}
        {group.owner && (
          <Link className="flex-0 w-24" href={`/group/${group.idx}/admin`}>
            <Button className="w-full">관리</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
