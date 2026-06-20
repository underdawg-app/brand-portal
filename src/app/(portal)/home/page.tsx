"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart, MessageCircle, Repeat2, BarChart2, Share2, MoreHorizontal,
  BadgeCheck, TrendingUp, Search, GitCompare, FilePlus2, Play, FileText, Image as ImageIcon,
  ChevronDown, ChevronLeft, ChevronRight, Bookmark, UserCircle, Hash, Flame, Film, ArrowRight,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Avatar } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { compact } from "@/lib/format";
import { trendingPosts, challenges } from "@/data/seed";
import type { Creator } from "@/lib/types";

type Kind = "text" | "image" | "video" | "article";

type Post = {
  id: string;
  kind: Kind;
  author: string;
  handle: string;
  avatar?: string;
  accent?: string;
  verified?: boolean;
  time: string;
  text: string;
  media?: string;
  title?: string;     // article
  duration?: string;  // video
  niche?: string;
  likes: number;
  comments: number;
  reposts: number;
  views: number;
};

type Suggested = { tag: string; desc: string; cover: string; contributors: number; posts: number };

const pic = (s: string, w = 600, h = 400) => `https://picsum.photos/seed/${s}/${w}/${h}`;

const SUGGESTED: Suggested[] = [
  { tag: "Get Viral", desc: "Coordinated creator launches that actually move the numbers.", cover: pic("sugViral", 800, 500), contributors: 562, posts: 96 },
  { tag: "UGC Lab", desc: "Honest, native content that out-converts polished ads.", cover: pic("sugUgc", 800, 500), contributors: 1800, posts: 929 },
  { tag: "Brand Film", desc: "Editorial, natural-light brand films — the craft side.", cover: pic("sugFilm", 800, 500), contributors: 740, posts: 312 },
  { tag: "Skincare", desc: "Ingredient deep-dives and routines brands love.", cover: pic("sugSkin", 800, 500), contributors: 1240, posts: 503 },
];

const TRENDING: { icon: typeof Flame; title?: string; tag?: string; desc: string }[] = [
  { icon: Flame, title: "Get Viral", desc: "Coordinated creator launches are spiking this week. How are brands running them?" },
  { icon: Hash, tag: "skincaretok", desc: "Honest skincare reviews are driving the highest save rates right now." },
  { icon: Film, tag: "brandfilm", desc: "60-second editorial brand films are back. Who's nailing the format?" },
  { icon: Hash, tag: "creatoreconomy", desc: "Emerging creators are signing their first brand deals earlier than ever." },
];

const KINDS: Kind[] = ["video", "text", "article", "image", "text", "video"];
const TEXTS = [
  "Hot take: authentic UGC out-converts polished ads every single time.",
  "Looking for my next long-term brand partner. Values > budget, always.",
  "The algorithm rewarded honesty this week. Reach is up and I didn't change a thing.",
  "Just wrapped a shoot — here's a peek. Brands, my Q3 calendar is opening up. 👀",
];
const ARTICLE_TITLES = [
  "How I price brand deals as an emerging creator",
  "What actually makes a sponsored integration land",
  "My 3-step UGC workflow that brands keep rebooking",
];

function feedFromCreators(creators: Creator[]): Post[] {
  return creators.slice(0, 6).map((c, i) => {
    const kind = KINDS[i % KINDS.length];
    const cover = c.portfolio[i % Math.max(1, c.portfolio.length)]?.cover;
    return {
      id: `cf_${c.cr_id}`,
      kind,
      author: c.name,
      handle: c.handle,
      avatar: c.avatarUrl,
      accent: c.accent,
      verified: c.verifiedHuman,
      time: `${i + 1}d`,
      text: kind === "article" ? "New on my blog 👇" : TEXTS[i % TEXTS.length],
      media: kind === "text" ? undefined : cover,
      title: kind === "article" ? ARTICLE_TITLES[i % ARTICLE_TITLES.length] : undefined,
      duration: kind === "video" ? ["0:42", "1:15", "0:58"][i % 3] : undefined,
      niche: c.niches[0],
      likes: Math.round(c.stats.followers * 0.03),
      comments: Math.round(c.stats.followers * 0.004),
      reposts: Math.round(c.stats.followers * 0.002),
      views: Math.round(c.stats.followers * 0.6),
    };
  });
}

