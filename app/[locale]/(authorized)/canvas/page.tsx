import { getDictionary, Locale } from '@/locale';
import CanvasSync from './CanvasSync';

type Props = { params: { locale: Locale } };

export default async function CanvasPage({ params: { locale } }: Props) {
  const dict = await getDictionary(locale);
  return (
    <section className="border rounded p-2">
      <h2 className="text-h2 mb-2">{dict.canvas.title}</h2>
      <CanvasSync />
    </section>
  );
}
