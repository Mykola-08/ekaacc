import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: "Contacte amb EKA Balance | Elena Kucherova",
  description: "Contacta amb Elena Kucherova per a consultes i reserves. Troba'ns a Barcelona.",
  keywords: ["Contacte", "EKA Balance", "Reserva", "Cita", "Barcelona", "Kinesiologia"],
  openGraph: {
    title: "Contacte amb EKA Balance | Elena Kucherova",
    description: "Reserva la teva sessió o consulta els nostres serveis.",
    type: 'website',
  }
};

export default function ContactPage() {
  redirect('/booking');
}
