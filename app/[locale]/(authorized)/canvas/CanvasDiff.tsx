'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import type { CanvasDiff, CanvasAction } from '@/api/canvas';
import { applyCanvas } from '@/api/canvas';
import Button from '@/components/Button';
import useLocaleDict from '@/components/LocaleDict';
import { useToast } from '@/components/NotificationContext';

type Props = {
  diff: CanvasDiff;
  onApplied: () => void;
};

export default function CanvasDiffView({ diff, onApplied }: Props) {
  const { dict } = useLocaleDict();
  const d = dict.canvas;
  const showToast = useToast();
  const locale = (useParams().locale as string) || 'ko';

  const selectableItems = [
    ...(diff.profiles?.toAdd ?? []).map(p => `sn_${p.studentNumber}`),
    ...diff.groups.items.filter(g => g.status === 'new' || g.status === 'pending').map(g => `g_${g.groupIdx}`),
  ];

  const [selected, setSelected] = useState<Set<string>>(() => new Set(selectableItems));
  const [applying, setApplying] = useState(false);

  function toggle(key: string) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  async function handleApply() {
    const actions: CanvasAction[] = [];
    (diff.profiles?.toAdd ?? []).forEach(p => {
      if (selected.has(`sn_${p.studentNumber}`)) actions.push({ type: 'add_student_number', studentNumber: p.studentNumber });
    });
    diff.groups.items.filter(g => g.status === 'new' || g.status === 'pending').forEach(g => {
      if (selected.has(`g_${g.groupIdx}`)) actions.push({ type: 'add_group', groupIdx: g.groupIdx });
    });
    if (actions.length === 0) return;
    setApplying(true);
    try {
      await applyCanvas(actions);
      showToast({ type: 'info', message: d.applySuccess });
      onApplied();
    } catch {
      showToast({ type: 'error', message: dict.error.unknown });
    } finally {
      setApplying(false);
    }
  }

  const groupName = (g: CanvasDiff['groups']['items'][0]) =>
    locale === 'ko' ? g.groupName.ko : g.groupName.en;

  const groupReason = (g: CanvasDiff['groups']['items'][0]) =>
    g.reasonKey === 'student_id_cse'
      ? d.reasonStudentIdCse
      : g.reasonDetail
        ? d.reasonCourseWithTerm.replace('{}', g.reasonDetail)
        : d.reasonCourse;

  // 기존 항목 행 (체크 불가)
  function ExistingRow({ label }: { label: string }) {
    return (
      <div className="flex items-center gap-2 py-1">
        <input type="checkbox" checked disabled className="opacity-50" />
        <span className="text-dimmed text-sm">{label}</span>
      </div>
    );
  }

  // 추가 가능 행 (체크 가능)
  function AddRow({ id, label, tag }: { id: string; label: string; tag?: string }) {
    return (
      <label className="flex items-center gap-2 py-1 cursor-pointer">
        <input type="checkbox" checked={selected.has(id)} onChange={() => toggle(id)} />
        <span className="text-sm">
          {label}
          <span className="text-green-600 text-xs ml-1">[{d.actionAdd}]</span>
          {tag && <span className="text-dimmed text-xs ml-1">({tag})</span>}
        </span>
      </label>
    );
  }

  return (
    <div className="space-y-4">
      {/* 학번 · 주전공 */}
      {((diff.profiles?.existing?.length ?? 0) > 0 || (diff.profiles?.toAdd?.length ?? 0) > 0) && (
        <section>
          <h3 className="text-h3 mb-1">{d.sectionStudentNumbers}</h3>
          {(diff.profiles?.existing ?? []).map(p => (
            <ExistingRow key={p.studentNumber} label={`${p.studentNumber}${p.major ? ` — ${p.major}` : ''}`} />
          ))}
          {(diff.profiles?.toAdd ?? []).map(p => (
            <AddRow key={p.studentNumber} id={`sn_${p.studentNumber}`} label={`${p.studentNumber}${p.major ? ` — ${p.major}` : ''}`} />
          ))}
        </section>
      )}

      {/* 그룹 */}
      {diff.groups.items.length > 0 && (
        <section>
          <h3 className="text-h3 mb-1">{d.sectionGroups}</h3>
          {diff.groups.items.filter(g => g.status === 'member').map(g => (
            <ExistingRow key={g.groupIdx} label={`${groupName(g)} (${d.statusMember})`} />
          ))}
          {diff.groups.items.filter(g => g.status === 'pending').map(g => (
            <AddRow
              key={g.groupIdx}
              id={`g_${g.groupIdx}`}
              label={groupName(g)}
              tag={`${d.statusPending} → ${groupReason(g)}`}
            />
          ))}
          {diff.groups.items.filter(g => g.status === 'new').map(g => (
            <AddRow
              key={g.groupIdx}
              id={`g_${g.groupIdx}`}
              label={groupName(g)}
              tag={groupReason(g)}
            />
          ))}
        </section>
      )}

      {/* 적용 버튼 */}
      {selectableItems.length > 0 ? (
        <Button
          color="primary"
          disabled={applying || selected.size === 0}
          onClick={handleApply}
        >
          {applying ? d.applying : d.buttonApply}
        </Button>
      ) : (
        <p className="text-dimmed">{d.noChanges}</p>
      )}
    </div>
  );
}
