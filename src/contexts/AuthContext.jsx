import { createContext, useEffect, useState } from 'react'
import { supabase, getUserProfile, updateUserProfile } from '../lib/supabase'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    // Obtener sesión inicial
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        
        setSession(session)
        if (session?.user) {
          setUser(session.user)
          // Obtener perfil del usuario
          try {
            const userProfile = await getUserProfile(session.user.id)
            setProfile(userProfile)
          } catch (profileError) {
            console.log('No se pudo cargar el perfil del usuario:', profileError.message)
          }
        }
      } catch (error) {
        console.error('Error al obtener la sesión:', error.message)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session)
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          try {
            const userProfile = await getUserProfile(session.user.id)
            setProfile(userProfile)
          } catch (error) {
            console.log('No se pudo cargar el perfil del usuario:', error.message)
            setProfile(null)
          }
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  // Función para actualizar el perfil
  const updateProfile = async (profileData) => {
    if (!user) throw new Error('Usuario no autenticado')
    
    const updatedProfile = await updateUserProfile(user.id, profileData)
    setProfile(updatedProfile)
    return updatedProfile
  }

  // Función para cerrar sesión
  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setSession(null)
  }

  const value = {
    user,
    profile,
    session,
    loading,
    updateProfile,
    logout,
    // Funciones auxiliares
    isAuthenticated: !!user,
    isAdmin: profile?.role === 'admin',
    isOrganizer: profile?.role === 'organizer',
    isAgent: profile?.role === 'agent',
    isClient: profile?.role === 'client'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext