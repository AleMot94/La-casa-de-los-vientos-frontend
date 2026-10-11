import { CONTACT_SUBJECT, type ContactErrorCode, type ContactRequest, type ContactResponse, type Lang } from '../api/contract'
import type { ContactInput } from './validation'

/**
 * Cliente del formulario de contacto. Hace un `POST` JSON con un `ContactRequest` al endpoint que tu backend
 * expone y espera como respuesta un `ContactResponse` (ver `src/api/contract.ts`). Nada más: sin servicios de terceros.
 */

/**
 * Endpoint del backend (`VITE_CONTACT_ENDPOINT`). Vite reemplaza la variable por su valor al COMPILAR, así que
 * queda escrita en el JS que baja cualquier visitante y cambiarla exige volver a compilar y desplegar.
 * Sin valor: en desarrollo se avisa, y en producción el formulario no se muestra.
 */
export function contactEndpoint(): string | undefined {
  return import.meta.env.VITE_CONTACT_ENDPOINT?.trim() || undefined
}

/** Arma lo que se envía: sin espacios en los bordes, sin teléfono si quedó vacío, con el idioma y el asunto fijo. */
export function buildContactRequest(input: ContactInput, language: Lang): ContactRequest {
  const phone = input.phone.trim()
  return {
    name: input.name.trim(),
    email: input.email.trim(),
    ...(phone ? { phone } : {}),
    message: input.message.trim(),
    language,
    subject: CONTACT_SUBJECT,
  }
}

const ERROR_CODES: readonly ContactErrorCode[] = ['invalid', 'rate_limited', 'unavailable']

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null

/**
 * Interpreta la respuesta HTTP. Solo se confía en un cuerpo que cumpla el contrato; si el servidor (o un proxy
 * delante) devuelve otra cosa, se decide por el código HTTP y nunca se da por enviado algo que no se confirmó.
 */
export function parseContactResponse(status: number, body: unknown): ContactResponse {
  if (isObject(body)) {
    if (body.ok === true && status >= 200 && status < 300) return { ok: true }
    if (body.ok === false && ERROR_CODES.includes(body.error as ContactErrorCode)) {
      const fields = Array.isArray(body.fields) ? body.fields.filter((f): f is string => typeof f === 'string') : undefined
      return { ok: false, error: body.error as ContactErrorCode, ...(fields ? { fields } : {}) }
    }
  }
  if (status === 400) return { ok: false, error: 'invalid' }
  if (status === 429) return { ok: false, error: 'rate_limited' }
  return { ok: false, error: 'unavailable' }
}

interface SubmitOptions {
  signal?: AbortSignal
  /** Solo para las pruebas. */
  fetchFn?: typeof fetch
}

/** Envía la consulta. Nunca lanza: una red caída, un corte o un timeout se informan como `unavailable`. */
export async function submitContact(
  endpoint: string,
  request: ContactRequest,
  { signal, fetchFn = fetch }: SubmitOptions = {},
): Promise<ContactResponse> {
  try {
    const response = await fetchFn(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(request),
      // Si el backend no responde en 15 s, se corta: el botón no puede quedar «Enviando…» para siempre.
      signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(15_000)]) : AbortSignal.timeout(15_000),
    })
    let body: unknown
    try {
      body = await response.json()
    } catch {
      body = undefined // no era JSON (por ejemplo, la página de error de un proxy)
    }
    return parseContactResponse(response.status, body)
  } catch {
    return { ok: false, error: 'unavailable' }
  }
}
