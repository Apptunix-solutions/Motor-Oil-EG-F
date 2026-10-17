import type { App } from 'vue'
import { shallowRef } from 'vue'

export type AppErrorKind = 'not-found' | 'network' | 'validation' | 'unexpected'

export interface AppError {
  kind: AppErrorKind
  status: number
  code: string
  title: string
  message: string
}

export const currentError = shallowRef<AppError | null>(null)

export function normalizeError(error: unknown, context = 'application'): AppError {
  if (typeof error === 'object' && error !== null && 'kind' in error) {
    const candidate = error as Partial<AppError>
    if (
      candidate.kind === 'not-found' ||
      candidate.kind === 'network' ||
      candidate.kind === 'validation' ||
      candidate.kind === 'unexpected'
    ) {
      return {
        kind: candidate.kind,
        status: candidate.status ?? 500,
        code: candidate.code ?? 'ZYT-500',
        title: candidate.title ?? 'هناك شيء يحتاج انتباهاً',
        message:
          candidate.message ?? 'تعذّر إتمام الطلب. حاول مرة أخرى أو ارجع إلى الصفحة الرئيسية.',
      }
    }
  }

  const isNetworkError = error instanceof TypeError && /fetch|network|load/i.test(error.message)
  return isNetworkError
    ? {
        kind: 'network',
        status: 503,
        code: 'ZYT-503',
        title: 'انقطعت الاتصال',
        message: 'تعذّر الوصول إلى ZaytStore الآن. تحقق من اتصالك بالإنترنت وحاول مجدداً.',
      }
    : {
        kind: 'unexpected',
        status: 500,
        code: 'ZYT-500',
        title: 'هناك شيء يحتاج انتباهاً',
        message: `حدثت مشكلة غير متوقعة في ZaytStore (${context}). بياناتك محفوظة — حاول مرة أخرى أو ارجع للرئيسية.`,
      }
}

export function createNotFoundError(): AppError {
  return {
    kind: 'not-found',
    status: 404,
    code: 'ZYT-404',
    title: 'الصفحة غير موجودة',
    message: 'هذا الرابط غير موجود في ZaytStore. تصفّح المنتجات أو المتاجر من الصفحة الرئيسية.',
  }
}

export function reportError(error: unknown, context?: string): AppError {
  const normalized = normalizeError(error, context)
  currentError.value = normalized
  console.error(`[ZaytStore] ${context ?? 'application'} error`, error)
  return normalized
}

export function clearError() {
  currentError.value = null
}

export function installGlobalErrorHandling(app: App) {
  app.config.errorHandler = (error, _instance, info) => {
    reportError(error, `Vue ${info}`)
  }

  window.addEventListener('error', (event) => {
    if (event.error) reportError(event.error, 'browser')
  })
  window.addEventListener('unhandledrejection', (event) => {
    reportError(event.reason, 'promise')
  })
}
