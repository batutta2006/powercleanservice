import ServiceCard from "../../components/ServiceCard";
import { SERVICES } from "../../data/services";  // ✅ KORREKT

export default function ServicesPage() {
  return (
    <div className="mt-8">
      <h1 className="text-3xl font-bold mb-6">Unsere Leistungen</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {SERVICES.map((s) => <ServiceCard key={s.slug} s={s} />)}
      </div>
    </div>
  );
}

