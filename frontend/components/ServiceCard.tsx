
import Link from "next/link";
import { Service } from "../data/services";

export default function ServiceCard({s}:{s:Service}){
  return (
    <Link href={`/services/${s.slug}`} className="group block rounded-2xl border overflow-hidden hover:shadow-lg transition">
      <img src={s.image} alt={s.name} className="h-44 w-full object-cover group-hover:scale-[1.02] transition"/>
      <div className="p-4">
        <div className="font-semibold">{s.name}</div>
        <div className="text-sm text-gray-600">{s.excerpt}</div>
      </div>
    </Link>
  )
}