export default function HomePage() {
  const router = useRouter();
  const profile = useStore((s) => s.profile);
  const brand = useStore((s) => s.brand);
  const creators = useStore((s) => s.creators);
  const jobs = useStore((s) => s.jobs);

  const wsName = profile.companyName || brand.name;
  const liveGigs = jobs.filter((j) => j.status === "LIVE").length;

  const feed = useMemo<Post[]>(() => {
    const fromTrending: Post[] = trendingPosts.map((p) => ({
      id: p.id, kind: "image", author: p.author,
      handle: "@" + p.author.toLowerCase().replace(/[^a-z]/g, ""),
      avatar: p.avatar, verified: true, time: p.ago, text: p.caption, media: p.cover, niche: p.niche,
      likes: p.likes, comments: p.comments, reposts: Math.round(p.likes * 0.1), views: p.likes * 8,
    }));
    const fromCreators = feedFromCreators(creators);
    const out: Post[] = [];
    const max = Math.max(fromTrending.length, fromCreators.length);
    for (let i = 0; i < max; i++) {
      if (fromCreators[i]) out.push(fromCreators[i]);
      if (fromTrending[i]) out.push(fromTrending[i]);
    }
    return out;
  }, [creators]);

  const discoverCreators = creators.slice(6, 11);

  const fade = "linear-gradient(to bottom, transparent, #000 24px, #000 calc(100% - 24px), transparent)";

  return (
    <div className="lg:h-[calc(100vh-7rem)]">
      <div className="grid h-full gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        {/* CENTER — own scroll with soft fade top/bottom; greeting scrolls with it */}
        <div
          className="min-w-0 lg:h-full lg:overflow-y-auto lg:pr-1"
          style={{ maskImage: fade, WebkitMaskImage: fade }}
        >
          <div className="space-y-4 lg:py-1">
            <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-hairline bg-surfaceElevated p-5">
              <div>
                <span className="label text-brand">Your workspace</span>
                <h1 className="hero mt-1 text-2xl text-text md:text-3xl">What&apos;s happening, {wsName}</h1>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => router.push("/jobs/post")}><FilePlus2 size={16} /> Post a gig</Button>
                <Button variant="outline" onClick={() => router.push("/discover")}><Search size={16} /> Find a creator</Button>
                <Button variant="outline" onClick={() => router.push("/compare")}><GitCompare size={16} /> Compare</Button>
              </div>
            </section>

            {feed.map((p, i) => (
              <div key={p.id} className="space-y-4">
                <PostCard post={p} onOpen={() => router.push("/discover")} />
                {i === 1 && <SuggestedTopics creators={creators} />}
              </div>
            ))}
          </div>
        </div>

      {/* RIGHT RAIL — its own scroll; stays while the feed scrolls */}
      <aside className="hidden space-y-4 pr-1 lg:block lg:h-full lg:overflow-y-auto">
        <div className="rounded-2xl bg-surfaceMuted/40 p-4">
          <div className="flex items-center gap-2.5">
            <Avatar name={wsName} accent="#9CA3AF" size={34} />
            <span className="flex-1 truncate text-sm font-medium text-text">Engaging as {wsName}</span>
            <ChevronDown size={16} className="text-textMuted" />
          </div>
          <div className="mt-3 flex items-center gap-2 border-t border-hairline pt-3">
            <Link href="/jobs" className="flex items-center gap-1.5 rounded-full border border-hairline bg-surface px-3 py-1.5 text-xs font-medium text-text hover:border-hairlineStrong">
              <Flame size={13} className="text-brand" /> {liveGigs} live gigs
            </Link>
            <Link href="/jobs" className="flex items-center gap-1.5 rounded-full border border-hairline bg-surface px-3 py-1.5 text-xs font-medium text-text hover:border-hairlineStrong">
              <UserCircle size={14} /> Your gigs
            </Link>
            <button className="grid h-8 w-8 place-items-center rounded-full border border-hairline bg-surface text-textMuted hover:text-text" aria-label="Saved">
              <Bookmark size={14} />
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-surfaceMuted/40 p-4">
          <div className="font-heavy text-base text-text">Browse all talent on Discover</div>
          <p className="mt-1 text-sm text-textMuted">Discover the best creators and projects.</p>
          <Link href="/discover" className="mt-4 block"><Button variant="outline" className="w-full">Discover talent</Button></Link>
        </div>

        <div className="rounded-2xl border border-hairline bg-surfaceElevated p-4">
          <div className="flex items-center justify-between">
            <span className="label text-textMuted">Challenges</span>
            <button className="text-sm text-textMuted hover:text-text">View all</button>
          </div>
          <div className="mt-3 space-y-4">
            {challenges.map((ch, i) => (
              <div key={ch.id} className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink text-bone"><Hash size={16} /></span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-text">{ch.tag}</div>
                  <div className="text-xs text-textMuted">{ch.prize} · {ch.daysLeft}d left</div>
                </div>
                <div className="flex -space-x-2">
                  {creators.slice(i, i + 2).map((c) => (
                    <span key={c.cr_id} className="rounded-full ring-2 ring-surfaceElevated"><Avatar name={c.name} src={c.avatarUrl} accent={c.accent} size={22} /></span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-hairline bg-surfaceElevated p-4">
          <div className="flex items-center gap-1.5"><span className="label text-textMuted">Trending</span><TrendingUp size={13} className="text-textMuted" /></div>
          <div className="mt-3 space-y-1">
            {TRENDING.map((t, i) => (
              <button key={i} className="block w-full rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-surfaceMuted/50">
                <div className="flex items-center gap-2 text-sm font-medium text-text">
                  <t.icon size={15} className="text-brand" />{t.tag ? <span>#{t.tag}</span> : t.title}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-textMuted">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-hairline bg-surfaceElevated p-4">
          <span className="font-heavy text-sm text-text">Creators to discover</span>
          <div className="mt-3 space-y-3">
            {discoverCreators.map((c) => (
              <button key={c.cr_id} onClick={() => router.push(`/creators/${c.cr_id}`)} className="flex w-full items-center gap-2.5 text-left">
                <Avatar name={c.name} src={c.avatarUrl} accent={c.accent} size={38} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 truncate text-sm font-medium text-text">{c.name}{c.verifiedHuman && <BadgeCheck size={12} className="text-brand" />}</div>
                  <div className="truncate text-xs text-textMuted">{c.type} · {compact(c.stats.followers)}</div>
                </div>
                <span className="rounded-full border border-hairline px-3 py-1.5 text-xs font-medium text-text">View</span>
              </button>
            ))}
          </div>
        </div>
      </aside>
      </div>
    </div>
  );
}

const KIND_META: Record<Kind, { icon: typeof Play; label: string }> = {
  text: { icon: MessageCircle, label: "Update" },
  image: { icon: ImageIcon, label: "Photo" },
  video: { icon: Play, label: "Video" },
  article: { icon: FileText, label: "Article" },
};

function PostCard({ post: p, onOpen }: { post: Post; onOpen: () => void }) {
  const meta = KIND_META[p.kind];
  const isImg = (u?: string) => !!u && u.startsWith("http");
  return (
    <article className="rounded-2xl border border-hairline bg-surfaceElevated p-4 transition-colors hover:border-hairlineStrong">
      {/* header — avatar inline with name */}
      <div className="flex items-center gap-2.5">
        <button onClick={onOpen}><Avatar name={p.author} src={p.avatar} accent={p.accent} size={40} /></button>
        <button onClick={onOpen} className="min-w-0 flex-1 text-left">
          <div className="flex items-center gap-1 text-sm font-medium text-text">{p.author}{p.verified && <BadgeCheck size={14} className="text-brand" />}</div>
          <div className="truncate text-xs text-textMuted">{p.handle} · {p.time}</div>
        </button>
        <span className="label flex items-center gap-1 rounded-md border border-hairline px-1.5 py-0.5 text-[9px] text-textMuted"><meta.icon size={10} /> {meta.label}</span>
        <button className="rounded p-1 text-textMuted hover:bg-surfaceMuted"><MoreHorizontal size={15} /></button>
      </div>

      {/* body by content type */}
      {p.text && <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-text">{p.text}</p>}

      {p.kind === "image" && p.media && (
        <div className="mt-3 overflow-hidden rounded-xl border border-hairline bg-surfaceMuted">
          {isImg(p.media)
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={p.media} alt="" className="max-h-[440px] w-full object-cover" loading="lazy" />
            : <div className="aspect-[3/2] w-full" style={{ background: `${p.media}22` }} />}
        </div>
      )}

      {p.kind === "video" && p.media && (
        <div className="relative mt-3 aspect-video overflow-hidden rounded-xl border border-hairline bg-ink">
          {isImg(p.media) && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.media} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80" loading="lazy" />
          )}
          <div className="absolute inset-0 grid place-items-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-white/90 text-ink shadow-lg"><Play size={22} className="ml-0.5 fill-current" /></span>
          </div>
          {p.duration && <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[11px] font-medium text-white">{p.duration}</span>}
        </div>
      )}

      {p.kind === "article" && (
        <button onClick={onOpen} className="mt-3 flex w-full items-stretch gap-3 overflow-hidden rounded-xl border border-hairline text-left transition-colors hover:border-hairlineStrong">
          {p.media && (
            <div className="w-32 shrink-0 bg-surfaceMuted">
              {isImg(p.media)
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={p.media} alt="" className="h-full w-full object-cover" loading="lazy" />
                : <div className="h-full w-full" style={{ background: `${p.media}22` }} />}
            </div>
          )}
          <div className="min-w-0 flex-1 py-3 pr-3">
            <div className="label text-[9px] text-textMuted">Article · underdawg.com</div>
            <div className="mt-1 line-clamp-2 font-heavy text-sm text-text">{p.title}</div>
            <div className="mt-2 flex items-center gap-1 text-xs text-brand">Read on Underdawg <ArrowRight size={12} /></div>
          </div>
        </button>
      )}

      {/* engagement (display of creator-app activity) */}
      <div className="mt-3 flex items-center gap-6 text-textMuted">
        <Stat icon={MessageCircle} count={p.comments} />
        <Stat icon={Repeat2} count={p.reposts} />
        <Stat icon={Heart} count={p.likes} />
        <Stat icon={BarChart2} count={p.views} />
        <Share2 size={15} className="ml-auto" />
      </div>
    </article>
  );
}

function SuggestedTopics({ creators }: { creators: Creator[] }) {
  return (
    <section className="rounded-2xl border border-hairline bg-surfaceElevated p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="label text-textMuted">Suggested topics</span>
        <div className="flex gap-1">
          <button className="grid h-7 w-7 place-items-center rounded-full border border-hairline text-textMuted hover:text-text"><ChevronLeft size={14} /></button>
          <button className="grid h-7 w-7 place-items-center rounded-full border border-hairline text-textMuted hover:text-text"><ChevronRight size={14} /></button>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {SUGGESTED.slice(0, 2).map((s, idx) => (
          <button key={s.tag} className="group relative aspect-[16/9] overflow-hidden rounded-2xl text-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.cover} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
            <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
              <div className="flex items-start justify-between">
                <span className="flex items-center gap-1 text-base font-heavy"><Hash size={15} /> {s.tag}</span>
                <ArrowRight size={18} />
              </div>
              <div>
                <p className="text-sm font-medium leading-snug">{s.desc}</p>
                <div className="mt-3 flex items-end justify-between">
                  <div className="flex gap-5 text-xs">
                    <div><div className="font-heavy text-sm">{compact(s.contributors)}</div><div className="opacity-70">Contributors</div></div>
                    <div><div className="font-heavy text-sm">{compact(s.posts)}</div><div className="opacity-70">Posts</div></div>
                  </div>
                  <div className="flex -space-x-2">
                    {creators.slice(idx * 2, idx * 2 + 3).map((c) => (
                      <span key={c.cr_id} className="rounded-full ring-2 ring-black/30"><Avatar name={c.name} src={c.avatarUrl} accent={c.accent} size={26} /></span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function Stat({ icon: Icon, count }: { icon: typeof Heart; count: number }) {
  return (
    <span className="flex items-center gap-1.5 text-sm text-textMuted">
      <Icon size={15} /> {count > 0 && compact(count)}
    </span>
  );
}
