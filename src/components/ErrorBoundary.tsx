import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error inside SemesterOS:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/semesteros/'
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-screen bg-bg-secondary flex items-center justify-center p-6 text-left select-none">
          <Card className="max-w-md w-full rounded-[28px] border border-border-subtle bg-surface p-6 md:p-8 shadow-high space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-accent-rose/10 text-accent-rose flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-primary">Something went wrong</h3>
                <p className="text-[10px] text-text-secondary mt-0.5">SemesterOS encountered an unexpected error.</p>
              </div>
            </div>

            <div className="rounded-xl border border-border-subtle bg-bg-secondary/40 p-4 font-mono text-[9px] text-text-secondary leading-normal whitespace-pre-wrap overflow-x-auto max-h-40">
              {this.state.error?.toString()}
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={this.handleReset} className="flex-1 rounded-xl text-xs py-2">
                Reload Application
              </Button>
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
