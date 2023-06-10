'use client';

import { GroupMember } from '@/app/api';

type Props = GroupMember & {
  checked?: boolean;
  onChange?(checked: boolean): void;
};
export default function MemberItem(props: Props) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    props.onChange?.(e.target.checked);
  }

  return (
    <tr className="h-8 hover:bg-black/10 dark:hover:bg-white/10">
      <td className="h-full border-r">
        <label className="cursor-pointer h-full flex items-center justify-center px-2">
          <input
            type="checkbox"
            checked={props.checked}
            onChange={handleChange}
          />
        </label>
      </td>
      <td className="text-right tabular-nums px-2 border-r">{props.studentNumber}</td>
      <td className="px-2 border-r">{props.name}</td>
    </tr>
  );
}
