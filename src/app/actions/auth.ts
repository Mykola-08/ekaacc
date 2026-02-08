'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export async function login(prevState: any, formData: FormData) {
  const supabase =await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(prevState: any, formData: FormData) {
  const supabase =await createClient()
  
  const name = formData.get('full_name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const plan = formData.get('plan') as string
  const origin = (await headers()).get('origin')

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        plan_id: plan
      },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    return { success: false, message: error.message }
  }

  return { success: true, message: 'Check your email to confirm your account.' }
}

export async function logout() {
  const supabase =await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/auth/login')
}

