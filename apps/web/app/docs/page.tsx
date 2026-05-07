import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ListViewIcon } from "@hugeicons/core-free-icons"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"

const toc = [
  { label: "Introduction", id: "introduction" },
  { label: "Why aesthetic/ui", id: "why" },
  { label: "FAQ", id: "faq" },
]

export default function HomePage() {
  return (
    <div className="flex">
      {/* Main content */}
      <div className="max-w-3xl min-w-0 flex-1 px-12 py-10">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Introduction</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-12">
          <section id="introduction">
            <h1 className="mb-4 text-4xl font-bold tracking-tight">
              Introduction
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground">
              A collection of beautifully designed, accessible components built
              with{" "}
              <Link
                href="#"
                className="text-foreground underline decoration-muted-foreground/40 underline-offset-4 transition-colors hover:decoration-foreground"
              >
                Radix UI
              </Link>{" "}
              and{" "}
              <Link
                href="#"
                className="text-foreground underline decoration-muted-foreground/40 underline-offset-4 transition-colors hover:decoration-foreground"
              >
                Tailwind CSS
              </Link>
              . Open source. Free forever.
            </p>
          </section>

          <hr className="border-border" />

          <section id="why" className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">
              Why aesthetic/ui?
            </h2>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              Most component libraries lock you in. You install a package,
              import components, and hope the API fits your needs. When it
              doesn&apos;t, you fight the library.
            </p>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              aesthetic/ui works differently. You copy the components you need
              directly into your project. The code is yours — read it, change
              it, break it, own it.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                {
                  title: "Copy & paste",
                  desc: "No npm install. Drop the code directly into your project.",
                },
                {
                  title: "Fully typed",
                  desc: "Every component ships with TypeScript types out of the box.",
                },
                {
                  title: "Dark mode",
                  desc: "Built-in dark mode support using CSS variables.",
                },
                {
                  title: "Accessible",
                  desc: "Built on Radix UI primitives with ARIA roles and keyboard nav.",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="space-y-1.5 rounded-lg border border-border p-5"
                >
                  <p className="text-sm font-semibold">{f.title}</p>
                  <p className="text-[13px] leading-relaxed text-muted-foreground">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-border" />

          <section id="faq" className="space-y-7">
            <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>
            {[
              {
                q: "Is this a component library?",
                a: "Not in the traditional sense. You don't install it as a dependency. You copy the source into your project and own it entirely.",
              },
              {
                q: "Which frameworks are supported?",
                a: "Any React-based framework — Next.js, Remix, Vite, Astro. The components are just React + Tailwind.",
              },
              {
                q: "Can I use this in a commercial project?",
                a: "Yes. MIT licensed. Use it however you want.",
              },
            ].map((item) => (
              <div key={item.q} className="space-y-2">
                <h3 className="text-[15px] font-semibold">{item.q}</h3>
                <p className="text-[14px] leading-relaxed text-muted-foreground">
                  {item.a}
                </p>
              </div>
            ))}
          </section>

          {/* Prev / next nav */}
          <div className="flex justify-end border-t border-border pt-4">
            <Link
              href="/docs/installation"
              className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Installation
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Right TOC */}
      <aside className="hidden w-56 shrink-0 border-l border-dashed border-white/10 px-6 py-10 xl:block">
        <div className="sticky top-24">
          <div className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground/60 uppercase">
            <HugeiconsIcon icon={ListViewIcon} size={13} />
            <span>On This Page</span>
          </div>
          <ul className="space-y-2">
            {toc.map((t) => (
              <li key={t.id}>
                <a
                  href={`#${t.id}`}
                  className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  )
}
