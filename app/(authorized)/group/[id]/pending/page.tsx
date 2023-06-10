import { ForbiddenError, listPendingGroupMembers } from '@/api';

import MemberList from '../MemberList';

type Props = {
  params: {
    id: string;
  };
};
export default async function Pending(props: Props) {
  const { id } = props.params;
  let members;
  try {
    members = await listPendingGroupMembers(id);
  } catch (e) {
    if (e instanceof ForbiddenError) {
      return <div className="mt-4">{e.message}</div>;
    }
    throw e;
  }

  return (
    <div className="mt-4">
      <MemberList kind="pending" members={members} />
    </div>
  );
}
