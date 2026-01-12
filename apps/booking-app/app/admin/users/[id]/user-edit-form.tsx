"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
 Form,
 FormControl,
 FormDescription,
 FormField,
 FormItem,
 FormLabel,
 FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { UserProfile, updateUserAttributes } from "@/server/admin/user-actions"
import { useState } from "react"
import { Loader2 } from "lucide-react"

const profileSchema = z.object({
 fullName: z.string().min(2, "Name must be at least 2 characters."),
 email: z.string().email().readonly(),
 role: z.string().min(1, "Please select a role."),
 status: z.enum(["active", "suspended", "pending"]),
 phone: z.string().optional(),
 company: z.string().optional(),
})

interface UserEditFormProps {
 user: UserProfile;
}

export function UserEditForm({ user }: UserEditFormProps) {
 const [isLoading, setIsLoading] = useState(false)

 const form = useForm<z.infer<typeof profileSchema>>({
  resolver: zodResolver(profileSchema),
  defaultValues: {
   fullName: user.fullName || "",
   email: user.email,
   role: user.role || "user",
   status: user.status || "active",
   phone: user.phone || "",
   company: user.company || "",
  },
 })

 async function onSubmit(values: z.infer<typeof profileSchema>) {
  setIsLoading(true)
  try {
   await updateUserAttributes(user.id, values)
   toast.success("User profile updated successfully.")
  } catch (error) {
   toast.error("Failed to update profile.")
   console.error(error)
  } finally {
   setIsLoading(false)
  }
 }

 return (
  <Form {...form}>
   <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
      control={form.control}
      name="fullName"
      render={({ field }) => (
        <FormItem>
        <FormLabel>Full Name</FormLabel>
        <FormControl>
          <Input placeholder="John Doe" {...field} />
        </FormControl>
        <FormMessage />
        </FormItem>
      )}
      />
      <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input placeholder="email@example.com" {...field} disabled />
        </FormControl>
        <FormDescription>
          Email cannot be changed directly.
        </FormDescription>
        <FormMessage />
        </FormItem>
      )}
      />
      <FormField
      control={form.control}
      name="role"
      render={({ field }) => (
        <FormItem>
        <FormLabel>Role</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          </FormControl>
          <SelectContent>
          <SelectItem value="user">User</SelectItem>
          <SelectItem value="therapist">Therapist</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        <FormMessage />
        </FormItem>
      )}
      />
       <FormField
      control={form.control}
      name="status"
      render={({ field }) => (
        <FormItem>
        <FormLabel>Status</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          </FormControl>
          <SelectContent>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="suspended">Suspended</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <FormMessage />
        </FormItem>
      )}
      />
      <FormField
      control={form.control}
      name="phone"
      render={({ field }) => (
        <FormItem>
        <FormLabel>Phone</FormLabel>
        <FormControl>
          <Input placeholder="+1 234 567 890" {...field} />
        </FormControl>
        <FormMessage />
        </FormItem>
      )}
      />
      <FormField
      control={form.control}
      name="company"
      render={({ field }) => (
        <FormItem>
        <FormLabel>Company</FormLabel>
        <FormControl>
          <Input placeholder="Acme Inc." {...field} />
        </FormControl>
        <FormMessage />
        </FormItem>
      )}
      />
    </div>
    <div className="flex justify-end">
      <Button type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Changes
      </Button>
    </div>
   </form>
  </Form>
 )
}
