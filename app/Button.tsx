import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: 'primary' | 'accent';
  children?: ReactNode;
};
export default function Button(props: Props) {
  let buttonClasses = 'p-1 transition-colors hover:bg-black/10 dark:hover:bg-white/10 ';
  switch (props.color) {
    case 'primary':
      buttonClasses += 'text-sky-700 border-sky-700 dark:text-sky-300 dark:border-sky-300 ';
      break;
    case 'accent':
      buttonClasses += 'text-rose-700 border-rose-700 dark:text-rose-300 dark:border-rose-300 ';
      break;
  }

  return <button {...props} className={'border rounded ' + buttonClasses + props.className} />;
}
