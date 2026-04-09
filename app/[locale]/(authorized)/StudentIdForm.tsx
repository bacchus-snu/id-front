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
  const [confirmTarget, setConfirmTarget] = useState<string | null>(null);
  const [confirmInput, setConfirmInput] = useState('');

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
      showToast({ type: 'info', message: d.deleteSuccess });
      setConfirmTarget(null);
      setConfirmInput('');
      router.refresh();
    } catch {
      showToast({ type: 'error', message: dict.error.unknown });
    } finally {
      setDeleting(null);
    }
  }

  function openConfirm(sn: string) {
    setConfirmTarget(sn);
    setConfirmInput('');
  }

  function closeConfirm() {
    setConfirmTarget(null);
    setConfirmInput('');
  }

  return (
    <>
      <p>{d.description}</p>
      <p className="mt-2">{d.currentStudentId}</p>
      {studentNumbers.length === 0 ? (
        <p className="text-dimmed">-</p>
      ) : (
        <ul className="mt-1 space-y-2">
          {[...studentNumbers].sort().map(sn => (
            <li key={sn}>
              <div className="flex items-center gap-2">
                <span className="font-mono">{sn}</span>
                <Button
                  color="accent"
                  className="text-xs px-2 py-0.5"
                  disabled={deleting !== null}
                  onClick={() => openConfirm(sn)}
                >
                  {d.buttonDelete}
                </Button>
              </div>
              {confirmTarget === sn && (
                <div className="mt-1 ml-4 border border-red-400 rounded p-2 space-y-2">
                  <p className="text-sm text-red-500">
                    {d.deleteConfirmMessage.replace('{}', sn)}
                  </p>
                  <input
                    type="text"
                    className="w-full bg-transparent border rounded p-1 text-sm font-mono"
                    placeholder={sn}
                    value={confirmInput}
                    onChange={e => setConfirmInput(e.target.value)}
                    aria-label={d.deleteConfirmInput}
                  />
                  <p className="text-xs text-dimmed">{d.deleteConfirmInput}</p>
                  <div className="flex gap-2">
                    <Button
                      color="accent"
                      className="text-xs px-2 py-0.5"
                      disabled={confirmInput !== sn || deleting === sn}
                      onClick={() => handleDelete(sn)}
                    >
                      {deleting === sn ? '...' : d.deleteConfirmButton}
                    </Button>
                    <Button
                      className="text-xs px-2 py-0.5"
                      disabled={deleting === sn}
                      onClick={closeConfirm}
                    >
                      {d.deleteCancel}
                    </Button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
