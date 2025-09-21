import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltan las variables de entorno de Supabase. ' +
    'Asegúrate de que VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY estén configuradas.'
  )
}

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Funciones auxiliares para la base de datos

// Función para obtener el usuario actual
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

// Función para obtener el perfil completo del usuario
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error) throw error
  return data
}

// Función para actualizar el perfil del usuario
export const updateUserProfile = async (userId, profileData) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(profileData)
    .eq('user_id', userId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Funciones para eventos
export const getEvents = async (filters = {}) => {
  let query = supabase
    .from('events')
    .select(`
      *,
      venues (
        id,
        name,
        address,
        capacity
      ),
      event_images (
        image_url,
        alt_text,
        is_primary
      )
    `)
    .eq('status', 'active')
    .gte('event_date', new Date().toISOString())
    .order('event_date', { ascending: true })

  // Aplicar filtros opcionales
  if (filters.category) {
    query = query.eq('category', filters.category)
  }
  
  if (filters.city) {
    query = query.eq('venues.city', filters.city)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

// Función para obtener un evento específico
export const getEvent = async (eventId) => {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      venues (
        id,
        name,
        address,
        city,
        capacity,
        venue_layout
      ),
      event_images (
        image_url,
        alt_text,
        is_primary
      ),
      ticket_types (
        id,
        name,
        price,
        available_quantity,
        max_per_purchase,
        description
      )
    `)
    .eq('id', eventId)
    .single()

  if (error) throw error
  return data
}

// Funciones para autenticación
export const signUp = async (email, password, userData = {}) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  })
  
  if (error) throw error
  return data
}

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Función para restablecer contraseña
export const resetPassword = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  })
  
  if (error) throw error
}

export default supabase