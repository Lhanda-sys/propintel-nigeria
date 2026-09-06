import { useEffect, useState } from 'react'
import {
  LayoutDashboard, Users, Building2, ShieldCheck, Flag, Ban, ScrollText, Briefcase, Check, X,
} from 'lucide-react'
import StatCard from '../components/dashboard/StatCard'
import VerificationBadge from '../components/property/VerificationBadge'
import CACBadge from '../components/professional/CACBadge'
import { propertyService } from '../services/propertyService'
import { professionalService } from '../services'
import { adminService } from '../services/adminService'
import type { Property, Professional, Report, AdminAction } from '../types'

type Tab = 'overview' | 'users' | 'listings' | 'professionals' | 'verification' | 'reports' | 'suspended' | 'log'

const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'listings', label: 'Listings', icon: Building2 },
  { id: 'professionals', label: 'Professionals', icon: Briefcase },
  { id: 'verification', label: 'CAC verification', icon: ShieldCheck },
  { id: 'reports', label: 'Reports', icon: Flag },
  { id: 'suspended', label: 'Suspended / Banned', icon: Ban },
  { id: 'log', label: 'Activity log', icon: ScrollText },
]

const mockUsers = [
  { id: 'u-1', name: 'Chidinma Okafor', email: 'chidinma@example.com', type: 'Buyer', status: 'active' as const },
  { id: 'u-2', name: 'Tunde Bakare', email: 'tunde@example.com', type: 'Buyer & Seller', status: 'active' as const },
  { id: 'u-3', name: 'seller_ade_props', email: 'ade@propsng.com', type: 'Seller', status: 'active' as const },
  { id: 'u-4', name: 'fastcash_lands', email: 'fastcash@mail.com', type: 'Seller', status: 'suspended' as const },
]

