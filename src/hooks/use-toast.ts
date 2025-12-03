import { ref } from 'vue'

export type ToastVariant = 'default' | 'destructive'

export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

const toasts = ref<Toast[]>([])

let toastCounter = 0

export function useToast() {
  function toast({
    title,
    description,
    variant = 'default',
    duration = 3000
  }: Omit<Toast, 'id'>) {
    const id = `toast-${++toastCounter}`
    
    const newToast: Toast = {
      id,
      title,
      description,
      variant,
      duration
    }

    toasts.value.push(newToast)

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        dismiss(id)
      }, duration)
    }

    return {
      id,
      dismiss: () => dismiss(id),
      update: (props: Partial<Toast>) => update(id, props)
    }
  }

  function dismiss(id: string) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  function update(id: string, props: Partial<Toast>) {
    const toast = toasts.value.find(t => t.id === id)
    if (toast) {
      Object.assign(toast, props)
    }
  }

  return {
    toast,
    toasts,
    dismiss
  }
}