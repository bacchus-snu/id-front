import NavigationTab from './NavigationTab';

type Props = {
  params: {
    id: string;
  };
  children: React.ReactNode;
};
export default function AdminLayout({
  children,
}: Props) {
  return (
    <section>
      <NavigationTab />
      {children}
    </section>
  );
}
