import Link from 'next/link';
import { Suspense } from 'react';

import { Group, listGroups } from '@/api';
import Button from '@/components/Button';
import { Dict } from '@/locale';

export default function Groups({ dict }: { dict: Dict }) {
  const groupPromise = listGroups();
  return (
    <section className="border rounded p-2">
      <h2 className="text-h2 mb-2">{dict.title.groups}</h2>
      <p>
        {dict.groups.joinedGroups}
        <Suspense fallback={<JoinedGroupList dict={dict} />}>
          <JoinedGroupList dict={dict} groups={groupPromise} />
        </Suspense>
      </p>
      <div className="flex flex-col items-end mt-2">
        <Link className="flex-0 w-32" href="/group">
          <Button className="w-full font-bold" type="button" color="primary">
            {dict.groups.buttonGroupList}
          </Button>
        </Link>
      </div>
    </section>
  );
}

async function JoinedGroupList(props: { dict: Dict; groups?: Promise<Group[]> }) {
  const groups = await props.groups;
  if (groups == null) {
    return props.dict.groups.groupLoading;
  }

  const joinedGroups = groups.filter(value => value.joined).map(value => value.name);
  if (joinedGroups.length === 0) {
    return props.dict.groups.groupNone;
  }

  return <strong>{joinedGroups.join(', ')}</strong>;
}
