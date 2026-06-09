import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/lib/config'
import type { Practitioner, BlogPost } from '@/lib/types'

export async function getPractitioners(): Promise<Practitioner[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('practitioners')
    .select(`
      *,
      practitioner_tags ( id, label ),
      cities!inner ( slug ),
      specialties!inner ( slug )
    `)
    .eq('cities.slug', siteConfig.city)
    .eq('specialties.slug', siteConfig.specialty)
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)
  return (data ?? []) as Practitioner[]
}

export async function getFeaturedPractitioners(): Promise<Practitioner[]> {
  const all = await getPractitioners()
  return all.slice(0, 3)
}

export async function getRotatingPractitioners(count: number = 3): Promise<Practitioner[]> {
  const all = await getPractitioners()
  if (all.length <= count) return all

  // Offset déterministe basé sur le jour (change chaque jour)
  const dayOffset = Math.floor(Date.now() / 86400000) % all.length

  // Rotation circulaire
  const rotated = [...all.slice(dayOffset), ...all.slice(0, dayOffset)]
  return rotated.slice(0, count)
}

export async function getPractitionerBySlug(slug: string): Promise<Practitioner | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('practitioners')
    .select(`
      *,
      practitioner_tags ( id, label ),
      testimonials ( id, author_name, author_location, content, date )
    `)
    .eq('slug', slug)
    .single()

  if (error) return null
  return data as Practitioner
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*, cities!inner(slug), specialties!inner(slug)')
    .eq('cities.slug', siteConfig.city)
    .eq('specialties.slug', siteConfig.specialty)
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as BlogPost[]
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) return null
  return data as BlogPost
}

export async function getHeroStats(): Promise<{ practitionerCount: number; neighborhoodCount: number; tagCount: number }> {
  const supabase = await createClient()
  const { data: practitioners } = await supabase
    .from('practitioners')
    .select('neighborhood, practitioner_tags(label), cities!inner(slug), specialties!inner(slug)')
    .eq('cities.slug', siteConfig.city)
    .eq('specialties.slug', siteConfig.specialty)

  const all = practitioners ?? []
  const neighborhoods = new Set(all.map((p: { neighborhood: string | null }) => p.neighborhood).filter(Boolean))
  const tags = new Set(
    all.flatMap((p: { practitioner_tags?: { label: string }[] }) => (p.practitioner_tags ?? []).map((t) => t.label))
  )
  return { practitionerCount: all.length, neighborhoodCount: neighborhoods.size, tagCount: tags.size }
}

export async function getCityCenter(): Promise<{ lat: number; lng: number }> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('cities')
    .select('lat, lng')
    .eq('slug', siteConfig.city)
    .single()
  return { lat: data?.lat ?? 44.8378, lng: data?.lng ?? -0.5792 }
}

export interface NetworkCity {
  id: string
  name: string
  slug: string
  lat: number
  lng: number
  specialty: string
  domain: string
  practitioner_count: number
  is_live: boolean
}

export async function getNetworkCities(): Promise<NetworkCity[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('network_cities')
    .select('*')
    .order('is_live', { ascending: false })
    .order('name')
  if (error) throw new Error(error.message)
  return (data ?? []) as NetworkCity[]
}
