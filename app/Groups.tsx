import Link from 'next/link';

import { listGroups } from './api';
import Button from './Button';

export default async function Groups() {
  const groups = await listGroups();
  const joinedGroups = groups.filter(value => value.joined).map(value => value.name);

  return (
    <section className="border rounded p-2">
      <h2 className="text-xl font-bold mb-2">그룹 관리</h2>
      <p className="text-rose-500 dark:text-rose-400">
        복부전생, 연합전공, 연계전공을 포함한 모든 컴퓨터공학부 구성원은 &lsquo;컴퓨터공학
        전공&rsquo; 그룹에 가입 신청해야 합니다.
      </p>
      <p>
        현재 가입되어 있는 그룹: <strong>{joinedGroups.join(', ')}</strong>
      </p>
      <div className="flex flex-col items-end mt-2">
        <Link className="w-full max-w-[8rem]" href="/group">
          <Button className="w-full font-bold" type="button" color="primary">
            그룹 관리
          </Button>
        </Link>
      </div>
    </section>
  );
}
