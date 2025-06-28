'use client'

import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { useState } from 'react'
import type { Database } from '@/types/supabase'

export function useSupabaseBrowser() {
  const [supabaseClient] = useState(() =>
    createPagesBrowserClient<Database>()
  )
  return supabaseClient
}
