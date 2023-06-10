import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: 'primary' | 'accent';
  children?: ReactNode;
};
export default function Button(props: Props) {
  let buttonClasses = 'p-1 transition ';
  if (!props.disabled) {
    buttonClasses += 'hover:bg-black/10 dark:hover:bg-white/10 ';
  } else {
    buttonClasses += 'opacity-50 ';
  }
  switch (props.color) {
    case 'primary':
      buttonClasses += 'text-primary-600 border-primary-600 '
        + 'dark:text-primary-300 dark:border-primary-300 ';
      break;
    case 'accent':
      buttonClasses += 'text-accent-600 border-accent-600 '
        + 'dark:text-accent-300 dark:border-accent-300 ';
      break;
  }

  return <button {...props} className={'border rounded ' + buttonClasses + props.className} />;
}
