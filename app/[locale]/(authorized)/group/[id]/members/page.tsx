import { Metadata } from 'next';

import { ForbiddenError, listGroupMembers } from '@/api';

import MemberList from '../MemberList';

export const metadata: Metadata = {
  title: '멤버 목록',
};

type Props = {
  params: {
    id: string;
  };
};
export default async function Members(props: Props) {
  const { id } = props.params;
  let members;
  try {
    members = await listGroupMembers(id);
  } catch (e) {
    if (e instanceof ForbiddenError) {
      return <div className="mt-4">{e.message}</div>;
    }
    throw e;
  }

  return (
    <div className="mt-4">
      <MemberList kind="members" members={members} />
    </div>
  );
}
