'use client';

import { createContext, type ReactNode, useCallback, useContext, useReducer, useRef } from 'react';

export type NotificationSpec = {
  type: 'info' | 'error';
  message: ReactNode;
};
type Notification = {
  id: number;
  type: 'info' | 'error';
  message: ReactNode;
};
type ShowToast = (_: NotificationSpec) => void;

const TOAST_DELAY_MS = 3000;
const Context = createContext<ShowToast>(() => void 0);

type Props = {
  children: ReactNode;
};
type Action =
  | { type: 'push'; notif: Notification }
  | { type: 'dismiss'; id: number };
export default function NotificationProvider(props: Props) {
  const nextId = useRef(0);
  const [notifications, dispatch] = useReducer(
    (state: Notification[], action: Action) => {
      switch (action.type) {
        case 'push': {
          return [...state, action.notif];
        }
        case 'dismiss': {
          return state.filter(noti => noti.id !== action.id);
        }
        default:
          return state;
      }
    },
    [],
  );
  const handleShowToast = useCallback(
    (spec: NotificationSpec) => {
      const id = nextId.current;
      nextId.current += 1;

      const notif = { id, ...spec };
      dispatch({ type: 'push', notif });
      window.setTimeout(() => {
        dispatch({ type: 'dismiss', id });
      }, TOAST_DELAY_MS);
    },
    [],
  );
  const dismissToast = useCallback(
    (id: number) => {
      dispatch({ type: 'dismiss', id });
    },
    [],
  );

  return (
    <Context.Provider value={handleShowToast}>
      {props.children}
      <Notifications notifications={notifications} onDismiss={dismissToast} />
    </Context.Provider>
  );
}

export function useToast(): ShowToast {
  return useContext(Context);
}

function Notifications(props: { notifications: Notification[]; onDismiss?(id: number): void }) {
  const { notifications, onDismiss } = props;
  return (
    <ul className="absolute bottom-8 lg:bottom-auto lg:top-24 right-4 flex flex-col lg:flex-col-reverse gap-4">
      {notifications.map(noti => (
        <Toast
          key={noti.id}
          type={noti.type}
          onDismiss={() => onDismiss?.(noti.id)}
        >
          {noti.message}
        </Toast>
      ))}
    </ul>
  );
}

function Toast(props: { type: 'info' | 'error'; onDismiss?(): void; children?: ReactNode }) {
  const { type, children } = props;

  let className = 'w-72 md:w-96 bg-slate-50 dark:bg-slate-900 '
    + 'border rounded shadow-md dark:shadow-white/10 p-4 ';
  if (type === 'info') {
    className += 'border-black/10 dark:border-white/10 ';
  } else {
    className += 'border-accent-600/20 dark:border-accent-300/20 ';
  }

  return (
    <li className={className}>
      {children}
    </li>
  );
}
