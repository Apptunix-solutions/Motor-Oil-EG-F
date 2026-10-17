import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastItem {
  id: string
  title: string
  description?: string
  type: ToastType
  duration?: number
}

const toasts = ref<ToastItem[]>([])

export function useToast() {
  function add(item: Omit<ToastItem, 'id'>) {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9)
    const toast: ToastItem = { ...item, id }
    toasts.value.unshift(toast)

    const dur = item.duration ?? 4000
    if (dur > 0) {
      setTimeout(() => {
        dismiss(id)
      }, dur)
    }
    return id
  }

  function dismiss(id: string) {
    const idx = toasts.value.findIndex((t) => t.id === id)
    if (idx !== -1) {
      toasts.value.splice(idx, 1)
    }
  }

  function success(title: string, description?: string) {
    return add({ title, description, type: 'success' })
  }

  function error(title: string, description?: string) {
    return add({ title, description, type: 'error' })
  }

  function info(title: string, description?: string) {
    return add({ title, description, type: 'info' })
  }

  function warning(title: string, description?: string) {
    return add({ title, description, type: 'warning' })
  }

  return {
    toasts,
    add,
    dismiss,
    success,
    error,
    info,
    warning,
  }
}

export const toast = {
  success: (title: string, desc?: string) => useToast().success(title, desc),
  error: (title: string, desc?: string) => useToast().error(title, desc),
  info: (title: string, desc?: string) => useToast().info(title, desc),
  warning: (title: string, desc?: string) => useToast().warning(title, desc),
  dismiss: (id: string) => useToast().dismiss(id),
}
