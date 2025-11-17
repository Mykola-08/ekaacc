'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { User } from '@/lib/types';
;
;
;
;
;
;
;
;
;
import { X } from 'lucide-react';

interface UserEditDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updates: Partial<User>) => Promise<void>;
  viewerRole: 'Admin' | 'Therapist';
}

export function UserEditDialog({ user, open, onOpenChange, onSave, viewerRole }: UserEditDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({
    name: user.name,
    displayName: user.displayName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    bio: user.bio,
    location: user.location,
    dateOfBirth: user.dateOfBirth,
    gender: user.gender,
    accountStatus: user.accountStatus || 'active',
    suspendedReason: user.suspendedReason,
    suspendedUntil: user.suspendedUntil,
    emergencyContact: user.emergencyContact,
    therapistProfile: user.therapistProfile,
    profileVisibility: user.profileVisibility || {
      showEmail: false,
      showPhone: false,
      showLocation: false,
      showBio: true,
      showToTherapists: true,
      showToAdmins: true,
      publicProfile: false,
    },
  });

  const [newSpecialization, setNewSpecialization] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(formData);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const addSpecialization = () => {
    if (newSpecialization.trim()) {
      setFormData({
        ...formData,
        therapistProfile: {
          ...formData.therapistProfile,
          specializations: [
            ...(formData.therapistProfile?.specializations || []),
            newSpecialization.trim()
          ]
        }
      });
      setNewSpecialization('');
    }
  };

  const removeSpecialization = (index: number) => {
    setFormData({
      ...formData,
      therapistProfile: {
        ...formData.therapistProfile,
        specializations: formData.therapistProfile?.specializations?.filter((_, i) => i !== index)
      }
    });
  };

  const addCertification = () => {
    if (newCertification.trim()) {
      setFormData({
        ...formData,
        therapistProfile: {
          ...formData.therapistProfile,
          certifications: [
            ...(formData.therapistProfile?.certifications || []),
            newCertification.trim()
          ]
        }
      });
      setNewCertification('');
    }
  };

  const removeCertification = (index: number) => {
    setFormData({
      ...formData,
      therapistProfile: {
        ...formData.therapistProfile,
        certifications: formData.therapistProfile?.certifications?.filter((_, i) => i !== index)
      }
    });
  };

  const addLanguage = () => {
    if (newLanguage.trim()) {
      setFormData({
        ...formData,
        therapistProfile: {
          ...formData.therapistProfile,
          languages: [
            ...(formData.therapistProfile?.languages || []),
            newLanguage.trim()
          ]
        }
      });
      setNewLanguage('');
    }
  };

  const removeLanguage = (index: number) => {
    setFormData({
      ...formData,
      therapistProfile: {
        ...formData.therapistProfile,
        languages: formData.therapistProfile?.languages?.filter((_, i) => i !== index)
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User Profile</DialogTitle>
          <DialogDescription>
            Update user information and settings
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            {user.role === 'Therapist' && <TabsTrigger value="therapist">Therapist</TabsTrigger>}
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            {viewerRole === 'Admin' && <TabsTrigger value="status">Status</TabsTrigger>}
          </TabsList>

          {/* Basic Information */}
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={formData.displayName || ''}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                />
              </div>

              {viewerRole === 'Admin' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => setFormData({ ...formData, role: value as any })}
                    >
                      <SelectValue  />
                      <SelectContent>
                        <SelectItem value="Patient">Patient</SelectItem>
                        <SelectItem value="Therapist">Therapist</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={formData.gender || 'prefer-not-to-say'}
                      onValueChange={(value) => setFormData({ ...formData, gender: value as any })}
                    >
                      <SelectValue  />
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="non-binary">Non-binary</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth || ''}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio || ''}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="City, State/Country"
              />
            </div>
          </TabsContent>

          {/* Contact Information */}
          <TabsContent value="contact" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={viewerRole !== 'Admin'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber || ''}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
              </div>
            </div>

            {viewerRole === 'Admin' && (
              <>
                <div className="pt-4">
                  <h4 className="text-sm font-medium mb-4">Emergency Contact</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyName">Name</Label>
                      <Input
                        id="emergencyName"
                        value={formData.emergencyContact?.name || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          emergencyContact: {
                            ...formData.emergencyContact!,
                            name: e.target.value,
                            phone: formData.emergencyContact?.phone || '',
                            relationship: formData.emergencyContact?.relationship || ''
                          }
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone">Phone</Label>
                      <Input
                        id="emergencyPhone"
                        type="tel"
                        value={formData.emergencyContact?.phone || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          emergencyContact: {
                            ...formData.emergencyContact!,
                            name: formData.emergencyContact?.name || '',
                            phone: e.target.value,
                            relationship: formData.emergencyContact?.relationship || ''
                          }
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergencyRelationship">Relationship</Label>
                      <Input
                        id="emergencyRelationship"
                        value={formData.emergencyContact?.relationship || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          emergencyContact: {
                            ...formData.emergencyContact!,
                            name: formData.emergencyContact?.name || '',
                            phone: formData.emergencyContact?.phone || '',
                            relationship: e.target.value
                          }
                        })}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          {/* Therapist Profile */}
          {user.role === 'Therapist' && (
            <TabsContent value="therapist" className="space-y-6">
              {/* Specializations */}
              <div>
                <Label>Specializations</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newSpecialization}
                    onChange={(e) => setNewSpecialization(e.target.value)}
                    placeholder="Add specialization..."
                    onKeyPress={(e) => e.key === 'Enter' && addSpecialization()}
                  />
                  <Button type="button" onClick={addSpecialization}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.therapistProfile?.specializations?.map((spec, idx) => (
                    <Badge key={idx} variant="background" className="gap-1">
                      {spec}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeSpecialization(idx)} />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <Label>Certifications</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    placeholder="Add certification..."
                    onKeyPress={(e) => e.key === 'Enter' && addCertification()}
                  />
                  <Button type="button" onClick={addCertification}>Add</Button>
                </div>
                <div className="flex flex-col gap-2 mt-3">
                  {formData.therapistProfile?.certifications?.map((cert, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{cert}</span>
                      <X className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground" 
                         onClick={() => removeCertification(idx)} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <Label>Languages</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    placeholder="Add language..."
                    onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
                  />
                  <Button type="button" onClick={addLanguage}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.therapistProfile?.languages?.map((lang, idx) => (
                    <Badge key={idx} variant="border" className="gap-1">
                      {lang}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeLanguage(idx)} />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Other Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">License Number</Label>
                  <Input
                    id="licenseNumber"
                    value={formData.therapistProfile?.licenseNumber || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      therapistProfile: {
                        ...formData.therapistProfile,
                        licenseNumber: e.target.value
                      }
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={formData.therapistProfile?.yearsOfExperience || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      therapistProfile: {
                        ...formData.therapistProfile,
                        yearsOfExperience: parseInt(e.target.value) || 0
                      }
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="education">Education</Label>
                  <Input
                    id="education"
                    value={formData.therapistProfile?.education || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      therapistProfile: {
                        ...formData.therapistProfile,
                        education: e.target.value
                      }
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    value={formData.therapistProfile?.hourlyRate || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      therapistProfile: {
                        ...formData.therapistProfile,
                        hourlyRate: parseFloat(e.target.value) || 0
                      }
                    })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="acceptingClients"
                  checked={formData.therapistProfile?.acceptingNewClients || false}
                  onCheckedChange={(checked) => setFormData({
                    ...formData,
                    therapistProfile: {
                      ...formData.therapistProfile,
                      acceptingNewClients: checked
                    }
                  })}
                />
                <Label htmlFor="acceptingClients">Accepting New Clients</Label>
              </div>
            </TabsContent>
          )}

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="showEmail">Show Email</Label>
                  <p className="text-sm text-muted-foreground">Allow others to see your email address</p>
                </div>
                <Switch
                  id="showEmail"
                  checked={formData.profileVisibility?.showEmail || false}
                  onCheckedChange={(checked) => setFormData({
                    ...formData,
                    profileVisibility: {
                      ...formData.profileVisibility!,
                      showEmail: checked
                    }
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="showPhone">Show Phone Number</Label>
                  <p className="text-sm text-muted-foreground">Allow others to see your phone number</p>
                </div>
                <Switch
                  id="showPhone"
                  checked={formData.profileVisibility?.showPhone || false}
                  onCheckedChange={(checked) => setFormData({
                    ...formData,
                    profileVisibility: {
                      ...formData.profileVisibility!,
                      showPhone: checked
                    }
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="showLocation">Show Location</Label>
                  <p className="text-sm text-muted-foreground">Allow others to see your location</p>
                </div>
                <Switch
                  id="showLocation"
                  checked={formData.profileVisibility?.showLocation || false}
                  onCheckedChange={(checked) => setFormData({
                    ...formData,
                    profileVisibility: {
                      ...formData.profileVisibility!,
                      showLocation: checked
                    }
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="showBio">Show Bio</Label>
                  <p className="text-sm text-muted-foreground">Display your bio on your profile</p>
                </div>
                <Switch
                  id="showBio"
                  checked={formData.profileVisibility?.showBio !== false}
                  onCheckedChange={(checked) => setFormData({
                    ...formData,
                    profileVisibility: {
                      ...formData.profileVisibility!,
                      showBio: checked
                    }
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="showToTherapists">Visible to Therapists</Label>
                  <p className="text-sm text-muted-foreground">Allow therapists to see your full profile</p>
                </div>
                <Switch
                  id="showToTherapists"
                  checked={formData.profileVisibility?.showToTherapists !== false}
                  onCheckedChange={(checked) => setFormData({
                    ...formData,
                    profileVisibility: {
                      ...formData.profileVisibility!,
                      showToTherapists: checked
                    }
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="publicProfile">Public Profile</Label>
                  <p className="text-sm text-muted-foreground">Make profile visible to everyone</p>
                </div>
                <Switch
                  id="publicProfile"
                  checked={formData.profileVisibility?.publicProfile || false}
                  onCheckedChange={(checked) => setFormData({
                    ...formData,
                    profileVisibility: {
                      ...formData.profileVisibility!,
                      publicProfile: checked
                    }
                  })}
                />
              </div>
            </div>
          </TabsContent>

          {/* Account Status (Admin Only) */}
          {viewerRole === 'Admin' && (
            <TabsContent value="status" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="accountStatus">Account Status</Label>
                <Select
                  value={formData.accountStatus || 'active'}
                  onValueChange={(value) => setFormData({ ...formData, accountStatus: value as any })}
                >
                  <SelectValue  />
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="deactivated">Deactivated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.accountStatus === 'suspended' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="suspendedReason">Suspension Reason</Label>
                    <Textarea
                      id="suspendedReason"
                      value={formData.suspendedReason || ''}
                      onChange={(e) => setFormData({ ...formData, suspendedReason: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="suspendedUntil">Suspended Until</Label>
                    <Input
                      id="suspendedUntil"
                      type="date"
                      value={formData.suspendedUntil || ''}
                      onChange={(e) => setFormData({ ...formData, suspendedUntil: e.target.value })}
                    />
                  </div>
                </>
              )}
            </TabsContent>
          )}
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
