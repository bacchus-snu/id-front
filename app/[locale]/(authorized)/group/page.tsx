import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { Announcement, listAnnouncements, listGroups } from '@/api';
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

  // groups promoted by a current announcement come first
  let promotions: Announcement[] = [];
  try {
    promotions = (await listAnnouncements()).filter(a => a.groupIdx != null);
  } catch (e) {
    // the list is still usable without them
  }
  const promoted = new Map(promotions.map(a => [a.groupIdx, a]));
  const ordered = [
    ...groups.filter(g => promoted.has(g.idx)),
    ...groups.filter(g => !promoted.has(g.idx)),
  ];

  const dict = await getDictionary(locale);

  return (
    <section className="space-y-2">
      <h2 className="text-h2 text-center">{dict.title.groups}</h2>
      {ordered.map(group => (
        <GroupItem key={group.idx} group={group} promotion={promoted.get(group.idx)} />
      ))}
    </section>
  );
}
