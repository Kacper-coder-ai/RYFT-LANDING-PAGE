import { SUPPORT_EMAIL } from '../config/contact'

const WEB3FORMS_URL = 'https://api.web3forms.com/submit'

export function isWeb3FormsConfigured(): boolean {
  return Boolean(import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim())
}

export async function submitSupportMessage(input: {
  name: string
  email: string
  message: string
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim() ?? ''

  try {
    const res = await fetch(WEB3FORMS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `RYFT — Support from ${input.email}`,
        from_name: input.name.trim() || input.email,
        name: input.name.trim(),
        email: input.email.trim(),
        message: input.message.trim(),
      }),
    })
    const data = (await res.json()) as { success?: boolean; message?: string }
    if (!res.ok || !data.success) {
      return {
        ok: false,
        error: data.message ?? 'Something went wrong. Please try again.',
      }
    }
    return { ok: true }
  } catch {
    return { ok: false, error: 'Network error. Check your connection and try again.' }
  }
}

/** Opens the user’s mail client with the same content (fallback when Web3Forms key is missing). */
export function openSupportMailtoFallback(input: {
  name: string
  email: string
  message: string
}): void {
  const subject = encodeURIComponent('RYFT — Support request')
  const lines = [
    input.name.trim() ? `Name: ${input.name.trim()}` : null,
    `Email: ${input.email.trim()}`,
    '',
    input.message.trim(),
  ].filter(Boolean)
  const body = encodeURIComponent(lines.join('\n'))
  window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`
}
