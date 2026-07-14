"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error captured by React ErrorBoundary component:", error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-6 border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/30 rounded-2xl text-center space-y-4 max-w-md mx-auto my-4 shadow-sm animate-in fade-in duration-200">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 mx-auto">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-red-800 dark:text-red-300 font-sans">Section Render Failed</h3>
            <p className="text-xs text-red-700 dark:text-red-400 mt-1 font-sans">
              An unexpected error occurred while loading this section. Stack traces are suppressed.
            </p>
          </div>
          <Button 
            onClick={this.handleReset} 
            size="sm" 
            variant="outline"
            className="text-red-800 border-red-300 hover:bg-red-100 font-sans font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Retry Section
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
