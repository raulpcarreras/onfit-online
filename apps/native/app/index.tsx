// Ruta raíz. Nada de objetos ni "plugins" aquí.
import { Redirect } from "expo-router";

export default function Index() {
  // Llévate a tu stack/tab principal; ajústalo a tu estructura
  return <Redirect href="/admin" />;
}
