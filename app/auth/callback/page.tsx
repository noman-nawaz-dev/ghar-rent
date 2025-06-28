'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSupabaseBrowser } from '@/lib/SupabaseClient'
import { useToast } from '@/hooks/use-toast'

function AuthCallbackContent() {
  const supabase = useSupabaseBrowser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [processed, setProcessed] = useState(false)

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        toast({ title: 'Error', description: sessionError.message, variant: 'destructive' })
        router.push('/auth/login')
        return
      }

      if (session && !processed) {
        setProcessed(true) // Prevent double processing
        const user = session.user

        // Check if user profile exists
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('id, role')
          .eq('id', user.id)
          .single()

        if (profileError && profileError.code !== 'PGRST116') { // PGRST116: 'exact one row' fails, which is fine if user is new
          toast({ title: 'Error', description: 'Failed to check user profile.', variant: 'destructive' })
          router.push('/auth/login')
          return
        }

        let userRole = profile?.role

        if (!profile) {
          if (!user.email) {
            toast({ title: 'Registration Failed', description: 'Could not retrieve email from provider.', variant: 'destructive' })
            router.push('/auth/register')
            return
          }
          // New user, create a profile
          const roleFromUrl = searchParams.get('role')
          const role = (roleFromUrl === 'seller' || roleFromUrl === 'buyer') ? roleFromUrl : 'buyer'

          const newUser = {
            id: user.id,
            email: user.email,
            name: user.user_metadata.full_name || user.user_metadata.name || 'New User',
            phone: user.user_metadata.phone || null,
            role: role as 'seller' | 'buyer'
          }

          const { error: insertError } = await supabase.from('users').insert(newUser)

          if (insertError) {
            toast({ title: 'Registration Failed', description: `Failed to create user profile: ${insertError.message}`, variant: 'destructive' })
            await supabase.auth.signOut() // Sign out if profile creation fails
            router.push('/auth/register')
            return
          }
          userRole = role
          toast({ title: 'Registration Successful', description: 'Your account has been created.' })
        } else {
            toast({ title: 'Login Successful', description: `Welcome back!` })
        }

        // Redirect based on role
        if (userRole === 'seller') {
          router.push('/seller/dashboard')
        } else {
          router.push('/home')
        }
      }
    }

    handleAuthCallback()
  }, [supabase, router, searchParams, toast, processed])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center">
        <p className="text-lg">Please wait while we are authenticating...</p>
      </div>
    </div>
  )
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}