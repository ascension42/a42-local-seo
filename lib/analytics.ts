import posthog from 'posthog-js'

// Typage strict des events — ajouter ici quand on crée un nouvel event
export type AnalyticsEvent =
  | { name: 'hero_cta_practitioners_clicked'; properties?: Record<string, never> }
  | { name: 'hero_cta_inscription_clicked'; properties?: Record<string, never> }
  | { name: 'inscription_plan_cta_clicked'; properties: { plan: 'standard' | 'premium'; location: 'cards' | 'bottom_cta' } }
  | { name: 'inscription_form_started'; properties: { plan: 'standard' | 'premium' } }
  | { name: 'inscription_form_submitted'; properties: { plan: 'standard' | 'premium'; specialty: string } }
  | { name: 'inscription_form_error'; properties: { plan: 'standard' | 'premium'; error: string } }
  | { name: 'booking_button_clicked'; properties: { practitioner_id: string } }
  | { name: 'practitioner_profile_viewed'; properties: { practitioner_id: string; referrer?: string | null } }

export function track(event: AnalyticsEvent) {
  if (typeof window === 'undefined') return
  posthog.capture(event.name, event.properties)
}
