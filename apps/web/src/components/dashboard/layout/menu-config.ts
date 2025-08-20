import {
  Menu,
  Users,
  Euro,
  Settings,
  Home,
  Dumbbell,
  Utensils,
  Calendar,
  TrendingUp,
  CheckCircle2,
  MessageSquare,
  CreditCard,
  HelpCircle
} from "lucide-react";

// Menú del admin - EXACTAMENTE como estaba
export const adminMenuItems = [
  { label: "Dashboard", icon: Menu },
  { label: "Usuarios", icon: Users },
  { label: "Pagos", icon: Euro },
  { label: "Ajustes", icon: Settings },
];

// Menú del usuario - EXACTAMENTE como estaba
export const userMenuItems = [
  { label: "Inicio (Hoy)", icon: Home, href: "/user" },
  { label: "Entrenamiento", icon: Dumbbell, href: "/training" },
  { label: "Nutrición", icon: Utensils, href: "/user/nutrition" },
  { label: "Calendario", icon: Calendar, href: "/user/calendar" },
  { label: "Progreso", icon: TrendingUp, href: "/user/progress" },
  { label: "Hábitos", icon: CheckCircle2, href: "/user/habits" },
  { label: "Mensajes", icon: MessageSquare, href: "/user/messages" },
  { label: "Pagos", icon: CreditCard, href: "/user/payments" },
  { label: "Ajustes", icon: Settings, href: "/user/settings" },
  { label: "Ayuda", icon: HelpCircle, href: "/user/help" },
];
