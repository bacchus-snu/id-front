/* === ARCHIVED: replaced by Canvas-based student ID management ===
'use client';

import { useState } from 'react';

import Button from '@/components/Button';
import InputField from '@/components/InputField';
import useLocaleDict from '@/components/LocaleDict';
import { useToast } from '@/components/NotificationContext';

enum RequestState {
  Idle,
  Pending,
  Done,
}

export default function StudentIdForm({ studentNumbers }: { studentNumbers: string[] }) {
  const { dict } = useLocaleDict();
  const formDict = dict.studentId;
  const showToast = useToast();

  const [studentNumber, setStudentNumber] = useState('');
  const [studentNumberConfirm, setStudentNumberConfirm] = useState('');
  const [requestState, setRequestState] = useState(RequestState.Idle);

  function handleStudentNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    setStudentNumber(e.target.value);
  }

  function handleStudentNumberConfirmChange(e: React.ChangeEvent<HTMLInputElement>) {
    setStudentNumberConfirm(e.target.value);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (studentNumber !== studentNumberConfirm) {
      showToast({
        type: 'error',
        message: formDict.errorMismatch,
      });
      return;
    }

    try {
      setRequestState(RequestState.Pending);
      const resp = await fetch('/user/student-numbers', {
        method: 'post',
        body: JSON.stringify({ studentNumber }),
        headers: {
          'content-type': 'application/json',
        },
      });

      if (!resp.ok) {
        const body = await resp.json();
        const message = body?.message;
        if (message) {
          showToast({
            type: 'error',
            message,
          });
        }
        return;
      }
    } catch (e) {
      showToast({
        type: 'error',
        message: dict.error.unknown,
      });
      return;
    } finally {
      setRequestState(RequestState.Idle);
    }

    setStudentNumber('');
    setStudentNumberConfirm('');
    setRequestState(RequestState.Done);
    showToast({
      type: 'info',
      message: formDict.successMessage,
    });
  }

  if (requestState === RequestState.Done) {
    return <p>{formDict.successMessage}</p>;
  }

  const contactEmail = 'contact@bacchus.snucse.org';
  const contactNoteParts = formDict.contactNote.split('{email}');

  return (
    <>
      <p>{formDict.description}</p>
      <p>
        {contactNoteParts[0]}
        <a href={`mailto:${contactEmail}`} className="text-sky-600 hover:underline">
          {contactEmail}
        </a>
        {contactNoteParts[1]}
      </p>
      <p className="mt-2">
        {formDict.currentStudentId}
        {studentNumbers.length > 0 ? studentNumbers.join(', ') : '-'}
      </p>
      <form className="flex flex-row flex-wrap justify-end items-end gap-2 mt-2" onSubmit={handleSubmit}>
        <div className="w-full flex-none md:flex-1">
          <InputField
            label={formDict.add}
            labelClassName=""
            type="text"
            required
            pattern="(\d{5}-\d{3}|\d{4}-\d{4,5})"
            placeholder="2026-12345"
            value={studentNumber}
            onChange={handleStudentNumberChange}
          />
        </div>
        <div className="w-full flex-none md:flex-1">
          <InputField
            label={formDict.studentNumberConfirm}
            labelClassName=""
            type="text"
            required
            pattern="(\d{5}-\d{3}|\d{4}-\d{4,5})"
            placeholder="2026-12345"
            value={studentNumberConfirm}
            onChange={handleStudentNumberConfirmChange}
          />
        </div>
        <Button
          className="flex-none w-full max-w-32 font-bold"
          color="primary"
          type="submit"
          disabled={requestState !== RequestState.Idle}
        >
          {formDict.buttonAdd}
        </Button>
      </form>
    </>
  );
}
=== END ARCHIVED === */

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Button from '@/components/Button';
import useLocaleDict from '@/components/LocaleDict';
import { useToast } from '@/components/NotificationContext';

export default function StudentIdForm({ studentNumbers }: { studentNumbers: string[] }) {
  const { dict } = useLocaleDict();
  const d = dict.studentId;
  const showToast = useToast();
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(sn: string) {
    setDeleting(sn);
    try {
      const resp = await fetch('/user/student-numbers', {
        method: 'DELETE',
        body: JSON.stringify({ studentNumber: sn }),
        headers: { 'content-type': 'application/json' },
      });
      if (!resp.ok) {
        showToast({ type: 'error', message: dict.error.unknown });
        return;
      }
      showToast({ type: 'info', message: '학번이 삭제되었습니다.' });
      router.refresh();
    } catch {
      showToast({ type: 'error', message: dict.error.unknown });
    } finally {
      setDeleting(null);
    }
  }

  return (
    <>
      <p>{d.description}</p>
      <p className="mt-2">{d.currentStudentId}</p>
      {studentNumbers.length === 0 ? (
        <p className="text-dimmed">-</p>
      ) : (
        <ul className="mt-1 space-y-1">
          {[...studentNumbers].sort().map(sn => (
            <li key={sn} className="flex items-center gap-2">
              <span className="font-mono">{sn}</span>
              <Button
                color="accent"
                className="text-xs px-2 py-0.5"
                disabled={deleting === sn}
                onClick={() => handleDelete(sn)}
              >
                {d.buttonDelete}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
