import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { listGroups } from '@/api';
import { getDictionary, Locale } from '@/locale';

import GroupItem from './GroupItem';

type Props = {
  params: { locale: Locale };
};

export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  const dict = await getDictionary(locale);
  return {
    title: dict.title.groups,
  };
}

export default async function Group({
  params: { locale },
}: Props) {
  let groups;
  try {
    groups = await listGroups();
  } catch (e) {
    redirect('/signin');
  }

  const dict = await getDictionary(locale);

  return (
    <section className="space-y-2">
      <h2 className="text-h2 text-center">{dict.title.groups}</h2>
      {groups.map(group => <GroupItem key={group.idx} group={group} />)}
    </section>
  );
}
