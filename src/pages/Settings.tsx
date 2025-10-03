import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useFamilies, useFamilyMembers } from '@/modules/calendar/hooks/useFamilies';
import { ArrowLeft, Trash2, UserPlus, Plus, Settings as SettingsIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const Settings = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const { families, isLoading, createFamily, inviteMember } = useFamilies();
  
  const [selectedFamilyId, setSelectedFamilyId] = useState<string | undefined>(
    families.length > 0 ? families[0].id : undefined
  );
  const { members, isLoading: membersLoading, removeMember } = useFamilyMembers(selectedFamilyId);
  
  const [newFamilyName, setNewFamilyName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  const handleCreateFamily = () => {
    if (!newFamilyName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a family name',
        variant: 'destructive',
      });
      return;
    }

    createFamily.mutate(newFamilyName, {
      onSuccess: () => {
        setNewFamilyName('');
      },
    });
  };

  const handleInviteMember = () => {
    if (!selectedFamilyId) {
      toast({
        title: 'Error',
        description: 'Please select a family first',
        variant: 'destructive',
      });
      return;
    }

    if (!inviteEmail.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an email address',
        variant: 'destructive',
      });
      return;
    }

    inviteMember.mutate(
      { familyId: selectedFamilyId, email: inviteEmail, role: 'member' },
      {
        onSuccess: () => {
          setInviteEmail('');
        },
      }
    );
  };

  const handleRemoveMember = (memberId: string) => {
    removeMember.mutate(memberId);
  };

  const handleDeleteAccount = async () => {
    toast({
      title: 'Account Deletion',
      description: 'Please delete your account from the Supabase dashboard',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Calendar
            </Button>
            <h1 className="text-xl font-medium text-foreground tracking-tight">Settings</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground font-medium hidden md:block">
              {user?.email}
            </span>
            <Button onClick={signOut} variant="outline" size="sm" className="h-8">
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <Tabs defaultValue="families" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="families">Families</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          {/* Families Tab */}
          <TabsContent value="families" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create New Family</CardTitle>
                <CardDescription>Add a new family calendar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="family-name">Family Name</Label>
                    <Input
                      id="family-name"
                      placeholder="Enter family name"
                      value={newFamilyName}
                      onChange={(e) => setNewFamilyName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCreateFamily()}
                    />
                  </div>
                  <Button
                    onClick={handleCreateFamily}
                    disabled={createFamily.isPending}
                    className="self-end"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Families</CardTitle>
                <CardDescription>Manage your family calendars</CardDescription>
              </CardHeader>
              <CardContent>
                {families.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No families yet. Create one above!</p>
                ) : (
                  <div className="space-y-2">
                    {families.map((family) => (
                      <div
                        key={family.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
                      >
                        <div>
                          <p className="font-medium text-foreground">{family.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Created {new Date(family.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedFamilyId(family.id)}
                        >
                          Manage Members
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-4">
            {!selectedFamilyId ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    Please select a family from the Families tab first
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Invite Family Member</CardTitle>
                    <CardDescription>
                      Send an invitation to join{' '}
                      {families.find((f) => f.id === selectedFamilyId)?.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Label htmlFor="invite-email">Email Address</Label>
                        <Input
                          id="invite-email"
                          type="email"
                          placeholder="Enter email address"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleInviteMember()}
                        />
                      </div>
                      <Button
                        onClick={handleInviteMember}
                        disabled={inviteMember.isPending}
                        className="self-end"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Invite
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Family Members</CardTitle>
                    <CardDescription>
                      Manage members of {families.find((f) => f.id === selectedFamilyId)?.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {membersLoading ? (
                      <p className="text-sm text-muted-foreground">Loading members...</p>
                    ) : members.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No members yet. Invite someone above!</p>
                    ) : (
                      <div className="space-y-2">
                        {members.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center justify-between p-3 rounded-lg border bg-card"
                          >
                            <div>
                              <p className="font-medium text-foreground">
                                {member.invited_email || 'Unknown'}
                              </p>
                              <div className="flex gap-2 text-sm text-muted-foreground">
                                <span className="capitalize">{member.role}</span>
                                <span>•</span>
                                <span className="capitalize">{member.status}</span>
                              </div>
                            </div>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Remove Member</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to remove this member? This action cannot be
                                    undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleRemoveMember(member.id)}
                                  >
                                    Remove
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
                </div>
                <div>
                  <Label>User ID</Label>
                  <p className="text-sm text-muted-foreground mt-1 font-mono">{user?.id}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>Irreversible account actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Account</AlertDialogTitle>
                      <AlertDialogDescription>
                        To delete your account and all associated data, please visit your Supabase
                        dashboard at:
                        <br />
                        <br />
                        <a
                          href="https://supabase.com/dashboard/project/vbjmuvnjhytsdppuxahe/auth/users"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline"
                        >
                          Supabase Users Dashboard
                        </a>
                        <br />
                        <br />
                        Find your user and delete it from there. This will permanently delete all your
                        data including families, events, and memberships.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Close</AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
