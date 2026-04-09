export type CanvasProfilePair = {
  studentNumber: string;
  major: string;
};

export type CanvasConflicts = {
  emails: string[];
  studentNumbers: string[];
};

export type CanvasPreviewResult = {
  name: string;
  emails: string[];
  profiles: CanvasProfilePair[];
  matchedGroups: Array<{
    groupIdx: number;
    name: { ko: string; en: string };
    reasonKey: 'student_id_cse' | 'course';
    reasonDetail?: string;
  }>;
  conflicts: CanvasConflicts | null;
};

export type CanvasDiff = {
  profiles: { toAdd: CanvasProfilePair[]; existing: CanvasProfilePair[] };
  groups: {
    items: Array<{
      groupIdx: number;
      groupName: { ko: string; en: string };
      reasonKey: 'student_id_cse' | 'course';
      reasonDetail?: string;
      status: 'new' | 'pending' | 'member';
    }>;
  };
};

export type CanvasAction =
  | { type: 'add_student_number'; studentNumber: string }
  | { type: 'add_group'; groupIdx: number };

export async function previewCanvas(canvasToken: string): Promise<CanvasPreviewResult> {
  const resp = await fetch('/canvas/preview', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ canvasToken }),
  });
  if (!resp.ok) {
    const body = await resp.json().catch(() => ({}));
    throw new Error(body?.message ?? '');
  }
  return resp.json();
}

export async function syncCanvas(canvasToken: string): Promise<CanvasDiff> {
  const resp = await fetch('/canvas/sync', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ canvasToken }),
    credentials: 'same-origin',
  });
  if (!resp.ok) {
    const body = await resp.json().catch(() => ({}));
    throw new Error(body?.message ?? '');
  }
  return resp.json();
}

export async function applyCanvas(actions: CanvasAction[]): Promise<void> {
  const resp = await fetch('/canvas/apply', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ actions }),
    credentials: 'same-origin',
  });
  if (!resp.ok) {
    const body = await resp.json().catch(() => ({}));
    throw new Error(body?.message ?? '');
  }
}

export async function canvasSignup(
  canvasToken: string,
  username: string,
  password: string,
  preferredLanguage: string,
): Promise<void> {
  const resp = await fetch('/signup/canvas', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ canvasToken, username, password, preferredLanguage }),
  });
  if (!resp.ok) {
    const body = await resp.json().catch(() => ({}));
    throw new Error(body?.message ?? '');
  }
}
