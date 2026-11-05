import Link from "next/link";
import { JsonLd, breadcrumbSchema } from "@/components/json-ld";
import { getProjects, getSettings } from "@/lib/queries";
import { getServerLocale } from "@/lib/server-locale";
import { pick } from "@/lib/types";

export default async function ProjectsPage() {
  const { locale, dict } = await getServerLocale();
  const settings = getSettings();
  const projects = getProjects();
  const siteUrl = process.env.PRONET_SITE_URL || "http://localhost:3000";

  const grouped = new Map<string, typeof projects>();
  for (const p of projects) {
    const key = p.category || dict.pages.projectsGeneral;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(p);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <JsonLd
        data={breadcrumbSchema([
          { name: dict.nav.home, url: siteUrl },
          { name: dict.pages.projectsTitle, url: `${siteUrl}/projects` },
        ])}
      />

      <header className="mb-8">
        <h1 className="text-3xl font-black text-ink sm:text-4xl">{dict.pages.projectsTitle}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-ink-muted">{dict.pages.projectsIntro}</p>
      </header>

      <div className="space-y-12">
        {[...grouped.entries()].map(([category, items]) => (
          <section key={category} aria-labelledby={`cat-${category}`}>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-8 w-1.5 rounded-full bg-brand" aria-hidden="true" />
              <h2 id={`cat-${category}`} className="text-xl font-black text-brand-strong sm:text-2xl">
                {category}
              </h2>
              <span className="rounded-full border border-line bg-surface-2 px-2.5 py-0.5 text-xs font-bold text-ink-muted">
                {items.length}
              </span>
            </div>

            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p) => {
                const title = pick(locale, p.title, p.titleEn);
                const desc = pick(locale, p.desc, p.descEn);
                const cover = p.images[0];
                return (
                  <li key={p.id}>
                    <article className="panel group flex h-full flex-col overflow-hidden transition-all hover:border-brand/60 hover:shadow-xl">
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-2">
                        {cover ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={cover}
                            alt={title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-4xl" aria-hidden="true">
                            🏗️
                          </div>
                        )}
                        {p.images.length > 1 ? (
                          <span className="absolute bottom-2 end-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">
                            +{p.images.length - 1} صور
                          </span>
                        ) : null}
                      </div>

                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="text-base font-black leading-6 text-ink transition-colors group-hover:text-brand-strong">
                          {title}
                        </h3>
                        <p className="mt-1 text-xs font-bold text-ink-muted">📍 {p.location}</p>
                        <p className="mt-3 text-sm leading-7 text-ink-soft">
                          {desc.split("\n")[0]}
                        </p>
                        <details className="mt-3">
                          <summary className="cursor-pointer list-none text-sm font-bold text-brand-strong hover:underline">
                            عرض المزيد ▾
                          </summary>
                          <div className="rich-text mt-3 space-y-2 text-sm leading-7 text-ink-soft">
                            {desc
                              .split("\n")
                              .filter((line) => line.trim().length > 0)
                              .map((line, i) => (
                                <p key={i}>{line.trim()}</p>
                              ))}
                          </div>
                        </details>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <section className="panel mt-12 p-8 text-center">
        <h2 className="text-2xl font-black text-ink">{dict.pages.projectsCtaTitle}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-ink-soft">{dict.pages.projectsCtaBody}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/contact" className="btn-primary text-sm">
            {dict.pages.projectsCtaBtn}
          </Link>
          <a
            href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(dict.pages.projectsWhatsappMsg)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-sm"
          >
            💬 {dict.pages.whatsapp}
          </a>
        </div>
      </section>
    </div>
  );
}