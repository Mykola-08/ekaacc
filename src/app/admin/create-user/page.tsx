'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { UserPlus, Copy, Check, AlertCircle, Mail } from 'lucide-react';
import type { RegistrationData } from '@/lib/wallet-types';

export default function AdminCreateUserPage() {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Partial<RegistrationData>>({
    email: '',
    name: '',
    displayName: '',
    phoneNumber: '',
    role: 'Patient',
    method: 'admin-created',
    sendWelcomeEmail: true,
    initialWalletBalance: 0,
    referralCode: '',
    metadata: {
      notes: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleMetadataChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [field]: value,
      },
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.email || !formData.email.includes('@')) {
      newErrors.push('Valid email is required');
    }

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.push('Name must be at least 2 characters');
    }

    if (!formData.role) {
      newErrors.push('Role is required');
    }

    if (formData.initialWalletBalance && formData.initialWalletBalance < 0) {
      newErrors.push('Initial wallet balance cannot be negative');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create users',
        variant: 'destructive',
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const { getRegistrationService } = await import('@/services/registration-service');
      const service = await getRegistrationService();

      const registrationData: RegistrationData = {
        email: formData.email!,
        name: formData.name!,
        displayName: formData.displayName,
        phoneNumber: formData.phoneNumber,
        role: formData.role as 'Patient' | 'Therapist' | 'Admin',
        method: currentUser.role === 'Admin' ? 'admin-created' : 'therapist-created',
        createdBy: currentUser.id,
        createdByName: currentUser.name || 'Unknown',
        sendWelcomeEmail: formData.sendWelcomeEmail || false,
        initialWalletBalance: formData.initialWalletBalance || 0,
        referralCode: formData.referralCode,
        metadata: formData.metadata,
      };

      const response = await service.registerUser(registrationData);

      if (response.success) {
        setResult(response);
        setResultDialogOpen(true);
        
        toast({
          title: 'User Created Successfully',
          description: `${formData.name} has been registered as ${formData.role}`,
        });

        // Reset form
        setFormData({
          email: '',
          name: '',
          displayName: '',
          phoneNumber: '',
          role: 'Patient',
          method: 'admin-created',
          sendWelcomeEmail: true,
          initialWalletBalance: 0,
          referralCode: '',
          metadata: {
            notes: '',
          },
        });
      } else {
        toast({
          title: 'Registration Failed',
          description: response.error || 'Unknown error occurred',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create user',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const copyPassword = () => {
    if (result?.temporaryPassword) {
      navigator.clipboard.writeText(result.temporaryPassword);
      setPasswordCopied(true);
      setTimeout(() => setPasswordCopied(false), 2000);
      toast({
        title: 'Password Copied',
        description: 'Temporary password copied to clipboard',
      });
    }
  };

  if (!currentUser || (currentUser.role !== 'Admin' && currentUser.role !== 'Therapist')) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You do not have permission to create users.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New User</h1>
        <p className="text-muted-foreground">Register a new user account with automatic wallet setup</p>
      </div>

      {errors.length > 0 && (
        <div className="mb-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Validation Errors</AlertTitle>
            <AlertDescription>
            <ul className="list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="user@example.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  placeholder="Optional"
                />
              </div>

              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="+34 600 123 456"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <Label htmlFor="role">Role *</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => handleInputChange('role', value)}
              >
                <SelectTrigger>
                  <SelectValue  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Patient">Patient</SelectItem>
                  <SelectItem value="Therapist">Therapist</SelectItem>
                  {currentUser.role === 'Admin' && (
                    <SelectItem value="Admin">Admin</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {formData.role === 'Patient' && 'Will be auto-enrolled in loyalty program'}
                {formData.role === 'Therapist' && 'Can create patient accounts and manage sessions'}
                {formData.role === 'Admin' && 'Full system access'}
              </p>
            </div>

            {/* Wallet & Referral */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="initialWalletBalance">Initial Wallet Balance (€)</Label>
                <Input
                  id="initialWalletBalance"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.initialWalletBalance}
                  onChange={(e) => handleInputChange('initialWalletBalance', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Optional starting balance for the user's wallet
                </p>
              </div>

              <div>
                <Label htmlFor="referralCode">Referral Code (Optional)</Label>
                <Input
                  id="referralCode"
                  value={formData.referralCode}
                  onChange={(e) => handleInputChange('referralCode', e.target.value.toUpperCase())}
                  placeholder="EKA2024ABC"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Apply an existing referral code during registration
                </p>
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Internal Notes</Label>
              <Textarea
                id="notes"
                value={formData.metadata?.notes || ''}
                onChange={(e) => handleMetadataChange('notes', e.target.value)}
                placeholder="Optional notes about this user..."
                rows={3}
              />
            </div>

            {/* Email Option */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sendWelcomeEmail"
                checked={formData.sendWelcomeEmail}
                onCheckedChange={(checked) => handleInputChange('sendWelcomeEmail', checked)}
              />
              <Label htmlFor="sendWelcomeEmail" className="cursor-pointer">
                Send welcome email with login credentials
              </Label>
            </div>

            {formData.sendWelcomeEmail && (
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertTitle>Welcome Email</AlertTitle>
                <AlertDescription>
                  A temporary password will be generated and sent to the user's email. 
                  They will be required to change it on first login.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 flex gap-4">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Creating User...' : 'Create User'}
          </Button>
          <Button 
            type="button" 
            variant="outline"
            onClick={() => {
              setFormData({
                email: '',
                name: '',
                displayName: '',
                phoneNumber: '',
                role: 'Patient',
                method: 'admin-created',
                sendWelcomeEmail: true,
                initialWalletBalance: 0,
                referralCode: '',
                metadata: { notes: '' },
              });
              setErrors([]);
            }}
          >
            Reset Form
          </Button>
        </div>
      </form>

      {/* Success Dialog */}
      <Dialog open={resultDialogOpen} onOpenChange={setResultDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>✓ User Created Successfully</DialogTitle>
            <DialogDescription>
              The user account has been created with the following details:
            </DialogDescription>
          </DialogHeader>

          {result && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">User ID:</div>
                <div className="font-mono text-xs">{result.userId}</div>
                
                <div className="text-muted-foreground">Email:</div>
                <div>{result.user?.email}</div>
                
                <div className="text-muted-foreground">Name:</div>
                <div>{result.user?.name}</div>
                
                <div className="text-muted-foreground">Role:</div>
                <div>{result.user?.role}</div>
                
                <div className="text-muted-foreground">Wallet ID:</div>
                <div className="font-mono text-xs">{result.walletId}</div>
              </div>

              {result.temporaryPassword && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Temporary Password Generated</AlertTitle>
                  <AlertDescription>
                    <div className="mt-2 flex items-center gap-2">
                      <code className="flex-1 p-2 bg-muted rounded text-sm">
                        {result.temporaryPassword}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={copyPassword}
                      >
                        {passwordCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs mt-2">
                      {formData.sendWelcomeEmail 
                        ? 'This password has been sent to the user\'s email.' 
                        : 'Please share this password with the user securely.'}
                    </p>
                  </AlertDescription>
                </Alert>
              )}

              {result.requiresEmailVerification && (
                <Alert>
                  <Mail className="h-4 w-4" />
                  <AlertTitle>Email Verification Required</AlertTitle>
                  <AlertDescription>
                    A verification email has been sent to {result.user?.email}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => {
              setResultDialogOpen(false);
              setResult(null);
              setPasswordCopied(false);
            }}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
