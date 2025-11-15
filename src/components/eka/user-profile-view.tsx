'use client';

import { Badge, Card, CardContent, CardHeader, CardTitle, Divider } from '@/components/keep';
import type { User } from '@/lib/types';
;
;
;
import { Mail, Phone, MapPin, Calendar, Award, Clock, DollarSign, Languages, GraduationCap, Shield } from 'lucide-react';

interface UserProfileViewProps {
  user: User;
  viewerRole: 'Admin' | 'Therapist' | 'Patient';
}

export function UserProfileView({ user, viewerRole }: UserProfileViewProps) {
  const typedUser = user as import('@/lib/types').User;

  const canViewEmail = viewerRole === 'Admin' || typedUser.profileVisibility?.showEmail;
  const canViewPhone = viewerRole === 'Admin' || typedUser.profileVisibility?.showPhone;
  const canViewLocation = viewerRole === 'Admin' || typedUser.profileVisibility?.showLocation;
  const canViewBio = viewerRole === 'Admin' || typedUser.profileVisibility?.showBio;
  const canViewDetails = viewerRole === 'Admin' || 
    (viewerRole === 'Therapist' && typedUser.profileVisibility?.showToTherapists);
  const canViewTherapistOnly = viewerRole === 'Therapist' && typedUser.therapistVisible;

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20';
      case 'Therapist': return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20';
    }
  };

  const getStatusBadgeVariant = (status?: string) => {
    switch (status) {
      case 'active': return 'base';
      case 'suspended': return 'border';
      case 'pending': return 'background';
      case 'deactivated': return 'border';
      default: return 'base';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <div className="relative">
              {typedUser.avatarUrl ? (
                <img 
                  src={typedUser.avatarUrl} 
                  alt={typedUser.name || typedUser.displayName || 'User'} 
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">{typedUser.initials}</span>
                </div>
              )}
              {typedUser.profileCompleteness !== undefined && (
                <div className="absolute -bottom-2 -right-2 bg-background rounded-full p-1 shadow-lg border">
                  <div className="text-xs font-semibold text-primary">{typedUser.profileCompleteness}%</div>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{typedUser.name || typedUser.displayName}</h2>
                  {canViewEmail && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Mail className="h-4 w-4" />
                      {typedUser.email}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Badge variant="border" className={getRoleBadgeColor(typedUser.role)}>
                    {typedUser.role}
                  </Badge>
                  {typedUser.accountStatus && (
                    <Badge variant={getStatusBadgeVariant(typedUser.accountStatus)}>
                      {typedUser.accountStatus}
                    </Badge>
                  )}
                </div>
              </div>
              
              {canViewBio && typedUser.bio && (
                <p className="mt-4 text-sm text-muted-foreground">{typedUser.bio}</p>
              )}
              
              <div className="mt-4 flex flex-wrap gap-4">
                {canViewPhone && typedUser.phoneNumber && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{typedUser.phoneNumber}</span>
                  </div>
                )}
                {canViewLocation && typedUser.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{typedUser.location}</span>
                  </div>
                )}
                {typedUser.createdAt && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Joined {new Date(typedUser.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Therapist Profile */}
      {typedUser.role === 'Therapist' && typedUser.therapistProfile && canViewDetails && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Therapist Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {typedUser.therapistProfile.specializations && typedUser.therapistProfile.specializations.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Specializations</h4>
                <div className="flex flex-wrap gap-2">
                  {typedUser.therapistProfile.specializations.map((spec, idx) => (
                    <Badge key={idx} variant="background">{spec}</Badge>
                  ))}
                </div>
              </div>
            )}

            {typedUser.therapistProfile.certifications && typedUser.therapistProfile.certifications.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Certifications
                </h4>
                <ul className="space-y-1">
                  {typedUser.therapistProfile.certifications.map((cert, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground">• {cert}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {typedUser.therapistProfile.yearsOfExperience !== undefined && (
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Clock className="h-4 w-4" />
                    Experience
                  </div>
                  <div className="text-lg font-semibold">{typedUser.therapistProfile.yearsOfExperience} years</div>
                </div>
              )}

              {typedUser.therapistProfile.hourlyRate !== undefined && (
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <DollarSign className="h-4 w-4" />
                    Rate
                  </div>
                  <div className="text-lg font-semibold">${typedUser.therapistProfile.hourlyRate}/hr</div>
                </div>
              )}

              {typedUser.therapistProfile.languages && typedUser.therapistProfile.languages.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Languages className="h-4 w-4" />
                    Languages
                  </div>
                  <div className="text-sm">{typedUser.therapistProfile.languages.join(', ')}</div>
                </div>
              )}

              {typedUser.therapistProfile.education && (
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <GraduationCap className="h-4 w-4" />
                    Education
                  </div>
                  <div className="text-sm">{typedUser.therapistProfile.education}</div>
                </div>
              )}
            </div>

            {typedUser.therapistProfile.licenseNumber && (
              <div>
                <span className="text-sm text-muted-foreground">License: </span>
                <span className="text-sm font-medium">{typedUser.therapistProfile.licenseNumber}</span>
              </div>
            )}

            {typedUser.therapistProfile.acceptingNewClients !== undefined && (
              <div className="pt-2">
                <Badge variant={typedUser.therapistProfile.acceptingNewClients ? 'default' : 'background'}>
                  {typedUser.therapistProfile.acceptingNewClients ? 'Accepting New Clients' : 'Not Accepting Clients'}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Personal Information (Admin Only) */}
      {viewerRole === 'Admin' && (
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {typedUser.dateOfBirth && (
                <div>
                  <div className="text-sm text-muted-foreground">Date of Birth</div>
                  <div className="text-sm font-medium">{new Date(typedUser.dateOfBirth).toLocaleDateString()}</div>
                </div>
              )}
              {typedUser.gender && (
                <div>
                  <div className="text-sm text-muted-foreground">Gender</div>
                  <div className="text-sm font-medium capitalize">{typedUser.gender.replace('-', ' ')}</div>
                </div>
              )}
            </div>

            {typedUser.emergencyContact && (
              <>
                <Divider />
                <div>
                  <h4 className="text-sm font-medium mb-3">Emergency Contact</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Name</div>
                      <div className="text-sm font-medium">{typedUser.emergencyContact.name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Phone</div>
                      <div className="text-sm font-medium">{typedUser.emergencyContact.phone}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Relationship</div>
                      <div className="text-sm font-medium">{typedUser.emergencyContact.relationship}</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Privacy Settings (Admin Only) */}
      {viewerRole === 'Admin' && typedUser.profileVisibility && (
        <Card>
          <CardHeader>
            <CardTitle>Privacy Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Show Email</span>
                <Badge variant={typedUser.profileVisibility.showEmail ? 'default' : 'background'}>
                  {typedUser.profileVisibility.showEmail ? 'Yes' : 'No'}
                      {/* Preferences & Personal Info */}
                      {(typedUser.birthday || typedUser.preferences) && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Personal Preferences</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            {typedUser.birthday && (
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>Birthday: {new Date(typedUser.birthday).toLocaleDateString()}</span>
                              </div>
                            )}
                            {typedUser.preferences && (
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {typedUser.preferences.likesTea !== undefined && (
                                  <div className="text-sm">Likes Tea: <span className="font-medium">{typedUser.preferences.likesTea ? 'Yes' : 'No'}</span></div>
                                )}
                                {typedUser.preferences.likesCoffee !== undefined && (
                                  <div className="text-sm">Likes Coffee: <span className="font-medium">{typedUser.preferences.likesCoffee ? 'Yes' : 'No'}</span></div>
                                )}
                                {typedUser.preferences.favoriteDrink && (
                                  <div className="text-sm">Favorite Drink: <span className="font-medium">{typedUser.preferences.favoriteDrink}</span></div>
                                )}
                                {typedUser.preferences.hobbies && typedUser.preferences.hobbies.length > 0 && (
                                  <div className="text-sm">Hobbies: <span className="font-medium">{typedUser.preferences.hobbies.join(', ')}</span></div>
                                )}
                                {typedUser.preferences.favoriteActivities && typedUser.preferences.favoriteActivities.length > 0 && (
                                  <div className="text-sm">Favorite Activities: <span className="font-medium">{typedUser.preferences.favoriteActivities.join(', ')}</span></div>
                                )}
                                {typedUser.preferences.dietaryRestrictions && (
                                  <div className="text-sm">Dietary: <span className="font-medium">{typedUser.preferences.dietaryRestrictions}</span></div>
                                )}
                                {typedUser.preferences.sleepPattern && (
                                  <div className="text-sm">Sleep: <span className="font-medium">{typedUser.preferences.sleepPattern}</span></div>
                                )}
                                {typedUser.preferences.exerciseFrequency && (
                                  <div className="text-sm">Exercise: <span className="font-medium">{typedUser.preferences.exerciseFrequency}</span></div>
                                )}
                                {typedUser.preferences.notes && (
                                  <div className="text-sm">Notes: <span className="font-medium">{typedUser.preferences.notes}</span></div>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )}

                      {/* Therapist-only fields (visible only to therapists) */}
                      {canViewTherapistOnly && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Therapist-Only Information</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            {typedUser.therapistVisible?.birthday && (
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>Birthday: {new Date(typedUser.therapistVisible.birthday).toLocaleDateString()}</span>
                              </div>
                            )}
                            {typedUser.therapistVisible?.preferences && (
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {typedUser.therapistVisible.preferences.likesTea !== undefined && (
                                  <div className="text-sm">Likes Tea: <span className="font-medium">{typedUser.therapistVisible.preferences.likesTea ? 'Yes' : 'No'}</span></div>
                                )}
                                {typedUser.therapistVisible.preferences.likesCoffee !== undefined && (
                                  <div className="text-sm">Likes Coffee: <span className="font-medium">{typedUser.therapistVisible.preferences.likesCoffee ? 'Yes' : 'No'}</span></div>
                                )}
                                {typedUser.therapistVisible.preferences.favoriteDrink && (
                                  <div className="text-sm">Favorite Drink: <span className="font-medium">{typedUser.therapistVisible.preferences.favoriteDrink}</span></div>
                                )}
                                {typedUser.therapistVisible.preferences.hobbies && typedUser.therapistVisible.preferences.hobbies.length > 0 && (
                                  <div className="text-sm">Hobbies: <span className="font-medium">{typedUser.therapistVisible.preferences.hobbies.join(', ')}</span></div>
                                )}
                                {typedUser.therapistVisible.preferences.favoriteActivities && typedUser.therapistVisible.preferences.favoriteActivities.length > 0 && (
                                  <div className="text-sm">Favorite Activities: <span className="font-medium">{typedUser.therapistVisible.preferences.favoriteActivities.join(', ')}</span></div>
                                )}
                                {typedUser.therapistVisible.preferences.dietaryRestrictions && (
                                  <div className="text-sm">Dietary: <span className="font-medium">{typedUser.therapistVisible.preferences.dietaryRestrictions}</span></div>
                                )}
                                {typedUser.therapistVisible.preferences.sleepPattern && (
                                  <div className="text-sm">Sleep: <span className="font-medium">{typedUser.therapistVisible.preferences.sleepPattern}</span></div>
                                )}
                                {typedUser.therapistVisible.preferences.exerciseFrequency && (
                                  <div className="text-sm">Exercise: <span className="font-medium">{typedUser.therapistVisible.preferences.exerciseFrequency}</span></div>
                                )}
                                {typedUser.therapistVisible.preferences.notes && (
                                  <div className="text-sm">Notes: <span className="font-medium">{typedUser.therapistVisible.preferences.notes}</span></div>
                                )}
                              </div>
                            )}
                            {typedUser.therapistVisible?.additionalNotes && (
                              <div className="text-sm">Additional Notes: <span className="font-medium">{typedUser.therapistVisible.additionalNotes}</span></div>
                            )}
                          </CardContent>
                        </Card>
                      )}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Show Phone</span>
                <Badge variant={typedUser.profileVisibility.showPhone ? 'default' : 'background'}>
                  {typedUser.profileVisibility.showPhone ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Show Location</span>
                <Badge variant={typedUser.profileVisibility.showLocation ? 'default' : 'background'}>
                  {typedUser.profileVisibility.showLocation ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Show Bio</span>
                <Badge variant={typedUser.profileVisibility.showBio ? 'base' : 'background'}>
                  {typedUser.profileVisibility.showBio ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Visible to Therapists</span>
                <Badge variant={typedUser.profileVisibility.showToTherapists ? 'base' : 'background'}>
                  {typedUser.profileVisibility.showToTherapists ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Public Profile</span>
                <Badge variant={typedUser.profileVisibility.publicProfile ? 'base' : 'background'}>
                  {typedUser.profileVisibility.publicProfile ? 'Yes' : 'No'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Account Status (Admin Only) */}
      {viewerRole === 'Admin' && (
        <Card>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <Badge variant={getStatusBadgeVariant(typedUser.accountStatus)} className="mt-1">
                  {typedUser.accountStatus || 'active'}
                </Badge>
              </div>
              {typedUser.lastLoginAt && (
                <div>
                  <div className="text-sm text-muted-foreground">Last Login</div>
                  <div className="text-sm font-medium">{new Date(typedUser.lastLoginAt).toLocaleString()}</div>
                </div>
              )}
              {typedUser.profileCompleteness !== undefined && (
                <div>
                  <div className="text-sm text-muted-foreground">Profile Completeness</div>
                  <div className="text-sm font-medium">{typedUser.profileCompleteness}%</div>
                </div>
              )}
            </div>

            {typedUser.accountStatus === 'suspended' && typedUser.suspendedReason && (
              <>
                <Divider />
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Suspension Reason</div>
                  <div className="text-sm font-medium text-destructive">{typedUser.suspendedReason}</div>
                  {typedUser.suspendedUntil && (
                    <div className="text-sm text-muted-foreground mt-1">
                      Until: {new Date(typedUser.suspendedUntil).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Therapist Notes (Therapist/Admin only) */}
      {(viewerRole === 'Therapist' || viewerRole === 'Admin') && typedUser.therapistNotes && typedUser.therapistNotes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Therapist Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {typedUser.therapistNotes.map((note, idx) => (
              <div key={idx} className="border rounded p-2">
                <div className="text-xs text-muted-foreground mb-1">By Therapist: {note.therapistId}</div>
                <div className="text-sm">{note.note}</div>
                <div className="text-xs text-muted-foreground mt-1">Created: {new Date(note.createdAt).toLocaleString()}</div>
                {note.updatedAt && (
                  <div className="text-xs text-muted-foreground">Updated: {new Date(note.updatedAt).toLocaleString()}</div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Follow-up Reminders (Therapist/Admin only) */}
      {(viewerRole === 'Therapist' || viewerRole === 'Admin') && typedUser.followUpReminders && typedUser.followUpReminders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Follow-up Reminders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {typedUser.followUpReminders.map((reminder, idx) => (
              <div key={idx} className="border rounded p-2">
                <div className="text-xs text-muted-foreground mb-1">By Therapist: {reminder.therapistId}</div>
                <div className="text-sm">{reminder.reminder}</div>
                <div className="text-xs text-muted-foreground mt-1">Due: {new Date(reminder.dueDate).toLocaleDateString()}</div>
                {reminder.completed && (
                  <div className="text-xs text-green-600">Completed: {reminder.completedAt ? new Date(reminder.completedAt).toLocaleDateString() : 'Yes'}</div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
