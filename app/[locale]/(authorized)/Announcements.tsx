import { Announcement, listAnnouncements } from '@/api';
import { Dict } from '@/locale';

export default async function Announcements({ dict }: { dict: Dict }) {
  let announcements: Announcement[];
  try {
    announcements = await listAnnouncements();
  } catch (e) {
    return null;
  }

  return announcements.map(announcement => (
    <section
      key={announcement.idx}
      className="border-2 rounded p-2 border-primary-600 dark:border-primary-300"
    >
      <h2 className="text-h2 mb-2">{announcement.title}</h2>
      <p>{announcement.body}</p>
      {announcement.url && (
        <div className="flex flex-col items-end mt-2">
          <a
            className="w-full max-w-32 p-1 text-center font-bold border rounded transition hover:bg-black/10 dark:hover:bg-white/10 text-primary-600 border-primary-600 dark:text-primary-300 dark:border-primary-300"
            href={announcement.url}
            target="_blank"
            rel="noreferrer"
          >
            {dict.announcements.open}
          </a>
        </div>
      )}
    </section>
  ));
}
