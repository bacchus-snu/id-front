import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { listGroups } from '@/api';

import GroupItem from './GroupItem';

export const metadata: Metadata = {
  title: '그룹 관리',
};

export default async function Group() {
  let groups;
  try {
    groups = await listGroups();
  } catch (e) {
    redirect('/login');
  }

  return (
    <section className="space-y-2">
      <h2 className="text-h2 text-center">그룹 관리</h2>
      {groups.map(group => <GroupItem key={group.idx} group={group} />)}
    </section>
  );
}
