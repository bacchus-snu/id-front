import { listStudentNumbers } from '@/api';
import { Dict } from '@/locale';

import StudentIdForm from './StudentIdForm';

export default async function StudentId({ dict }: { dict: Dict }) {
  const studentNumbers = await listStudentNumbers();
  return (
    <section className="border rounded p-2">
      <h2 className="text-h2 mb-2">{dict.title.studentId}</h2>
      <StudentIdForm studentNumbers={studentNumbers} />
    </section>
  );
}
