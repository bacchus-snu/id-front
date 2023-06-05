import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: 'primary' | 'accent';
  children?: ReactNode;
};
export default function Button(props: Props) {
  let buttonClasses = 'p-1 transition-colors hover:bg-black/10 dark:hover:bg-white/10 ';
  switch (props.color) {
    case 'primary':
      buttonClasses += 'text-primary-700 border-primary-700 '
        + 'dark:text-primary-300 dark:border-primary-300 ';
      break;
    case 'accent':
      buttonClasses += 'text-accent-700 border-accent-700 '
        + 'dark:text-accent-300 dark:border-accent-300 ';
      break;
  }

  return <button {...props} className={'border rounded ' + buttonClasses + props.className} />;
}
