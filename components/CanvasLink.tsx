import { type ReactNode } from 'react';

const CANVAS_URL = 'https://myetl.snu.ac.kr';

export function renderWithCanvasLink(text: string): ReactNode {
  if (!text.includes('{link}')) { return text; }
  const [before, after] = text.split('{link}');
  return (
    <>
      {before}
      <a
        href={CANVAS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sky-600 hover:underline"
      >
        myetl.snu.ac.kr
      </a>
      {after}
    </>
  );
}
