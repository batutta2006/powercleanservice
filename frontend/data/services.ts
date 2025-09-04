// frontend/data/services.ts
export type Service = {
  slug: string;
  title: string;
  excerpt: string;
  details: string;
  image: string;
};

export const SERVICES: Service[] = [
  {
    slug: "baureinigung",
    title: "Baureinigung",
    excerpt: "Grob-, Zwischen- & Endreinigung auf der Baustelle.",
    details:
      "Unsere Baureinigung sorgt dafür, dass jede Baustelle termingerecht und in perfektem Zustand übergeben werden kann. Wir übernehmen die Grob-, Zwischen- und Endreinigung ... (gekürzt)",
    image: "/images/services/baureinigung.jpg"
  },
  {
    slug: "industriereinigung",
    title: "Industriereinigung",
    excerpt: "Maschinen, Anlagen & Produktionsflächen.",
    details:
      "Eine saubere Produktionsumgebung ist entscheidend für Qualität, Sicherheit und Effizienz ... (gekürzt)",
    image: "/images/services/industriereinigung.jpg"
  },
  {
    slug: "fassadenreinigung",
    title: "Fassadenreinigung",
    excerpt: "Schonend & wirkungsvoll für alle Materialien.",
    details:
      "Die Fassade ist die Visitenkarte eines Gebäudes. Mit unserer professionellen Fassadenreinigung ... (gekürzt)",
    image: "/images/services/fassadenreinigung.jpg"
  },
  {
    slug: "glasreinigung",
    title: "Fenster- & Glasreinigung",
    excerpt: "Streifenfrei – innen & außen.",
    details:
      "Streifenfreie Fenster und glänzende Glasflächen sind ein wichtiger Bestandteil gepflegter Immobilien ... (gekürzt)",
    image: "/images/services/glasreinigung.jpg"
  },
  {
    slug: "unterhaltsreinigung",
    title: "Unterhaltsreinigung",
    excerpt: "Regelmäßige Sauberkeit für Büro, Praxis & Objekt.",
    details:
      "Die regelmäßige Unterhaltsreinigung ist die Basis für saubere und gepflegte Räume ... (gekürzt)",
    image: "/images/services/unterhaltsreinigung.jpg"
  },
  {
    slug: "bueroreinigung",
    title: "Büroreinigung",
    excerpt: "Hygiene & Ordnung im Büroalltag.",
    details:
      "Ein sauberes Büro ist entscheidend für die Motivation der Mitarbeiter ... (gekürzt)",
    image: "/images/services/bueroreinigung.jpg"
  },
  {
    slug: "facility-management",
    title: "Facility Management",
    excerpt: "Rundumpaket für Ihre Immobilie.",
    details:
      "Unser Facility Management geht weit über klassische Reinigungsdienste hinaus ... (gekürzt)",
    image: "/images/services/facility-management.jpg"
  },
  {
    slug: "hausmeisterdienste",
    title: "Hausmeisterdienste",
    excerpt: "Kontrolle, kleine Reparaturen & Außenanlagen.",
    details:
      "Unsere Hausmeisterdienste sorgen für einen reibungslosen Betrieb ... (gekürzt)",
    image: "/images/services/hausmeisterdienste.jpg"
  },
  {
    slug: "graffitientfernung",
    title: "Graffitientfernung",
    excerpt: "Schonend & gründlich – inkl. Schutzbeschichtung.",
    details:
      "Unerwünschte Graffitis mindern nicht nur den optischen Eindruck ... (gekürzt)",
    image: "/images/services/graffitientfernung.jpg"
  },
  {
    slug: "eventreinigung",
    title: "Eventmanagement (Reinigung)",
    excerpt: "Vor, während & nach dem Event.",
    details:
      "Damit Ihre Veranstaltung reibungslos abläuft, übernehmen wir die Reinigung vor, während und nach dem Event ... (gekürzt)",
    image: "/images/services/eventreinigung.jpg"
  },
  {
    slug: "aussenflaechen",
    title: "Grün- & Außenflächenpflege",
    excerpt: "Pflege von Rasen, Sträuchern & Anlagen.",
    details:
      "Gepflegte Grün- und Außenanlagen sind die Visitenkarte jeder Immobilie ... (gekürzt)",
    image: "/images/services/aussenflaechen.jpg"
  },
  {
    slug: "fahrzeugreinigung",
    title: "Fahrzeugreinigung (Abhol- & Bringservice)",
    excerpt: "Innen + Außen, professionell & bequem.",
    details:
      "Wir holen Ihr Auto ab, reinigen es gründlich und bringen es zurück ... (gekürzt)",
    image: "/images/services/fahrzeugreinigung.jpg"
  },
  {
    slug: "pv-dachreinigung",
    title: "Dach- & Photovoltaikreinigung",
    excerpt: "Mehr Leistung & Werterhalt.",
    details:
      "Regelmäßige Reinigung von Dach und PV-Anlage schützt und steigert Effizienz ... (gekürzt)",
    image: "/images/services/pv-dachreinigung.jpg"
  },
  {
    slug: "baustellenueberwachung",
    title: "Baustellenüberwachung",
    excerpt: "Sicherheit, Koordination & Qualität.",
    details:
      "Wir kontrollieren Vorschriften, koordinieren Abläufe und schützen Ihr Bauprojekt ... (gekürzt)",
    image: "/images/services/baustellenueberwachung.jpg"
  },
];

export const services = SERVICES;
export default SERVICES;