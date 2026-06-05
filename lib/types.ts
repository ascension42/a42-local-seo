export type ConsultationMode = 'cabinet' | 'online' | 'both'

export interface City {
  id: string
  name: string
  slug: string
  region: string | null
  country: string
}

export interface Specialty {
  id: string
  name: string
  slug: string
  description: string | null
}

export interface PractitionerTag {
  id: string
  practitioner_id: string
  label: string
}

export interface Testimonial {
  id: string
  practitioner_id: string
  author_name: string
  author_location: string | null
  content: string
  date: string | null
}

export interface Practitioner {
  id: string
  slug: string
  first_name: string
  last_name: string
  city_id: string
  specialty_id: string
  bio: string | null
  photo_url: string | null
  certification: string | null
  school: string | null
  years_active: number | null
  hourly_rate: number | null
  consultation_mode: ConsultationMode
  neighborhood: string | null
  website_url: string | null
  doctolib_url: string | null
  booking_url: string | null
  instagram_url: string | null
  facebook_url: string | null
  is_premium: boolean
  is_verified: boolean
  accepting_patients: boolean
  lat?: number | null
  lng?: number | null
  created_at: string
  updated_at: string
  practitioner_tags?: PractitionerTag[]
  testimonials?: Testimonial[]
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content: string | null
  cover_url: string | null
  city_id: string | null
  specialty_id: string | null
  reading_time_min: number | null
  published_at: string | null
  updated_at: string
}
