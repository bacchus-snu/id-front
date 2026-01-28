'use client';

import { forwardRef, useState } from 'react';

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  labelClassName?: string;
};
export default forwardRef<HTMLInputElement, InputFieldProps>(function InputField(props, ref) {
  const {
    label,
    labelClassName,
    className,
    onInvalid,
    ...inputProps
  } = props;
  const [isInvalid, setInvalid] = useState(false);
  const [message, setMessage] = useState('');
  function handleInvalid(e: React.FormEvent<HTMLInputElement>) {
    setInvalid(true);
    setMessage(e.currentTarget.validationMessage);
    onInvalid?.(e);
  }

  let computedClassName = 'flex-1 bg-transparent border rounded p-1 ';
  if (isInvalid) {
    computedClassName += 'invalid:border-accent-600 dark:invalid:border-accent-300 ';
  }
  if (className != null) {
    computedClassName += className;
  }

  const labelWidthClass = labelClassName ?? 'w-24';

  return (
    <div className="flex flex-col items-stretch gap-1">
      <label className="flex flex-row items-baseline gap-2">
        <span className={`${labelWidthClass} flex-none text-right`}>{label}</span>
        <input
          {...inputProps}
          ref={ref}
          className={computedClassName}
          onInvalid={handleInvalid}
        />
      </label>
      {isInvalid && (
        <div className="flex flex-row gap-2 text-sm text-important">
          <div className={`${labelWidthClass} flex-none`} />
          <span className="flex-1">{message}</span>
        </div>
      )}
    </div>
  );
});
