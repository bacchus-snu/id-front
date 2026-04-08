import { getDictionary, Locale } from '@/locale';
import CanvasSync from './CanvasSync';

type Props = { params: { locale: Locale } };

export default async function CanvasPage({ params: { locale } }: Props) {
  const dict = await getDictionary(locale);
  return (
    <main className="p-4 max-w-2xl mx-auto">
      <h1 className="text-h1 mb-4">{dict.canvas.title}</h1>
      <CanvasSync />
    </main>
  );
}
