'use client';

import { type ReactNode, useState } from 'react';
import type { CanvasDiff } from '@/api/canvas';
import { syncCanvas } from '@/api/canvas';
import Button from '@/components/Button';
import InputField from '@/components/InputField';
import useLocaleDict from '@/components/LocaleDict';
import { useToast } from '@/components/NotificationContext';
import CanvasDiffView from './CanvasDiff';

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

export default function CanvasSync() {
  const { dict } = useLocaleDict();
  const d = dict.canvas;
  const showToast = useToast();

  const [token, setToken] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [diff, setDiff] = useState<CanvasDiff | null>(null);

  async function handleSync() {
    if (!token.trim()) return;
    setSyncing(true);
    setDiff(null);
    try {
      setDiff(await syncCanvas(token.trim()));
    } catch (e) {
      showToast({ type: 'error', message: e instanceof Error ? e.message : d.errorInvalidToken });
    } finally {
      setSyncing(false);
    }
  }

  function handleApplied() {
    setDiff(null);
    setToken('');
  }

  return (
    <div className="space-y-4">
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
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <InputField
            label={d.tokenLabel}
            type="password"
            placeholder={d.tokenPlaceholder}
            value={token}
            onChange={e => setToken(e.target.value)}
            labelClassName=""
          />
        </div>
        <Button
          color="primary"
          disabled={syncing || !token.trim()}
          onClick={handleSync}
          className="flex-none"
        >
          {syncing ? d.syncing : d.buttonSync}
        </Button>
      </div>
      {diff && <CanvasDiffView diff={diff} onApplied={handleApplied} />}
    </div>
  );
}
