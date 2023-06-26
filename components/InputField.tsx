'use client';

import { useState } from 'react';

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};
export default function InputField(props: InputFieldProps) {
  const {
    label,
    className,
    onInvalid,
    ...inputProps
  } = props;
  const [isInvalid, setInvalid] = useState(false);
  function handleInvalid(e: React.FormEvent<HTMLInputElement>) {
    setInvalid(true);
    onInvalid?.(e);
  }

  let computedClassName = 'flex-1 bg-transparent border rounded p-1 ';
  if (isInvalid) {
    computedClassName += 'invalid:border-accent-600 dark:invalid:border-accent-300 ';
  }
  if (className != null) {
    computedClassName += className;
  }

  return (
    <label className="flex flex-row items-baseline gap-2">
      <span className="w-24 flex-none text-right">{label}</span>
      <input
        {...inputProps}
        className={computedClassName}
        onInvalid={handleInvalid}
      />
    </label>
  );
}
