import { useNavigate } from 'react-router-dom'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen w-screen bg-bg-secondary flex items-center justify-center p-6 text-left select-none overflow-hidden relative">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] h-[50vh] w-[50vw] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[50vh] w-[50vw] rounded-full bg-accent-teal/5 blur-[120px]" />

      <Card className="max-w-md w-full rounded-[28px] border border-border-subtle bg-surface p-6 md:p-8 shadow-high space-y-6 z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-accent-amber/10 text-accent-amber flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">404 - Page Not Found</h3>
            <p className="text-[10px] text-text-secondary mt-0.5">The requested page does not exist or has been moved.</p>
          </div>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed">
          Verify the address bar URL or return to the main dashboard workspace area below.
        </p>

        <div className="flex gap-3 pt-2">
          <Button onClick={() => navigate('/')} className="flex-1 gap-1.5 rounded-xl text-xs py-2">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  )
}
