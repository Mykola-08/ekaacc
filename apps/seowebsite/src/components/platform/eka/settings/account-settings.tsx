'use client'

import { useState } from 'react'
import { useAuth } from '@/context/platform/auth-context'
import { Button } from '@/components/platform/ui/button'
import { Input } from '@/components/platform/ui/input'
import { Label } from '@/components/platform/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/platform/ui/card'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/platform/ui/avatar'

export function AccountSettings() {
  const { user, updateProfile, registerPasskey } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [fullName, setFullName] = useState(user?.profile?.full_name || '')
  const [username, setUsername] = useState(user?.profile?.username || '')

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { error } = await updateProfile({
        full_name: fullName,
        username: username,
      })
      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Profile updated successfully')
      }
    } catch (err) {
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegisterPasskey = async () => {
    setIsLoading(true)
    try {
      const { error } = await registerPasskey()
      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Passkey registered successfully')
      }
    } catch (err) {
      toast.error('Failed to register passkey')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Manage your public profile information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.profile?.avatar_url || ''} />
                <AvatarFallback>{user?.profile?.full_name?.[0] || user?.email?.[0]}</AvatarFallback>
              </Avatar>
              {/* <Button variant="outline" type="button">Change Avatar</Button> */}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input 
                id="fullName" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                value={user?.email || ''} 
                disabled 
              />
            </div>
            <Button type="submit" disabled={isLoading}>Save Changes</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Manage your security settings and passkeys.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">Passkeys</p>
              <p className="text-sm text-muted-foreground">
                Use your fingerprint, face, or device PIN to sign in securely.
              </p>
            </div>
            <Button onClick={handleRegisterPasskey} disabled={isLoading} variant="secondary">
              Add Passkey
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
