import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Package,
  Quote,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Package,
    title: "Product Management",
    description:
      "Manage products, availability, pricing, and vendor access from one place.",
  },
  {
    icon: Users,
    title: "Lead Management",
    description:
      "Create, assign, track, and manage leads throughout the complete sales journey.",
  },
  {
    icon: Quote,
    title: "Smart Quotations",
    description:
      "Build professional customer quotations with margins, installation, and miscellaneous charges.",
  },
  {
    icon: BarChart3,
    title: "Sales Analytics",
    description:
      "Understand your sales activity with clear dashboards and useful business insights.",
  },
];

const roles = [
  {
    title: "Trader",
    description:
      "Manage global products, pricing, and the products available to vendors.",
  },
  {
    title: "Vendor",
    description:
      "Lock products, manage your pricing profile, invite team members, and oversee leads.",
  },
  {
    title: "Team Member",
    description:
      "Work with vendor products, create leads, and prepare customer quotations.",
  },
  {
    title: "Admin",
    description:
      "Monitor users, leads, and overall platform analytics.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-primary"
          >
            LeadMS
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 transition hover:text-primary"
            >
              Features
            </a>

            <a
              href="#roles"
              className="text-sm font-medium text-slate-600 transition hover:text-primary"
            >
              Roles
            </a>

            <Link
              href="/login"
              className="text-sm font-semibold text-slate-700 transition hover:text-primary"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark"
            >
              Get Started
            </Link>
          </nav>

          <Link
            href="/register"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white md:hidden"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-primary-light px-4 py-2 text-sm font-medium text-primary">
              <CheckCircle2 className="h-4 w-4" />
              Smart CRM for Modern Sales Teams
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Turn Leads Into{" "}
              <span className="text-primary">Successful Sales</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              LeadMS helps traders, vendors, and sales teams manage products,
              leads, customers, and quotations from one powerful platform.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Explore Features
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="border-y border-border bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              One Platform
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything your sales workflow needs
            </h2>

            <p className="mt-4 text-lg text-slate-600">
              From product management to customer quotations, LeadMS keeps
              your sales operations organized and connected.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-background">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Powerful Features
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Built to simplify your sales process
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-xl border border-border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-light text-primary">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="border-t border-border bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Designed For Your Team
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              One platform. Four powerful roles.
            </h2>

            <p className="mt-4 text-lg text-slate-600">
              Every user gets the tools they need based on their role in the
              sales workflow.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {roles.map((role, index) => (
              <div
                key={role.title}
                className="rounded-xl border border-border bg-background p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {index + 1}
                </div>

                <h3 className="mt-5 text-xl font-semibold text-slate-900">
                  {role.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {role.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white">
                Ready to simplify your sales workflow?
              </h2>

              <p className="mt-3 max-w-2xl text-blue-100">
                Start managing products, leads, teams, and quotations with
                LeadMS.
              </p>
            </div>

            <Link
              href="/register"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary shadow-sm transition hover:bg-blue-50"
            >
              Create Account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-center text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-left lg:px-8">
          <p>© 2026 LeadMS. All rights reserved.</p>

          <p>Smart CRM for modern sales teams.</p>
        </div>
      </footer>
    </main>
  );
}