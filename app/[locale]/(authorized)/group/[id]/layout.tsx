import { Metadata } from 'next';

import { listGroups } from '@/api';

import NavigationTab from './NavigationTab';

type Props = {
  params: Promise<{
    id: string;
  }>;
  children: React.ReactNode;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const id = (await props.params).id;
  let groups;
  try {
    groups = await listGroups();
  } catch {
    return {};
  }

  const group = groups.find(group => String(group.idx) === id);
  if (group == null) {
    return {};
  }

  return {
    title: {
      template: `%s - ${group.name} | SNUCSE ID`,
      default: `${group.name} | SNUCSE ID`,
    },
  };
}

export default function AdminLayout({
  children,
}: Props) {
  return (
    <section>
      <NavigationTab />
      {children}
    </section>
  );
}
