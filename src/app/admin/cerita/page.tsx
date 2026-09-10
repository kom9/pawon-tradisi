"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminSidebar, AdminHeader } from "@/components/AdminShell";
import { Icon } from "@/components/Navbar";
import { getArticles } from "@/lib/data";
import type { Article } from "@/lib/types";

export default function AdminCeritaPage() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    getArticles({}).then(({ articles }) => setArticles(articles));
  }, []);

  return (
    <div className="min-h-screen bg-surface-canvas">
      <AdminSidebar />
      <div className="lg:ml-72">
        <AdminHeader greeting="Cerita Nusantara" />
        <main className="p-6 lg:p-10">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="font-display text-headlineSm font-semibold">Kelola Artikel</h1>
              <p className="text-bodySm text-ink-variant">{articles.length} artikel terbit</p>
            </div>
            <button className="flex items-center gap-2 rounded-DEFAULT bg-primary px-5 py-2.5 text-bodyMd font-semibold text-white hover:bg-primary-deep">
              <Icon name="add_circle" className="text-lg" />
              Tulis Artikel Baru
            </button>
          </div>
          <div className="editorial-border overflow-hidden rounded-card bg-white">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-low text-labelSm uppercase text-ink-variant">
                  <th className="px-4 py-3">Judul</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Penulis</th>
                  <th className="px-4 py-3">Views</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((a) => (
                  <tr key={a.id} className="border-b border-outline-editorial/60 hover:bg-surface-low/70">
                    <td className="max-w-md px-4 py-4">
                      <Link href={`/artikel/${a.slug}`} className="font-semibold text-primary hover:underline">
                        {a.title}
                      </Link>
                      {a.is_featured && (
                        <span className="ml-2 rounded-full bg-secondary-gold px-2 py-0.5 text-[10px] font-bold text-white">
                          FEATURED
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-bodySm text-ink-variant">{a.category}</td>
                    <td className="px-4 py-4 text-bodySm text-ink-variant">{a.author}</td>
                    <td className="px-4 py-4 text-bodySm font-semibold">{a.views.toLocaleString("id-ID")}</td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-status-fresh px-2.5 py-1 text-[11px] font-bold text-status-freshText">
                        Terbit
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
