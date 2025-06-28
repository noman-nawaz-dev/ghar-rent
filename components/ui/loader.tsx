import { cn } from '@/lib/utils'

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

export function Loader({ size = 'md', className, text }: LoaderProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="flex items-center gap-2">
        <div
          className={cn(
            'border-2 border-current border-t-transparent rounded-full animate-spin',
            sizeClasses[size]
          )}
        />
        {text && <span className="text-sm">{text}</span>}
      </div>
    </div>
  )
}

export function FullScreenLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin" />
        <p className="text-lg">{text}</p>
      </div>
    </div>
  )
} 