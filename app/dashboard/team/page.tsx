import AppShell from "@/components/layout/AppShell";
import { Users, Package, FileText, CheckCircle2 } from "lucide-react";

export default function TeamDashboard() {
  return (
    <AppShell role="team">
      <div className="mx-auto max-w-7xl space-y-7">
        <div>
          <p className="text-sm font-medium text-blue-600">Team Member Workspace</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Welcome back ??</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your assigned leads and customer quotes.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Assigned Leads","18",Users],
            ["Locked Products","32",Package],
            ["Open Quotes","7",FileText],
            ["Won Deals","12",CheckCircle2],
          ].map(([a,b,Icon]:any)=>(
            <div key={a} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Icon size={19}/></div>
              <p className="mt-5 text-sm text-slate-500">{a}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{b}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">Your workflow</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-4">
            {[
              ["01","Select Product","Choose from vendor-locked products"],
              ["02","Create Lead","Capture customer requirements"],
              ["03","Build Quote","Calculate pricing and margin"],
              ["04","Close Deal","Track customer response"],
            ].map(([n,title,desc])=>(
              <div key={n} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <span className="text-xs font-bold text-blue-600">{n}</span>
                <h3 className="mt-3 font-semibold text-slate-900">{title}</h3>
                <p className="mt-1 text-xs leading-5 text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
