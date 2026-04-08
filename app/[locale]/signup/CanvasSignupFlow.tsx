'use client';

import { useParams, useRouter } from 'next/navigation';
import { type ReactNode, useRef, useState } from 'react';

import { previewCanvas, canvasSignup, type CanvasPreviewResult } from '@/api/canvas';
import Button from '@/components/Button';
import InputField from '@/components/InputField';
import useLocaleDict from '@/components/LocaleDict';
import { useToast } from '@/components/NotificationContext';

const CANVAS_URL = 'https://myetl.snu.ac.kr';

function renderWithLink(text: string): ReactNode {
  if (!text.includes('{link}')) return text;
  const [before, after] = text.split('{link}');
  return (
    <>
      {before}
      <a href={CANVAS_URL} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">
        myetl.snu.ac.kr
      </a>
      {after}
    </>
  );
}

export default function CanvasSignupFlow() {
  const { dict } = useLocaleDict();
  const d = dict.canvas;
  const showToast = useToast();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<CanvasPreviewResult | null>(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);

  async function handlePreview() {
    if (!token.trim()) return;
    setLoading(true);
    try {
      setPreview(await previewCanvas(token.trim()));
    } catch (e) {
      showToast({ type: 'error', message: e instanceof Error ? e.message : d.errorInvalidToken });
    } finally {
      setLoading(false);
    }
  }

  function handleChangePassword(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
    if (e.target.value !== passwordConfirm) {
      passwordConfirmRef.current?.setCustomValidity(dict.validity.passwordConfirmMismatch);
    } else {
      passwordConfirmRef.current?.setCustomValidity('');
    }
  }

  function handleChangePasswordConfirm(e: React.ChangeEvent<HTMLInputElement>) {
    setPasswordConfirm(e.target.value);
    if (password !== e.target.value) {
      e.target.setCustomValidity(dict.validity.passwordConfirmMismatch);
    } else {
      e.target.setCustomValidity('');
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await canvasSignup(token.trim(), username, password, locale);
      router.push(`/${locale}/signup/done`);
    } catch (e) {
      showToast({ type: 'error', message: e instanceof Error ? e.message : dict.error.userCreationFailed });
    } finally {
      setSubmitting(false);
    }
  }

  // Step 1: Token input
  if (!preview) {
    return (
      <section className="border rounded p-2 space-y-3">
        <p>{renderWithLink(d.description)}</p>
        <details>
          <summary className="cursor-pointer text-sky-600 hover:underline text-sm">
            {d.howToGetToken}
          </summary>
          <ol className="text-sm text-dimmed mt-1 list-decimal pl-4 space-y-1">
            {d.howToGetTokenSteps.map((step: string, i: number) => (
              <li key={i}>{renderWithLink(step)}</li>
            ))}
          </ol>
        </details>
        <InputField
          label={d.tokenLabel}
          type="password"
          placeholder={d.tokenPlaceholder}
          value={token}
          onChange={e => setToken(e.target.value)}
        />
        <Button
          color="primary"
          disabled={loading || !token.trim()}
          onClick={handlePreview}
          className="w-full"
        >
          {loading ? d.syncing : dict.signUp.form.signUpButton}
        </Button>
      </section>
    );
  }

  // Step 2: Preview + signup form
  const groupName = (g: CanvasPreviewResult['matchedGroups'][0]) =>
    locale === 'ko' ? g.name.ko : g.name.en;

  return (
    <section className="border rounded p-2">
      <form onSubmit={handleSignup} className="flex flex-col gap-3">
        <div className="space-y-2 border rounded p-2">
          <p className="text-sm font-bold">{d.signupPreview}</p>
          <div className="text-sm">
            <span className="text-dimmed">{d.signupPreviewName}:</span> {preview.name}
          </div>
          <div className="text-sm">
            <span className="text-dimmed">{d.signupPreviewEmail}:</span> {preview.emails.join(', ') || '-'}
          </div>
          <div className="text-sm">
            <span className="text-dimmed">{d.signupPreviewStudentNumbers}:</span>
          </div>
          {preview.profiles.length > 0 ? (
            <ul className="text-sm list-disc pl-8">
              {preview.profiles.map(p => (
                <li key={p.studentNumber}>{p.studentNumber}{p.major && ` — ${p.major}`}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm pl-6 text-dimmed">-</p>
          )}
          {preview.matchedGroups.length > 0 ? (
            <div className="text-sm">
              <span className="text-dimmed">{d.signupPreviewGroups}:</span>
              <ul className="list-disc pl-4 mt-1">
                {preview.matchedGroups.map(g => {
                  const name = groupName(g);
                  const reason = g.reasonKey === 'student_id_cse'
                    ? d.reasonStudentIdCse
                    : g.reasonDetail
                      ? d.reasonCourseWithTerm.replace('{}', g.reasonDetail)
                      : d.reasonCourse;
                  return (
                    <li key={g.groupIdx}>
                      {name} <span className="text-dimmed">({reason})</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-dimmed">{d.signupNoGroups}</p>
          )}
        </div>

        <hr />

        <InputField
          label={dict.signUp.form.fields.username}
          required
          pattern="[a-z][a-z0-9]*"
          autoComplete="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <InputField
          label={dict.signUp.form.fields.password}
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={handleChangePassword}
        />
        <InputField
          ref={passwordConfirmRef}
          label={dict.signUp.form.fields.passwordConfirm}
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={passwordConfirm}
          onChange={handleChangePasswordConfirm}
        />
        <Button
          type="submit"
          color="primary"
          disabled={submitting}
          className="w-full font-bold"
        >
          {dict.signUp.form.signUpButton}
        </Button>
      </form>
    </section>
  );
}
