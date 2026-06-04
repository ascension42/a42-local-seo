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
    .order('is_premium', { ascending: false })
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)
  return (data ?? []) as Practitioner[]
}

export async function getFeaturedPractitioners(): Promise<Practitioner[]> {
  const all = await getPractitioners()
  return all.filter((p) => p.is_premium).slice(0, 3)
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
    .select('*')
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
