'use client';

import type { Group } from '../api';

type Props = {
  group: Group;
};
export default function GroupItem(props: Props) {
  const { group } = props;

  let joinState = null;
  if (group.joined) {
    joinState = <div>가입됨</div>;
  } else if (group.pending) {
    joinState = <div>승인 대기 중</div>;
  }

  return (
    <div className="border rounded p-2">
      <div className="flex flex-row items-baseline justify-between">
        <h3 className="text-lg font-bold">{group.name}</h3>
        {joinState}
      </div>
      <p className="opacity-50">
        {group.description}
      </p>
    </div>
  );
}
