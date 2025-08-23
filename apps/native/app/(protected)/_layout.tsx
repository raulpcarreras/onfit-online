import { Redirect, Slot } from 'expo-router';
import { useUser } from '../../src/lib/user-provider';

export default function ProtectedLayout() {
  const { user, loading } = useUser();

  if (loading) return null;              // o un splash/loader
  if (!user) return <Redirect href="/(public)/login" />;

  return <Slot />;                       // contenido protegido
}
