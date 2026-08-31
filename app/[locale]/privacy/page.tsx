import { Metadata } from 'next';

import { getDictionary, Locale } from '@/locale';

type Props = {
  params: { locale: Locale };
};

export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  const dict = await getDictionary(locale);
  return {
    title: dict.title.privacyPolicy,
  };
}

export default async function PrivacyPolicy({ params: { locale } }: Props) {
  const { privacyPolicy } = await getDictionary(locale);

  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-h2">{privacyPolicy.heading}</h2>
        <p>{privacyPolicy.introduction}</p>
      </header>

      <section className="space-y-2">
        <h3 className="text-h3">{privacyPolicy.detailsHeading}</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-left">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800">
                <th className="border p-2">{privacyPolicy.table.items}</th>
                <th className="border p-2">{privacyPolicy.table.purposes}</th>
                <th className="border p-2">{privacyPolicy.table.retentionPeriod}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">{privacyPolicy.table.itemsValue}</td>
                <td className="border p-2">
                  <ul className="list-disc space-y-1 pl-5">
                    {privacyPolicy.table.purposesValues.map(purpose => (
                      <li key={purpose}>{purpose}</li>
                    ))}
                  </ul>
                </td>
                <td className="border p-2">{privacyPolicy.table.retentionPeriodValue}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-dimmed">※ {privacyPolicy.destructionNotice}</p>
      </section>

      <section className="grid gap-4 rounded border p-4 sm:grid-cols-2">
        <div>
          <h3 className="font-bold">{privacyPolicy.retentionBasisHeading}</h3>
          <p>{privacyPolicy.retentionBasis}</p>
        </div>
        <div>
          <h3 className="font-bold">{privacyPolicy.retentionPeriodHeading}</h3>
          <p>{privacyPolicy.retentionPeriod}</p>
        </div>
      </section>

      <p className="rounded border p-4">※ {privacyPolicy.refusalNotice}</p>
    </article>
  );
}
