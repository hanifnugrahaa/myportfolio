import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Terminal } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] w-full flex items-center justify-center p-8 font-mono bg-[#050505] text-[#00ff41] rounded-lg border border-[#00ff41]/30 my-10">
          <div className="max-w-2xl w-full">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#00ff41]/30">
              <Terminal className="w-8 h-8 animate-pulse text-[#00ff41]" />
              <h2 className="text-2xl font-bold tracking-widest text-red-500">KERNEL_PANIC</h2>
            </div>
            
            <p className="mb-4 text-lg">
              <span className="text-gray-500">root@system:~$</span> UI layer module failed to load.
            </p>
            
            <div className="bg-[#00ff41]/5 p-4 rounded mb-6 overflow-x-auto border border-[#00ff41]/20">
              <code className="text-sm text-red-400 whitespace-pre-wrap">
                {this.state.error?.toString() || 'Unknown Exception'}
              </code>
            </div>
            
            <button
              className="px-6 py-2 bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41] hover:bg-[#00ff41] hover:text-black transition-colors duration-300 uppercase tracking-widest text-sm font-bold focus:outline-none"
              onClick={() => window.location.reload()}
            >
              [ Reboot_System ]
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
