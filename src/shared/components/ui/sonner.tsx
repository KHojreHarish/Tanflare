import { Toaster as Sonner } from 'sonner'
import type { ToasterProps } from 'sonner'

// Import Sonner styles
import 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="top-right"
      expand={true}
      richColors={true}
      closeButton={true}
      style={
        {
          '--normal-bg': 'hsl(var(--popover))',
          '--normal-text': 'hsl(var(--popover-foreground))',
          '--normal-border': 'hsl(var(--border))',
          '--success-bg': 'hsl(var(--popover))',
          '--success-text': 'hsl(var(--popover-foreground))',
          '--success-border': 'hsl(var(--border))',
          '--error-bg': 'hsl(var(--destructive))',
          '--error-text': 'hsl(var(--destructive-foreground))',
          '--error-border': 'hsl(var(--destructive))',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
