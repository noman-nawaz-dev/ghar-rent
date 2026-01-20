'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase.client'
import { verifyOAuthUser, createOAuthUserProfile } from '@/lib/database/auth'

function AuthCallbackContent() {
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

        // Verify user profile and check suspended status
        const verification = await verifyOAuthUser(user.id)

        if (verification.error) {
          toast({ title: 'Error', description: verification.error, variant: 'destructive' })
          router.push('/auth/login')
          return
        }

        // Check if user is suspended
        if (verification.isSuspended) {
          await supabase.auth.signOut()
          toast({ 
            title: 'Account Suspended', 
            description: 'Your account has been suspended. Please contact support for assistance.', 
            variant: 'destructive' 
          })
          router.push('/auth/login')
          return
        }

        let userRole = verification.user?.role

        // Handle new user registration
        if (verification.isNewUser) {
          if (!user.email) {
            toast({ title: 'Registration Failed', description: 'Could not retrieve email from provider.', variant: 'destructive' })
            router.push('/auth/register')
            return
          }

          // Determine role from URL or default to buyer
          const roleFromUrl = searchParams.get('role')
          const role = (roleFromUrl === 'seller' || roleFromUrl === 'buyer') ? roleFromUrl : 'buyer'

          const name = user.user_metadata.full_name || user.user_metadata.name || 'New User'
          const phone = user.user_metadata.phone || null

          const { user: newUser, error: createError } = await createOAuthUserProfile(
            user.id,
            user.email,
            name,
            role as 'seller' | 'buyer',
            phone
          )

          if (createError || !newUser) {
            toast({ title: 'Registration Failed', description: createError || 'Failed to create user profile', variant: 'destructive' })
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