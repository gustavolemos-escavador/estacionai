import PageHeader from "@/components/PageHeader";
import InboxList from "@/components/InboxList";
import Reveal from "@/components/Reveal";
import { mockNotifications } from "@/lib/mockData";

export default function InboxPage() {
  return (
    <>
      <PageHeader
        eyebrow="Notificações"
        title="Caixa de entrada"
        description="Todos os eventos relevantes do seu estacionamento em um único lugar: liberações, reservas, alertas e relatórios prontos."
      />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 pb-12">
        <Reveal>
          <InboxList initial={mockNotifications} />
        </Reveal>
      </div>
    </>
  );
}
