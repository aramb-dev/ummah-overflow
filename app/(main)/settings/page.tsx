"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileSettings } from "@/components/settings/profile-settings"
import { AccountSettings } from "@/components/settings/account-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { useAuth } from "@/context/auth-context"

export default function SettingsPage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <div className="container py-10 max-w-4xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 md:w-auto">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <ProfileSettings user={user} />
            </TabsContent>

            <TabsContent value="account">
              <AccountSettings user={user} />
            </TabsContent>

            <TabsContent value="notifications">
              <NotificationSettings user={user} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
