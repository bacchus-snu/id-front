import { mutate } from 'swr';

export function revalidateSession() {
  mutate('/api/check-login');
}
