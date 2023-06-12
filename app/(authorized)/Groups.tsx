import Link from 'next/link';
import { Suspense } from 'react';

import { Group, listGroups } from '@/api';
import Button from '@/components/Button';

export default function Groups() {
  const groupPromise = listGroups();
  return (
    <section className="border rounded p-2">
      <h2 className="text-h2 mb-2">그룹 관리</h2>
      <p className="text-important">
        복부전생, 연합전공, 연계전공을 포함한 모든 컴퓨터공학부 구성원은 &lsquo;컴퓨터공학
        전공&rsquo; 그룹에 가입 신청해야 합니다.
      </p>
      <p>
        현재 가입되어 있는 그룹:{' '}
        <Suspense fallback={<JoinedGroupList />}>
          <JoinedGroupList groups={groupPromise} />
        </Suspense>
      </p>
      <div className="flex flex-col items-end mt-2">
        <Link className="flex-0 w-32" href="/group">
          <Button className="w-full font-bold" type="button" color="primary">
            그룹 관리
          </Button>
        </Link>
      </div>
    </section>
  );
}

async function JoinedGroupList(props: { groups?: Promise<Group[]> }) {
  const groups = await props.groups;
  if (groups == null) {
    return '(불러오는 중)';
  }

  const joinedGroups = groups.filter(value => value.joined).map(value => value.name);
  if (joinedGroups.length === 0) {
    return '없음';
  }

  return <strong>{joinedGroups.join(', ')}</strong>;
}
