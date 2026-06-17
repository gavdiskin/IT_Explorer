function urlBase64ToUint8Array(base64: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(b64)
  return new Uint8Array([...raw].map(c => c.charCodeAt(0)))
}

export async function registerSW(): Promise<ServiceWorkerRegistration | null> {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return null
  try {
    return await navigator.serviceWorker.register('/sw.js')
  } catch {
    return null
  }
}

export async function getPushSubscription(reg: ServiceWorkerRegistration): Promise<PushSubscription | null> {
  return reg.pushManager.getSubscription()
}

export async function subscribeToPush(reg: ServiceWorkerRegistration): Promise<PushSubscription | null> {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  if (!publicKey) { console.warn('[push] NEXT_PUBLIC_VAPID_PUBLIC_KEY not set'); return null }
  try {
    return await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    })
  } catch {
    return null
  }
}

export function serializeSubscription(sub: PushSubscription) {
  const keys = sub.toJSON().keys ?? {}
  return { endpoint: sub.endpoint, p256dh: keys.p256dh ?? '', auth: keys.auth ?? '' }
}
