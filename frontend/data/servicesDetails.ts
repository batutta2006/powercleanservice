// frontend/data/servicesDetails.ts
import { SERVICES } from "./services";

type Detail = {
  slug: string;
  title: string;
  short: string;
  description: string;
};

export const servicesDetails: Detail[] = [
  {
    slug: "baureinigung",
    title: "Baureinigung",
    short: "Grob-, Zwischen- & Endreinigung für Neubau, Umbau und Renovierung.",
    description:
      "Unsere Baureinigung sorgt dafür, dass jede Baustelle termingerecht und in perfektem Zustand übergeben werden kann. Wir übernehmen die Grob-, Zwischen- und Endreinigung und entfernen zuverlässig Staub, Schutt, Schutzfolien und Verschmutzungen aller Art. Durch gründliche Reinigung schaffen wir ein sauberes Arbeitsumfeld und die Basis für eine erfolgreiche Abnahme. Ob Neubau, Umbau oder Renovierung – wir passen die Leistungen an Ihr Projekt an. Moderne Geräte, geschultes Personal und ein hoher Qualitätsanspruch garantieren Ergebnisse, die höchsten Anforderungen gerecht werden.",
  },
  {
    slug: "industriereinigung",
    title: "Industriereinigung",
    short: "Saubere Maschinen, Anlagen und Produktionsflächen – sicher & effizient.",
    description:
      "Eine saubere Produktionsumgebung ist entscheidend für Qualität, Sicherheit und Effizienz. Unsere Industriereinigung umfasst Maschinen, Anlagen, Produktionsflächen sowie sensible Bereiche. Wir arbeiten nach strengen Hygienestandards und setzen moderne, umweltfreundliche Verfahren ein. Regelmäßige Reinigung minimiert Ausfallzeiten, verlängert die Lebensdauer Ihrer Anlagen und sorgt für ein sicheres Arbeitsumfeld. Ob punktuelle Intensivreinigung oder planmäßige Wartung – wir entwickeln ein maßgeschneidertes Konzept passend zu Ihrem Betrieb.",
  },
  {
    slug: "fassadenreinigung",
    title: "Fassadenreinigung",
    short: "Schonende Reinigung für Putz, Glas, Metall oder Naturstein.",
    description:
      "Die Fassade ist die Visitenkarte eines Gebäudes. Mit professioneller Fassadenreinigung entfernen wir Schmutz, Algen und Moose von allen gängigen Materialien – schonend und wirkungsvoll. Unsere Verfahren erhalten die Bausubstanz und sorgen für ein repräsentatives Erscheinungsbild. Regelmäßige Pflege schützt vor Wertverlust und steigert die Attraktivität. Ob Wohnhaus, Bürogebäude oder Industriehalle – wir haben die passende Methode für Ihr Objekt.",
  },
  {
    slug: "glasreinigung",
    title: "Fenster- & Glasreinigung",
    short: "Streifenfreier Glanz – innen, außen, Fassaden, Wintergärten.",
    description:
      "Glasklare Ergebnisse für Fenster, Glasfassaden, Wintergärten, Schaufenster und Glasdächer. Mit professionellen Techniken und sicherer Ausrüstung reinigen wir auch schwer zugängliche Flächen rückstandsfrei. Ob regelmäßige Unterhaltsreinigung oder einmalige Grundreinigung – wir richten uns nach Ihren Wünschen. Mehr Licht und klare Sicht steigern die Wirkung Ihrer Immobilie und das Wohlbefinden im Innenraum.",
  },
  {
    slug: "unterhaltsreinigung",
    title: "Unterhaltsreinigung",
    short: "Regelmäßige Sauberkeit für Büro, Praxis, öffentliche Einrichtungen.",
    description:
      "Die Unterhaltsreinigung ist die Basis für gepflegte Räume. Wir reinigen zuverlässig Böden, Oberflächen, Sanitär- und Küchenbereiche – in individuell vereinbarten Intervallen. Diskret, gründlich und planbar sorgen wir dafür, dass Ihre Räumlichkeiten jederzeit einen professionellen Eindruck machen. Sauberkeit steigert Wohlbefinden und erhält Werte.",
  },
  {
    slug: "bueroreinigung",
    title: "Büroreinigung",
    short: "Arbeitsplätze, Konferenzräume, Küchen & Sanitär – flexibel & gründlich.",
    description:
      "Ein sauberes Büro motiviert Mitarbeiter und überzeugt Kunden. Wir reinigen Arbeitsplätze, Meetingräume, Küchen und Sanitärbereiche – auf Wunsch außerhalb Ihrer Geschäftszeiten. Umweltfreundliche Mittel, geschulte Teams und klare Abläufe sorgen für Hygiene und ein angenehmes Umfeld. Für kleine Büros bis große Objekte erstellen wir ein passendes Konzept.",
  },
  {
    slug: "facility-management",
    title: "Facility Management",
    short: "Ganzheitliche Betreuung von Reinigung bis Instandhaltung.",
    description:
      "Unser Facility Management bündelt Dienstleistungen rund um Ihre Immobilie: technische Kontrollen, kleine Reparaturen, Pflege der Außenanlagen, Sicherheitschecks und mehr. Mit einem ganzheitlichen Ansatz sorgen wir für reibungslose Abläufe, Effizienz und Werterhalt. Ein fester Ansprechpartner koordiniert alles aus einer Hand.",
  },
  {
    slug: "hausmeisterdienste",
    title: "Hausmeisterdienste",
    short: "Regelmäßige Objektkontrollen, kleine Reparaturen, Außenpflege.",
    description:
      "Unsere Hausmeisterdienste sichern den Betrieb und die gepflegte Erscheinung Ihrer Immobilie. Wir kontrollieren Technik, übernehmen kleinere Reparaturen, koordinieren Handwerker und pflegen Außenbereiche. Mit festen Rundgängen und schnellen Reaktionszeiten sind wir bei Bedarf umgehend vor Ort – zuverlässig, kompetent, engagiert.",
  },
  {
    slug: "graffitientfernung",
    title: "Graffitientfernung",
    short: "Schonende Verfahren, auf Wunsch inkl. Schutzbeschichtung.",
    description:
      "Unerwünschte Graffitis mindern den Eindruck und den Wert. Wir entfernen Farbverunreinigungen gründlich und materialschonend – je nach Untergrund. Spezielle Verfahren lösen Farbe ohne die Oberfläche zu beschädigen. Optional schützen wir Flächen mit Beschichtungen, damit künftige Reinigungen schneller gelingen.",
  },
  {
    slug: "eventreinigung",
    title: "Eventmanagement (Reinigung)",
    short: "Vor, während und nach dem Event – sauber & organisiert.",
    description:
      "Für Konzerte, Messen, Firmenfeiern oder Sportevents übernehmen wir die Reinigung vor, während und nach der Veranstaltung. Wir kümmern uns um Abfallentsorgung, Sanitärpflege und saubere Flächen – diskret im Hintergrund. Nach dem Event sorgen wir für eine gründliche Endreinigung. So läuft alles reibungslos.",
  },
  {
    slug: "aussenflaechen",
    title: "Grün- & Außenflächenpflege",
    short: "Rasen, Sträucher, Bäume – plus Wege- & Parkplatzreinigung.",
    description:
      "Gepflegte Außenanlagen sind die Visitenkarte Ihrer Immobilie. Wir übernehmen Rasenpflege, Schnittarbeiten, Unkrautentfernung und Bewässerung. Außerdem reinigen wir Wege und Parkplätze von Laub und Unrat. Mit modernem Equipment und festen Intervallen wirken Ihre Außenbereiche dauerhaft einladend.",
  },
  {
    slug: "fahrzeugreinigung",
    title: "Fahrzeugreinigung (Abhol- & Bringservice)",
    short: "Komfort-Service: Abholung, Reinigung innen/außen, Rücklieferung.",
    description:
      "Wir holen Ihr Fahrzeug ab, reinigen es gründlich innen und außen und liefern es im Top-Zustand zurück. Handwäsche, Lackpflege, Polster- und Teppichreinigung, Pflege von Leder und Kunststoffen sowie Felgen- und Motorraumreinigung – ideal für Privatkunden, Unternehmen und Fuhrparks.",
  },
  {
    slug: "pv-dachreinigung",
    title: "Dach- & Photovoltaikreinigung",
    short: "Schonend gereinigt – für Schutz & maximale PV-Leistung.",
    description:
      "Saubere Dächer schützen die Substanz, saubere PV-Module liefern mehr Ertrag. Wir entfernen Schmutz, Moos und Algen mit geeigneten Verfahren, die Material und Module schonen. So sichern Sie die Leistungsfähigkeit der Anlage und verlängern die Lebensdauer von Dach und PV-System.",
  },
  {
    slug: "baustellenueberwachung",
    title: "Baustellenüberwachung",
    short: "Sicherheit, Koordination und Qualitätskontrolle auf der Baustelle.",
    description:
      "Damit Ihr Bauvorhaben reibungslos verläuft, übernehmen wir die Baustellenüberwachung: Sicherheitsvorschriften prüfen, Abläufe koordinieren, Qualität sichern und die Baustelle vor Vandalismus oder unbefugtem Zutritt schützen. Mit geschultem Personal minimieren Sie Risiken, Verzögerungen und Folgekosten.",
  },
];

// Hilfsfunktion: Titel zum Slug (falls du nur SERVICES importierst)
export const titleFromSlug = (slug: string) =>
  (SERVICES as readonly { slug: string; title: string }[]).find(s => s.slug === slug)?.title || slug;
