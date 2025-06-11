import { useRouter } from 'next/router';

export default function BookClubSettingsPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>Paramètres du club {id}</h1>
      <p>Ici, tu peux modifier les paramètres du bookclub.</p>
    </div>
  );
}