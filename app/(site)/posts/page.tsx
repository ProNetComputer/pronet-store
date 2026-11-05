import Link from "next/link";
import { getPosts } from "@/lib/queries";
import { truncate } from "@/lib/format";
import { getServerLocale } from "@/lib/server-locale";
import { pick } from "@/lib/types";

export default async function PostsPage() {
  const { locale, dict } = await getServerLocale();
  const posts = getPosts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-ink sm:text-4xl">{dict.pages.postsTitle}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-ink-muted">{dict.pages.postsIntro}</p>
      </header>

      {posts.length === 0 ? (
        <p className="panel mt-8 p-8 text-center text-sm text-ink-muted">{dict.pages.postsEmpty}</p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const title = pick(locale, post.title, post.titleEn);
            const excerpt = truncate(pick(locale, post.excerpt, post.excerptEn) || pick(locale, post.content, post.contentEn), 160);
            const tag = pick(locale, post.tag, post.tagEn);
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
                    <h2 className="mt-3 text-lg font-black leading-7 text-ink transition-colors group-hover:text-brand-strong">
                      <Link href={`/posts/${post.id}`}>{title}</Link>
                    </h2>
                    <p className="mt-2 flex-1 text-sm leading-6 text-ink-soft">{excerpt}</p>
                    <Link
                      href={`/posts/${post.id}`}
                      className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-strong hover:underline"
                    >
                      {dict.pages.readFull} ←
                    </Link>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}