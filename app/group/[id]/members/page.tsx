import { ForbiddenError, listGroupMembers } from '@/app/api';

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
      <ul>
        {members.map(member => (
          <li key={member.uid}>{member.studentNumber} {member.name}</li>
        ))}
      </ul>
    </section>
  );
}
