'use client';

import { useEffect } from 'react';

type Props = {
  to: string;
};

export default function ClientRedirect({ to }: Props) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);

  return null;
}
