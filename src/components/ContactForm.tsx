import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { CONTACT_LIMITS, type ContactErrorCode } from '../api/contract'
import { siteConfig } from '../data/siteConfig'
import { useI18n } from '../i18n/useI18n'
import { buildContactRequest, submitContact } from '../lib/contactClient'
import { validateContact, type ContactField, type ContactFormErrors, type ContactInput } from '../lib/validation'
import { whatsappLink } from '../lib/whatsapp'
import { Icon } from './Icon'

type Status = 'idle' | 'sending' | 'success' | 'error'

// StrictMode (solo en desarrollo) ejecuta los efectos dos veces: con esto el aviso sale una sola vez por carga.
let warnedNoEndpoint = false

const EMPTY: ContactInput = { name: '', email: '', phone: '', message: '' }
const ORDER: ContactField[] = ['name', 'email', 'phone', 'message']

// Límites que se muestran en los mensajes de error ({min} y {max}). Salen del contrato, no se repiten acá.
const LIMITS: Record<ContactField, { min: number; max: number }> = {
  name: CONTACT_LIMITS.name,
  email: { min: 0, max: CONTACT_LIMITS.email.max },
  phone: { min: 0, max: CONTACT_LIMITS.phone.max },
  message: CONTACT_LIMITS.message,
}

// 16 px como mínimo: con menos, iOS hace zoom al enfocar el campo.
const control =
  'w-full rounded-lg border border-mortar bg-canvas px-4 text-[16px] font-medium text-ink transition focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none aria-invalid:border-primary'

function Field({ id, label, error, className = '', children }: { id: string; label: string; error?: string; className?: string; children: ReactNode }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={id} className="kicker text-ink-soft">
        {label}
      </label>
      {children}
      {/* La región existe siempre (vacía) para que los lectores de pantalla anuncien el error cuando aparece. */}
      <div aria-live="polite">
        {error && (
          <p id={`${id}-error`} className="flex items-start gap-1 text-small font-semibold text-primary-deep">
            <Icon name="error" className="!text-[16px] leading-5" />
            {error}
          </p>
        )}
      </div>
    </div>
  )
}

const link =
  'inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-2 hover:text-primary-deep'

/**
 * Formulario de contacto. Arma un `ContactRequest` y lo envía con `fetch` (POST, JSON) al backend que
 * está en `VITE_CONTACT_ENDPOINT`; la respuesta esperada es un `ContactResponse` (ver `src/api/contract.ts`).
 * Sin endpoint no finge enviar: en desarrollo avisa y deshabilita el envío, y en producción `Contact` ni lo muestra.
 */
