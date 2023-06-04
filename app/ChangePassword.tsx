import { listUserEmails } from './api';
import ChangePasswordForm from './ChangePasswordForm';

export default async function ChangePassword() {
  const emails = await listUserEmails();
  return (
    <section className="border rounded p-2">
      <h2 className="text-xl font-bold mb-2">비밀번호 변경</h2>
      <p>
        비밀번호 변경 안내를 받을 이메일을 선택해 주세요.
      </p>
      <ChangePasswordForm emails={emails} />
    </section>
  );
}
