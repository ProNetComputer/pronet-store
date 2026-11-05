import Link from "next/link";
import Image from "next/image";
import { HeroCarousel } from "@/components/hero-carousel";
import { ProductCard } from "@/components/product-card";
import { BrandsBar } from "@/components/brands-bar";
import { JsonLd, organizationSchema } from "@/components/json-ld";
import {
  getBrandList,
  getBrandProductCounts,
  getBusinessAreas,
  getPosts,
  getProducts,
  getProjects,
  getSettings,
  getSlides,
  countProducts,
} from "@/lib/queries";
import { getServerLocale } from "@/lib/server-locale";
import { pick } from "@/lib/types";
import { truncate } from "@/lib/format";

export default async function HomePage() {
  const { locale, dict } = await getServerLocale();
  const settings = getSettings();
  const slides = getSlides();
  const featured = getProducts({ featuredOnly: true, limit: 8 });
  const areas = getBusinessAreas();
  const projects = getProjects().slice(0, 3);
  const posts = getPosts().slice(0, 3);
  const brands = getBrandList();
  const brandCounts = getBrandProductCounts();
  const total = countProducts();

  const siteUrl = process.env.PRONET_SITE_URL || "http://localhost:3000";

  const trust = [
    { icon: "🛡️", title: dict.home.trustWarrantyTitle, desc: dict.home.trustWarrantyDesc },
    { icon: "🚚", title: dict.home.trustDeliveryTitle, desc: dict.home.trustDeliveryDesc },
    { icon: "📦", title: dict.home.trustShippingTitle, desc: dict.home.trustShippingDesc },
    { icon: "🧰", title: dict.home.trustSupportTitle, desc: dict.home.trustSupportDesc },
  ];

  const brandBarTitle =
    pick(locale, settings.brandBarTitle, settings.brandBarTitleEn) || dict.home.brandsHeadingFallback;
  const brandBarSubtitle =
    pick(locale, settings.brandBarSubtitle, settings.brandBarSubtitleEn) || dict.home.brandsSubFallback;

  const identityTitle =
    pick(locale, settings.identityTitle, settings.identityTitleEn) || dict.home.identityHeadingFallback;
  const identityText = pick(locale, settings.identityText, settings.identityTextEn);
  const visionTitle = pick(locale, settings.visionTitle, settings.visionTitleEn) || dict.home.visionHeadingFallback;
  const visionText = pick(locale, settings.visionText, settings.visionTextEn);

  return (
    <div className="mx-auto max-w-7xl space-y-14 px-4 py-8 sm:px-6">
      <JsonLd
        data={organizationSchema({
          brandName: settings.brandName,
          slogan: settings.slogan,
          email: settings.email,
          landline: settings.landline,
          address: settings.address,
          logo: "/assets/ProNet_Logo.png",
          siteUrl,
        })}
      />

      <HeroCarousel slides={slides} />

      <section aria-label={locale === "en" ? "Why ProNet Computer" : "لماذا برونت كمبيوتر"}>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {trust.map((t) => (
            <li key={t.title} className="panel flex flex-col items-center gap-1 p-4 text-center">
              <span aria-hidden="true" className="text-2xl">
                {t.icon}
              </span>
              <p className="text-sm font-black text-ink">{t.title}</p>
              <p className="text-xs text-ink-muted">{t.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* شريط الماركات والوكلاء المعتمدين — مكان بارز بعد شرائح الثقة */}
      <BrandsBar
        brands={brands}
        title={brandBarTitle}
        subtitle={brandBarSubtitle}
        locale={locale}
        officialAgentLabel={dict.home.officialAgent}
        productCounts={brandCounts}
      />

      <section aria-labelledby="featured-heading">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="featured-heading" className="text-2xl font-black text-ink">
              {dict.home.featuredHeading}
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              {total} {dict.home.productsAvailable}
            </p>
          </div>
          <Link href="/store" className="btn-ghost text-sm">
            {dict.home.allStore}
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} showPrices={settings.showPricesGlobal} />
          ))}
        </div>
      </section>

      <section aria-labelledby="areas-heading">
        <h2 id="areas-heading" className="mb-5 text-2xl font-black text-ink">
          {dict.home.areasHeading}
        </h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {areas.map((a) => (
            <li key={a.id} className="panel group relative flex flex-col overflow-hidden transition-all hover:border-brand/60 hover:shadow-xl">
              {a.image ? (
                <div className="relative h-40 w-full overflow-hidden border-b border-line bg-surface-2">
                  <Image src={a.image} alt={pick(locale, a.title, a.titleEn)} fill sizes="(max-width: 640px) 100vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent" />
                  <span aria-hidden="true" className="absolute bottom-3 start-4 text-3xl drop-shadow-md">
                    {a.icon}
                  </span>
                </div>
              ) : (
                <div className="p-5 pb-0">
                  <span aria-hidden="true" className="text-3xl">
                    {a.icon}
                  </span>
                </div>
              )}
              <div className="flex flex-1 flex-col p-5 pt-3">
                <h3 className="text-base font-black text-ink transition-colors group-hover:text-brand-strong">{pick(locale, a.title, a.titleEn)}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-ink-soft">{pick(locale, a.desc, a.descEn)}</p>
                {a.categoryFilter ? (
                  <Link
                    href={`/store?category=${encodeURIComponent(a.categoryFilter)}`}
                    className="mt-4 inline-block text-xs font-bold text-brand-strong hover:underline"
                  >
                    {dict.home.browseSection} ←
                  </Link>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {identityText || visionText ? (
        <section aria-label={locale === "en" ? "Identity and leadership" : "الهوية والريادة"} className="grid gap-4 md:grid-cols-2">
          {identityText ? (
            <article className="panel p-6">
              <h2 className="text-xl font-black text-ink">{identityTitle}</h2>
              <p className="mt-3 text-sm leading-7 text-ink-soft">{identityText}</p>
            </article>
          ) : null}
          {visionText ? (
            <article className="panel p-6">
              <h2 className="text-xl font-black text-ink">{visionTitle}</h2>
              <p className="mt-3 text-sm leading-7 text-ink-soft">{visionText}</p>
            </article>
          ) : null}
        </section>
      ) : null}

      <section aria-labelledby="projects-heading">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <h2 id="projects-heading" className="text-2xl font-black text-ink">
            {dict.home.completedProjects}
          </h2>
          <Link href="/projects" className="btn-ghost text-sm">
            {dict.nav.projects}
          </Link>
        </div>
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {projects.map((p) => {
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
                        +{p.images.length - 1}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs font-bold text-brand-strong">{p.category}</p>
                    <h3 className="mt-2 text-base font-black leading-6 text-ink transition-colors group-hover:text-brand-strong">
                      {title}
                    </h3>
                    <p className="mt-1 text-xs font-bold text-ink-muted">📍 {p.location}</p>
                    <p className="mt-3 flex-1 text-sm leading-6 text-ink-soft">{desc.split("\n")[0]}</p>
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

      <section aria-labelledby="posts-heading">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <h2 id="posts-heading" className="text-2xl font-black text-ink">
            {dict.home.postsHeading}
          </h2>
          <Link href="/posts" className="btn-ghost text-sm">
            {dict.home.allPosts}
          </Link>
        </div>
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {posts.map((post) => {
            const title = pick(locale, post.title, post.titleEn);
            const tag = pick(locale, post.tag, post.tagEn);
            const excerpt = truncate(pick(locale, post.excerpt || post.content, post.excerptEn || post.contentEn), 110);
            const cover = post.images[0];
            return (
              <li key={post.id}>
                <article className="panel group flex h-full flex-col overflow-hidden transition-all hover:border-brand/60 hover:shadow-xl">
                  <Link href={`/posts/${post.id}`} className="relative block aspect-[16/9] w-full overflow-hidden bg-surface-2">
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
                        📝
                      </div>
                    )}
                    {post.images.length > 1 ? (
                      <span className="absolute bottom-2 end-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">
                        +{post.images.length - 1}
                      </span>
                    ) : null}
                  </Link>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      {tag ? (
                        <span className="rounded-lg border border-pronet-gold/50 bg-pronet-gold/10 px-2 py-0.5 text-[11px] font-bold text-gold">
                          {tag}
                        </span>
                      ) : null}
                      <time className="text-xs text-ink-muted">{post.date}</time>
                    </div>
                    <h3 className="mt-3 text-base font-black leading-6 text-ink transition-colors group-hover:text-brand-strong">
                      <Link href={`/posts/${post.id}`}>{title}</Link>
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-6 text-ink-soft">{excerpt}</p>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="panel brand-gradient flex flex-col items-center gap-4 p-8 text-center">
        <h2 className="text-2xl font-black text-[#062633]">{dict.home.ctaTitle}</h2>
        <p className="max-w-2xl text-sm font-semibold leading-7 text-[#062633]">{dict.home.ctaBody}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(dict.home.whatsappQuoteMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-[#062633] px-5 py-3 text-sm font-black text-[#ffffff]"
          >
            💬 {dict.home.ctaWhatsapp}
          </a>
          <Link
            href="/contact"
            className="rounded-xl border-2 border-[#062633] px-5 py-3 text-sm font-black text-[#062633]"
          >
            {dict.home.ctaPayment}
          </Link>
        </div>
      </section>
    </div>
  );
}
