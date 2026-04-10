'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import useLocaleDict from '@/components/LocaleDict';
import { useToast } from '@/components/NotificationContext';

const REASON_MAP: Record<string, string> = {
  email_mismatch: 'errorEmailMismatch',
  email_not_snu: 'errorEmailMismatch',
  department_not_found: 'errorDepartmentNotFound',
  department_mismatch: 'errorDepartmentMismatch',
  already_member: 'errorAlreadyMember',
  not_logged_in: 'errorNotLoggedIn',
  invalid_state: 'errorUnknown',
  group_not_found: 'errorUnknown',
};

export default function GoogleResult() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { dict } = useLocaleDict();
  const googleDict = dict.google;
  const showToast = useToast();

  const shown = useRef(false);

  useEffect(() => {
    const google = searchParams.get('google');
    if (!google || shown.current) return;
    shown.current = true;

    if (google === 'success') {
      showToast({ type: 'info', message: googleDict.successMessage });
    } else {
      const reason = searchParams.get('reason') ?? '';
      const key = REASON_MAP[reason] as keyof typeof googleDict | undefined;
      const message = key ? googleDict[key] : googleDict.errorUnknown;
      showToast({ type: 'error', message: message as string });
    }

    // Clean up URL params
    router.replace(window.location.pathname, { scroll: false });
  }, [searchParams, showToast, googleDict, router]);

  return null;
}
