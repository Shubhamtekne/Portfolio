import { Component } from 'react'
import Button from '../ui/Button'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-bg px-6">
          <div className="max-w-md text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
              <span className="text-2xl text-red-400 font-mono">!</span>
            </div>
            <h1 className="font-display font-bold text-2xl text-text mb-2">Something went wrong</h1>
            <p className="text-muted text-sm mb-6 leading-relaxed">
              An unexpected error occurred. It's probably not your fault.
            </p>
            {this.props.fallback || (
              <div className="space-y-3">
                <Button onClick={() => window.location.reload()} variant="primary">
                  Reload page
                </Button>
                <div>
                  <Button
                    href="/"
                    variant="ghost"
                    size="sm"
                  >
                    Go home
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
