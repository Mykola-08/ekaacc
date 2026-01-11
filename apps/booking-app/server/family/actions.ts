'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const FamilyMemberSchema = z.object({
  full_name: z.string().min(2, "Name is required"),
  dob: z.string().optional(), // YYYY-MM-DD
  relationship: z.string().min(1, "Relationship is required"),
})

export async function getFamilyMembers() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  // Get current profile id first
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('auth_id', user.id)
    .single()
  
  if (!profile) return []

  // Fetch profiles managed by this user
  const { data: members, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('managed_by', profile.id)
    .order('created_at', { ascending: true })

  if (error) {
      console.error("Error fetching family:", error)
      return []
  }

  return members
}

export async function addFamilyMember(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
      return { success: false, message: "Unauthorized" }
  }

  // Get parent profile
  const { data: parent } = await supabase
    .from('profiles')
    .select('id')
    .eq('auth_id', user.id)
    .single()

  if (!parent) {
      return { success: false, message: "Parent profile not found" }
  }

  const rawData = {
      full_name: formData.get('full_name'),
      dob: formData.get('dob'),
      relationship: formData.get('relationship')
  }

  const validated = FamilyMemberSchema.safeParse(rawData)

  if (!validated.success) {
      return { 
          success: false, 
          message: "Validation failed", 
          errors: validated.error.flatten().fieldErrors 
      }
  }

  try {
      const { error } = await supabase
        .from('profiles')
        .insert({
            full_name: validated.data.full_name,
            dob: validated.data.dob || null, // Ensure date format or null
            managed_by: parent.id,
            role: 'client', // Dependents are clients
            metadata: { relationship: validated.data.relationship }
        })

      if (error) throw error

      revalidatePath('/settings/family')
      return { success: true, message: "Family member added" }

  } catch (e: any) {
      console.error("Add family error:", e)
      return { success: false, message: e.message }
  }
}

export async function deleteFamilyMember(memberId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: "Unauthorized" }

   const { data: parent } = await supabase
    .from('profiles')
    .select('id')
    .eq('auth_id', user.id)
    .single()

  if (!parent) return { success: false, message: "Parent not found" }

  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', memberId)
    .eq('managed_by', parent.id) // Ensure ownership

  if (error) return { success: false, message: error.message }
  
  revalidatePath('/settings/family')
  return { success: true }
}
