import { useRouter } from "next/router";
import Link from "next/link";
import { servicesDetails, titleFromSlug } from "../../data/servicesDetails"; // ✅

export default function ServiceDetail() {
  const { query } = useRouter();
  const slug = String(query.slug || "");
  const detail = servicesDetails.find((s) => s.slug === slug);

  if (!detail) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-2xl font-bold">Leistung nicht gefunden</h1>
        <Link href="/services" className="mt-4 inline-block underline">Zur Übersicht</Link>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="text-sm text-gray-500">
        <Link href="/services" className="hover:text-black">Leistungen</Link> · {detail.title}
      </nav>

      <h1 className="text-3xl md:text-4xl font-extrabold mt-2">{detail.title}</h1>
      <p className="text-gray-600 mt-2">{detail.short}</p>

      <article className="prose prose-neutral max-w-none mt-6">
        <p>{detail.description}</p>
      </article>

      <div className="mt-8 flex gap-3">
        <Link
          href={`/#anfrage?select=${encodeURIComponent(slug)}`}
          className="px-5 py-3 rounded-xl bg-black text-white"
        >
          Anfrage zu „{titleFromSlug(slug)}“
        </Link>
        <Link href="/services" className="px-5 py-3 rounded-xl border">Zur Übersicht</Link>
      </div>
    </main>
  );
}

