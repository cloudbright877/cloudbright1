// Simple toast implementation for MVP
// For production, consider using react-hot-toast or shadcn/ui toast

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export function useToast() {
  const toast = (props: ToastProps) => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      const prefix = props.variant === 'destructive' ? '❌' : '✅'
      console.log(`${prefix} [Toast] ${props.title}`, props.description)
    }

    // Show browser alert as fallback (temporary MVP solution)
    if (typeof window !== 'undefined') {
      const message = [props.title, props.description].filter(Boolean).join('\n')

      if (props.variant === 'destructive') {
        // Error message
        alert('❌ ' + message)
        console.error(message)
      } else {
        // Success message
        alert('✅ ' + message)
        console.info(message)
      }
    }
  }

  return { toast }
}
