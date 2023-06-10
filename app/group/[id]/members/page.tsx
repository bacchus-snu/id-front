import { ForbiddenError, listGroupMembers } from '@/app/api';
import MemberList from './MemberList';

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
      return (
        <section className="mt-4">
          <div>{e.message}</div>
        </section>
      );
    }
    throw e;
  }

  return (
    <section className="mt-4">
      <MemberList members={members} />
    </section>
  );
}
