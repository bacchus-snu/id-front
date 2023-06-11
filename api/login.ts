import { mutate } from 'swr';

export function revalidateSession() {
  mutate('/session/check');
}