export default function Admin() {
  const [tab, setTab] = useState<Tab>('overview')
  const [stats, setStats] = useState<Awaited<ReturnType<typeof adminService.getStats>> | null>(null)
  const [properties, setProperties] = useState<Property[]>([])
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [log, setLog] = useState<AdminAction[]>([])
  const [users, setUsers] = useState(mockUsers)

  const refreshLog = () => adminService.getAuditLog().then(setLog)

  useEffect(() => {
    adminService.getStats().then(setStats)
    propertyService.list().then(setProperties)
    professionalService.list().then(setProfessionals)
    adminService.getReports().then(setReports)
    refreshLog()
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-ink">Admin dashboard</h1>
      <p className="mt-1 text-sm text-ink-light">
        Frontend moderation console — mock data only, no server-side authorization behind these actions yet.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors lg:w-full ${
                tab === t.id ? 'bg-ink text-parchment' : 'text-ink-light hover:bg-parchment-dim'
              }`}
            >
              <t.icon className="h-4 w-4" strokeWidth={1.75} />
              {t.label}
            </button>
          ))}
        </nav>

        <div>
          {tab === 'overview' && stats && (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard label="Total users" value={stats.totalUsers.toLocaleString()} icon={Users} accent="ink" />
              <StatCard label="Active sellers" value={stats.activeSellers} icon={Building2} accent="ochre" />
              <StatCard label="Active listings" value={stats.activeListings} icon={Building2} accent="verdant" />
              <StatCard label="Properties sold" value={stats.propertiesSold} icon={Check} accent="ink" />
              <StatCard label="Pending verification" value={stats.pendingVerification} icon={ShieldCheck} accent="ochre" />
              <StatCard label="Professionals" value={stats.professionals} icon={Briefcase} accent="ink" />
              <StatCard label="Open reports" value={stats.openReports} icon={Flag} accent="rust" />
              <StatCard label="Suspended users" value={stats.suspendedUsers} icon={Ban} accent="rust" />
            </div>
          )}

          {tab === 'users' && (
            <div className="overflow-x-auto rounded-md border border-stone-light bg-white">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead className="border-b border-stone-light bg-parchment-dim text-xs uppercase tracking-wide text-stone">
                  <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Action</th></tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-stone-light last:border-0">
                      <td className="px-4 py-3 font-medium text-ink">{u.name}</td>
                      <td className="px-4 py-3 text-ink-light">{u.email}</td>
                      <td className="px-4 py-3 text-ink-light">{u.type}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${u.status === 'active' ? 'bg-verdant-light text-verdant' : 'bg-rust-light text-rust'}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={async () => {
                            const next = u.status === 'active' ? 'suspended' : 'active'
                            await adminService.setUserStatus(u.name, next)
                            setUsers((list) => list.map((x) => (x.id === u.id ? { ...x, status: next } : x)))
                            refreshLog()
                          }}
                          className="rounded-full border border-stone-light px-3 py-1 text-xs font-medium text-ink-light hover:border-ochre-dark"
                        >
                          {u.status === 'active' ? 'Suspend' : 'Unsuspend'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'listings' && (
            <div className="space-y-3">
              {properties.map((p) => (
                <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-stone-light bg-white p-4">
                  <div className="flex items-center gap-3">
                    <img src={p.images[0]} alt="" className="h-12 w-16 rounded object-cover" />
                    <div>
                      <p className="font-medium text-ink">{p.title}</p>
                      <p className="text-xs text-stone">{p.city}, {p.state} · <VerificationBadge score={p.verificationScore} /></p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { adminService.approveListing(p.title); refreshLog() }} className="flex items-center gap-1 rounded-full bg-verdant-light px-3 py-1.5 text-xs font-medium text-verdant"><Check className="h-3.5 w-3.5" /> Approve</button>
                    <button onClick={() => { adminService.rejectListing(p.title); refreshLog() }} className="flex items-center gap-1 rounded-full bg-rust-light px-3 py-1.5 text-xs font-medium text-rust"><X className="h-3.5 w-3.5" /> Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'professionals' && (
            <div className="space-y-3">
              {professionals.map((p) => (
                <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-stone-light bg-white p-4">
                  <div>
                    <p className="font-medium text-ink">{p.name} <span className="font-normal text-stone">— {p.category}</span></p>
                    <p className="text-xs text-stone">{p.company}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { adminService.approveProfessional(p.name); refreshLog() }} className="flex items-center gap-1 rounded-full bg-verdant-light px-3 py-1.5 text-xs font-medium text-verdant"><Check className="h-3.5 w-3.5" /> Approve</button>
                    <button onClick={() => { adminService.rejectProfessional(p.name); refreshLog() }} className="flex items-center gap-1 rounded-full bg-rust-light px-3 py-1.5 text-xs font-medium text-rust"><X className="h-3.5 w-3.5" /> Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'verification' && (
            <div className="space-y-3">
              {professionals.filter((p) => p.cacNumber || p.cacStatus).length === 0 && (
                <p className="rounded-md border border-dashed border-stone-light p-6 text-center text-sm text-stone">
                  No CAC verification requests yet — they'll appear here once a professional submits a CAC number during onboarding.
                </p>
              )}
              {professionals.filter((p) => p.cacNumber || p.cacStatus).map((p) => (
                <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-stone-light bg-white p-4">
                  <div>
                    <p className="font-medium text-ink">{p.name} <span className="font-normal text-stone">— {p.cacNumber}</span></p>
                    <CACBadge status={p.cacStatus ?? 'submitted'} />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { adminService.setCACStatus(p.name, 'verified'); refreshLog() }} className="rounded-full bg-verdant-light px-3 py-1.5 text-xs font-medium text-verdant">Mark verified</button>
                    <button onClick={() => { adminService.setCACStatus(p.name, 'rejected'); refreshLog() }} className="rounded-full bg-rust-light px-3 py-1.5 text-xs font-medium text-rust">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'reports' && (
            <div className="space-y-3">
              {reports.map((r) => (
                <div key={r.id} className="rounded-md border border-stone-light bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-ink">{r.targetLabel} <span className="ml-1 rounded-full bg-parchment-dim px-2 py-0.5 text-xs text-ink-light">{r.type}</span></p>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${r.status === 'open' ? 'bg-ochre text-ink' : 'bg-verdant-light text-verdant'}`}>{r.status}</span>
                  </div>
                  <p className="mt-1 text-sm text-ink-light">{r.reason}</p>
                  <p className="mt-1 text-xs text-stone">Reported by {r.reportedBy}</p>
                  {r.status === 'open' && (
                    <div className="mt-3 flex gap-2">
                      <button onClick={async () => { await adminService.resolveReport(r.id, 'resolved'); setReports((rs) => rs.map((x) => (x.id === r.id ? { ...x, status: 'resolved' } : x))); refreshLog() }} className="rounded-full bg-verdant-light px-3 py-1.5 text-xs font-medium text-verdant">Resolve</button>
                      <button onClick={async () => { await adminService.resolveReport(r.id, 'dismissed'); setReports((rs) => rs.map((x) => (x.id === r.id ? { ...x, status: 'dismissed' } : x))); refreshLog() }} className="rounded-full bg-stone-light px-3 py-1.5 text-xs font-medium text-ink-light">Dismiss</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {tab === 'suspended' && (
            <div className="space-y-3">
              {users.filter((u) => u.status !== 'active').length === 0 ? (
                <p className="rounded-md border border-dashed border-stone-light p-6 text-center text-sm text-stone">No suspended or banned users.</p>
              ) : (
                users.filter((u) => u.status !== 'active').map((u) => (
                  <div key={u.id} className="flex items-center justify-between rounded-md border border-stone-light bg-white p-4">
                    <p className="font-medium text-ink">{u.name} <span className="ml-2 rounded-full bg-rust-light px-2 py-0.5 text-xs text-rust">{u.status}</span></p>
                    <button
                      onClick={async () => {
                        await adminService.setUserStatus(u.name, 'active')
                        setUsers((list) => list.map((x) => (x.id === u.id ? { ...x, status: 'active' } : x)))
                        refreshLog()
                      }}
                      className="rounded-full border border-stone-light px-3 py-1 text-xs font-medium text-ink-light hover:border-ochre-dark"
                    >
                      Restore
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'log' && (
            <div className="space-y-2">
              {log.length === 0 && <p className="rounded-md border border-dashed border-stone-light p-6 text-center text-sm text-stone">No admin actions yet this session.</p>}
              {log.map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-md border border-stone-light bg-white px-4 py-2.5 text-sm">
                  <span className="text-ink"><span className="font-medium">{a.action}</span> — {a.targetLabel}</span>
                  <span className="text-xs text-stone">{new Date(a.createdAt).toLocaleTimeString('en-NG')}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
