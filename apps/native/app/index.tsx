import { Redirect } from 'expo-router';
import { useUser } from '../src/lib/user-provider';

export default function Index() {
  const { user } = useUser();
  
  // Si no hay usuario, ir a login
  if (!user) {
    return <Redirect href="/login" />;
  }
  
  // Si hay usuario, redirigir según su rol
  return <Redirect href="/admin" />;
}