export function ContactForm({ endpoint }: { endpoint?: string }) {
  const { t, lang } = useI18n()
  const [values, setValues] = useState<ContactInput>(EMPTY)
  const [website, setWebsite] = useState('') // honeypot
  const [errors, setErrors] = useState<ContactFormErrors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [failure, setFailure] = useState<ContactErrorCode>('unavailable')
  const fields = useRef<Partial<Record<ContactField, HTMLElement | null>>>({})
  const sending = useRef(false) // evita el doble envío aunque el estado todavía no se haya actualizado
  const pending = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!endpoint && import.meta.env.DEV && !warnedNoEndpoint) {
      warnedNoEndpoint = true
      console.warn('Falta VITE_CONTACT_ENDPOINT: el formulario de contacto no puede enviar. Ver .env.example.')
    }
  }, [endpoint])

  // Si el componente se desmonta con un envío en curso, se corta.
  useEffect(() => () => pending.current?.abort(), [])

  if (!endpoint && !import.meta.env.DEV) return null

  const change = (field: ContactField) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
    if (!sending.current) setStatus('idle')
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!endpoint || sending.current) return

    const found = validateContact(values)
    // flushSync: los errores ya están en el DOM (con `aria-invalid`) cuando el foco llega al campo.
    flushSync(() => setErrors(found))
    const first = ORDER.find((f) => found[f])
    if (first) {
      fields.current[first]?.focus()
      return
    }

    // Honeypot: una persona no ve este campo. Si viene lleno es un bot: no se envía nada y se le muestra el
    // mismo «éxito», así no aprende que lo detectamos. (La defensa real es la del servidor.)
    if (website) {
      setValues(EMPTY)
      setWebsite('')
      setStatus('success')
      return
    }

    sending.current = true
    setStatus('sending')
    const controller = new AbortController()
    pending.current = controller
    const result = await submitContact(endpoint, buildContactRequest(values, lang), { signal: controller.signal })
    sending.current = false
    if (controller.signal.aborted) return
    if (result.ok) {
      setValues(EMPTY)
      setStatus('success')
    } else {
      setFailure(result.error)
      setStatus('error')
    }
  }

  const fieldProps = (field: ContactField, id: string) => ({
    id,
    ref: (el: HTMLElement | null) => {
      fields.current[field] = el
    },
    'aria-invalid': errors[field] ? (true as const) : undefined,
    'aria-describedby': errors[field] ? `${id}-error` : undefined,
    value: values[field],
    onChange: change(field),
  })
  const errorText = (field: ContactField) => {
    const code = errors[field]
    return code ? t(`contact.form.error.${code}`, LIMITS[field]) : undefined
  }

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-mortar bg-sand p-6 shadow-soft md:p-8">
      <h3 className="font-display text-card text-primary">{t('contact.form.title')}</h3>

      <form onSubmit={onSubmit} noValidate aria-label={t('contact.form.label')} className="relative flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field id="contact-name" label={t('contact.form.name')} error={errorText('name')}>
            <input
              {...fieldProps('name', 'contact-name')}
              type="text"
              autoComplete="name"
              required
              minLength={CONTACT_LIMITS.name.min}
              maxLength={CONTACT_LIMITS.name.max}
              className={`${control} h-12`}
            />
          </Field>
          <Field id="contact-email" label={t('contact.form.email')} error={errorText('email')}>
            <input
              {...fieldProps('email', 'contact-email')}
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              maxLength={CONTACT_LIMITS.email.max}
              className={`${control} h-12`}
            />
          </Field>
          <Field id="contact-phone" label={t('contact.form.phone')} error={errorText('phone')} className="md:col-span-2">
            <input
              {...fieldProps('phone', 'contact-phone')}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={CONTACT_LIMITS.phone.max}
              className={`${control} h-12`}
            />
          </Field>
          <Field id="contact-message" label={t('contact.form.message')} error={errorText('message')} className="md:col-span-2">
            <textarea
              {...fieldProps('message', 'contact-message')}
              rows={5}
              required
              minLength={CONTACT_LIMITS.message.min}
              maxLength={CONTACT_LIMITS.message.max}
              className={`${control} min-h-36 resize-y py-3`}
            />
          </Field>
        </div>

        {/* Honeypot: fuera de pantalla, sin foco y oculto a los lectores de pantalla. Una persona nunca lo completa. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <input
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={!endpoint || status === 'sending'}
            className="inline-flex h-12 items-center justify-center gap-2 rounded bg-primary px-6 text-label whitespace-nowrap text-canvas shadow-soft transition-colors hover:bg-primary-deep disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Icon name="send" className="!text-[20px]" />
            {status === 'sending' ? t('contact.form.sending') : t('contact.form.submit')}
          </button>
          {/* Solo en desarrollo y sin endpoint: la variable que falta (ver .env.example). */}
          {!endpoint && import.meta.env.DEV && (
            <p className="flex items-center gap-1 rounded border border-dashed border-primary px-3 py-2 font-mono text-small text-ink-soft">
              <Icon name="warning" className="!text-[16px] text-primary" />
              VITE_CONTACT_ENDPOINT
            </p>
          )}
        </div>

        <p className="text-small text-ink-soft">{t('contact.form.privacy')}</p>

        <div role="status">
          {status === 'success' && (
            <p className="flex items-center gap-2 text-body font-semibold text-tertiary">
              <Icon name="check_circle" className="!text-[20px]" />
              {t('contact.form.success')}
            </p>
          )}
          {status === 'error' && (
            <div className="flex flex-col items-start gap-1 text-body text-ink-soft">
              <p className="flex items-center gap-2 font-semibold text-primary-deep">
                <Icon name="error" className="!text-[20px]" />
                {t(`contact.form.failed.${failure}`)}
              </p>
              <p>{t('contact.form.failed.alternative')}</p>
              <div className="flex flex-wrap gap-x-6">
                <a
                  href={whatsappLink(t('whatsapp.generic', { name: siteConfig.name }))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={link}
                >
                  {t('contact.whatsapp')}
                </a>
                {/* Solo informativo: el correo no es un enlace. */}
                <span className="inline-flex min-h-11 items-center font-semibold break-all text-ink">
                  {siteConfig.contact.email}
                </span>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
