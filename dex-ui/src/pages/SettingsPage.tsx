import { Clock3, Flame, Percent } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

export function SettingsPage() {
  const [gas, setGas] = useState<'Standard' | 'Fast' | 'Instant'>('Fast')
  const [slippage, setSlippage] = useState('0.50')
  const [deadline, setDeadline] = useState('20')

  return (
    <div>
      <PageHeader title="Settings" subtitle="Gas, slippage and deadline settings (mirrors the settings cards in your diagram)." />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <div className="card-header">
            <div className="card-title">Trading Settings</div>
            <Badge tone="indigo">Profile</Badge>
          </div>

          <div className="space-y-4 p-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-indigo-600" />
                <div className="text-sm font-extrabold text-slate-900">Gas Settings</div>
              </div>
              <div className="mt-3 grid gap-2 md:grid-cols-3">
                {(['Standard', 'Fast', 'Instant'] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGas(g)}
                    className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                      gas === g ? 'border-indigo-300 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-indigo-600" />
                <div className="text-sm font-extrabold text-slate-900">Slippage Settings</div>
              </div>
              <div className="mt-3">
                <Input value={slippage} onChange={(e) => setSlippage(e.target.value)} placeholder="0.50" endAdornment={<span className="text-xs font-semibold text-slate-500">%</span>} />
              </div>
              <div className="mt-2 text-xs text-slate-500">Tip: keep it low to reduce risk of bad fills.</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-indigo-600" />
                <div className="text-sm font-extrabold text-slate-900">Transaction Deadline</div>
              </div>
              <div className="mt-3">
                <Input value={deadline} onChange={(e) => setDeadline(e.target.value)} placeholder="20" endAdornment={<span className="text-xs font-semibold text-slate-500">min</span>} />
              </div>
              <div className="mt-2 text-xs text-slate-500">Transactions beyond this time may revert.</div>
            </div>

            <Button className="w-full">Save Settings (demo)</Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Enhanced Settings</div>
              <Badge tone="slate">Advanced</Badge>
            </div>
            <div className="space-y-2 p-4 text-sm text-slate-600">
              {['MEV-protection', 'RFQ / Private orderflow', 'Whitelist testing'].map((x) => (
                <div key={x} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <div className="font-semibold text-slate-900">{x}</div>
                  <Badge tone="green">On</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

