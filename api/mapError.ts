import { ZodIssue } from 'zod';

import { Dict } from '@/locale';

export default function mapError(error: ZodIssue, dict: Dict): ZodIssue {
  return {
    ...error,
    message: dict.validity[error.message] ?? error.message,
  };
}
