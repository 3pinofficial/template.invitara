"use client";

import React from "react";
import Link from "next/link";
import { ALL_TEMPLATE_SCHEMAS } from "@/lib/registry";
import AuthGuard from "@/components/AuthGuard";


export default function ShowcasePage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#0d1527] text-white selection:bg-[#c5a059] selection:text-black">
        {/* Hero Section */}
        <header className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-[#131e32] to-[#0d1527] py-20 px-6 text-center">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent"></div>
          <div className="relative max-w-4xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#c5a059] mb-3 inline-block">
              Invitara Premium Templates
            </span>
            <h1 className="text-5xl md:text-6xl font-headline font-bold mb-6 text-white tracking-tight">
              Design <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c5a059] to-[#e8c37d]">Showcase</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed font-sans">
              Migrated invitation templates. Verify, preview, and test responsiveness in mobile and desktop viewports.
            </p>
          </div>
        </header>

        {/* Grid Section */}
        <main className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-headline font-bold mb-8 text-[#c5a059] flex items-center gap-2">
            <span>✦</span> Migrated Templates ({ALL_TEMPLATE_SCHEMAS.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ALL_TEMPLATE_SCHEMAS.map((template) => (
              <div
                key={template.slug}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-[#c5a059]/40 transition-all duration-300 hover:shadow-2xl hover:shadow-[#c5a059]/5"
              >
                {/* Thumbnail Container */}
                <div className="aspect-[4/3] w-full bg-slate-950 relative overflow-hidden flex items-center justify-center">
                  {template.thumbnail ? (
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="text-4xl text-gray-700 font-headline">✨</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  {/* Badge Category */}
                  <span className="absolute top-4 left-4 text-[10px] font-semibold tracking-wider uppercase bg-[#c5a059] text-black px-2.5 py-1 rounded-full">
                    {template.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-headline font-bold text-white mb-2 group-hover:text-[#c5a059] transition-colors duration-200">
                      {template.name}
                    </h3>
                    <p className="text-xs text-gray-400 font-sans mb-4">
                      Slug: <code className="text-[#c5a059] bg-[#c5a059]/10 px-1.5 py-0.5 rounded">{template.slug}</code>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                    <Link
                      href={`/preview/${template.slug}?mode=mobile`}
                      className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-semibold transition-all border border-white/10 hover:border-white/20"
                    >
                      <span>📱</span> Mobile
                    </Link>
                    <Link
                      href={`/preview/${template.slug}?mode=desktop`}
                      className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#c5a059] hover:bg-[#e8c37d] text-black rounded-lg text-xs font-bold transition-all"
                    >
                      <span>💻</span> Desktop
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="py-12 border-t border-white/10 text-center text-xs text-gray-500">
          <p>© 2026 Invitara Templates. Powered by Next.js & Tailwind CSS v4.</p>
        </footer>
      </div>
    </AuthGuard>
  );
}
