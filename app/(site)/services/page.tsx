import Link from "next/link";
import Image from "next/image";
import { getBusinessAreas, getSettings } from "@/lib/queries";
import { getServerLocale } from "@/lib/server-locale";
import { pick } from "@/lib/types";

export default async function ServicesPage() {
  const { locale, dict } = await getServerLocale();
  const settings = getSettings();
  const areas = getBusinessAreas();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header>
        <h1 className="text-3xl font-black text-ink">{dict.pages.servicesTitle}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-ink-muted">{dict.pages.servicesIntro}</p>
      </header>

      <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {areas.map((a) => (
          <li key={a.id} className="panel group flex flex-col overflow-hidden transition-all hover:border-brand/60 hover:shadow-xl">
            {a.image ? (
              <div className="relative h-48 w-full overflow-hidden border-b border-line bg-surface-2">
                <Image src={a.image} alt={pick(locale, a.title, a.titleEn)} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent" />
                <span aria-hidden="true" className="absolute bottom-3 start-4 text-4xl drop-shadow-lg">
                  {a.icon}
                </span>
              </div>
            ) : (
              <div className="p-6 pb-0">
                <span aria-hidden="true" className="text-4xl drop-shadow-md">
                  {a.icon}
                </span>
              </div>
            )}
            <div className="flex flex-1 flex-col p-5 pt-4">
              <h2 className="text-lg font-black text-ink transition-colors group-hover:text-brand-strong">{pick(locale, a.title, a.titleEn)}</h2>
              <p className="mt-2.5 flex-1 text-sm leading-7 text-ink-soft">{pick(locale, a.desc, a.descEn)}</p>
              {a.categoryFilter ? (
                <Link
                  href={`/store?category=${encodeURIComponent(a.categoryFilter)}`}
                  className="btn-ghost mt-5 self-start text-xs"
                >
                  {dict.pages.browseCategory}
                </Link>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      <section className="panel brand-gradient mt-10 flex flex-col items-center gap-4 p-8 text-center">
        <h2 className="text-2xl font-black text-[#062633]">{dict.pages.servicesCtaTitle}</h2>
        <p className="max-w-2xl text-sm font-semibold leading-7 text-[#062633]">{dict.pages.servicesCtaBody}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(dict.pages.servicesWhatsappMsg)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-[#062633] px-5 py-3 text-sm font-black text-[#ffffff]"
          >
            💬 {dict.pages.requestQuote}
          </a>
          <Link href="/contact" className="rounded-xl border-2 border-[#062633] px-5 py-3 text-sm font-black text-[#062633]">
            {dict.pages.contactInfo}
          </Link>
        </div>
      </section>
    </div>
  );
}
