"use client";
import Image from "next/image";
import { Star, BadgeCheck } from "lucide-react";
const fmt = (v) => { try { return new Date(v).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); } catch { return ""; } };
const Stars = ({ value = 5, cls = "w-3.5 h-3.5" }) => (
  <div className="flex items-center gap-0.5 text-accentColor">
    {[...Array(5)].map((_, i) => (<Star key={i} stroke="none" className={cls} fill={i < Math.round(Number(value) || 0) ? "currentColor" : "rgba(60,32,32,0.15)"} />))}
  </div>
);
const ReviewSection = ({ product }) => {
  const fileBase = process.env.NEXT_PUBLIC_FILE_URL;
  const reviews = product?.reviews || [];
  const summary = product?.reviewSummary || {};
  const average = Number(summary.average || 0);
  const count = Number(summary.count ?? reviews.length);
  const dist = summary.distribution || {};
  const maxB = Math.max(1, ...[1, 2, 3, 4, 5].map((s) => Number(dist[s] || 0)));
  return (
    <section id="reviews" className="mt-20 sm:mt-28 pt-14 border-t border-textColor/10 scroll-mt-28">
      <div className="flex flex-col items-center text-center mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Star fill="#9B2242" stroke="none" className="h-3.5 w-3.5" />
          <span className="text-accentColor text-[0.7rem] uppercase tracking-[0.3em] font-bold">Guest Chronicles</span>
          <Star fill="#9B2242" stroke="none" className="h-3.5 w-3.5" />
        </div>
        <h2 className="text-3xl sm:text-4xl font2 font-medium tracking-tight">What Guests Say</h2>
        <p className="text-xs sm:text-sm text-stone-500 font-light max-w-md mt-2">Honest tastings from verified delivered orders.</p>
      </div>

      {count === 0 ? (
        <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-textColor/20 bg-white/60 px-6 py-12 text-center">
          <p className="font2 text-xl">No tastings shared yet</p>
          <p className="text-xs sm:text-sm text-stone-500 font-light mt-2">Once your order is delivered you can share your tasting notes here.</p>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[320px_1fr] lg:gap-12 items-start">
          <aside className="rounded-2xl border border-textColor/10 bg-white/80 shadow-sm p-6 lg:sticky lg:top-28">
            <p className="text-[0.65rem] uppercase tracking-[0.25em] font-bold text-stone-500">Overall Rating</p>
            <div className="flex items-end gap-2 mt-2">
              <span className="font2 text-5xl font-bold leading-none">{average.toFixed(1)}</span>
              <span className="text-sm text-stone-400 pb-1">/ 5</span>
            </div>
            <div className="mt-3"><Stars value={average} cls="w-4 h-4" /></div>
            <p className="text-xs text-stone-500 font-light mt-2">Based on {count} verified {count === 1 ? "tasting" : "tastings"}</p>
            <div className="mt-6 space-y-2.5">
              {[5, 4, 3, 2, 1].map((s) => (
                <div key={s} className="flex items-center gap-2.5">
                  <span className="flex items-center gap-1 text-[11px] font-bold text-textColor/70 w-8">{s}<Star fill="currentColor" stroke="none" className="w-3 h-3 text-accentColor" /></span>
                  <div className="flex-1 h-1.5 rounded-full bg-textColor/10 overflow-hidden">
                    <div className="h-full rounded-full bg-accentColor" style={{ width: `${Math.round((Number(dist[s] || 0) / maxB) * 100)}%` }} />
                  </div>
                  <span className="text-[11px] text-stone-500 tabular-nums w-6 text-right">{Number(dist[s] || 0)}</span>
                </div>
              ))}
            </div>
          </aside>
          <div className="space-y-4">
            {reviews.map((r) => {
              const name = r.user?.name || "Verified Guest";
              const av = r.user?.detail?.image?.path || r.user?.detail?.profileImage || null;
              return (
                <article key={r.id} className="rounded-2xl border border-textColor/10 bg-white/80 shadow-sm p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded-full overflow-hidden border border-textColor/10 bg-accentColor/10 flex items-center justify-center shrink-0">
                        {av ? <Image src={`${fileBase}/${av}`} alt={name} fill className="object-cover" sizes="40px" /> : <span className="font2 font-bold text-accentColor text-sm">{(name[0] || "G").toUpperCase()}</span>}
                      </div>
                      <div>
                        <p className="text-sm font-bold flex items-center gap-1.5">{name}
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-px rounded-full"><BadgeCheck className="w-3 h-3" />Verified</span>
                        </p>
                        <p className="text-[11px] text-stone-500 font-light mt-0.5">{fmt(r.createdAt)}</p>
                      </div>
                    </div>
                    <Stars value={r.rating} />
                  </div>
                  <p className="text-sm text-stone-600 font-light leading-relaxed mt-4">{r.comment}</p>
                  {r.images?.length > 0 && (
                    <div className="flex flex-wrap gap-2.5 mt-4">
                      {r.images.map((img) => (
                        <div key={img.id} className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-lg overflow-hidden border border-textColor/10 bg-white">
                          <Image src={`${fileBase}/${img.path}`} alt="Guest photo" fill className="object-cover" sizes="80px" />
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default ReviewSection;