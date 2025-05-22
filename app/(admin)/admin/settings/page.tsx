"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)

  // Site settings
  const [siteName, setSiteName] = useState("UmmahOverflow")
  const [siteDescription, setSiteDescription] = useState("A Q&A Platform for Muslim Developers")
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [registrationEnabled, setRegistrationEnabled] = useState(true)

  // Email settings
  const [emailFrom, setEmailFrom] = useState("noreply@ummahoverflow.com")
  const [emailReplyTo, setEmailReplyTo] = useState("support@ummahoverflow.com")
  const [emailFooter, setEmailFooter] = useState("© UmmahOverflow. All rights reserved.")

  // Content settings
  const [maxQuestionTags, setMaxQuestionTags] = useState(5)
  const [minQuestionLength, setMinQuestionLength] = useState(20)
  const [minAnswerLength, setMinAnswerLength] = useState(30)
  const [allowAnonymousQuestions, setAllowAnonymousQuestions] = useState(true)

  const handleSaveSiteSettings = () => {
    setSaving(true)
    // Simulate API call
    setTimeout(() => {
      setSaving(false)
      toast({
        title: "Settings saved",
        description: "Your site settings have been saved successfully.",
      })
    }, 1000)
  }

  const handleSaveEmailSettings = () => {
    setSaving(true)
    // Simulate API call
    setTimeout(() => {
      setSaving(false)
      toast({
        title: "Email settings saved",
        description: "Your email settings have been saved successfully.",
      })
    }, 1000)
  }

  const handleSaveContentSettings = () => {
    setSaving(true)
    // Simulate API call
    setTimeout(() => {
      setSaving(false)
      toast({
        title: "Content settings saved",
        description: "Your content settings have been saved successfully.",
      })
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
        <p className="text-muted-foreground">Configure platform-wide settings</p>
      </div>

      <Tabs defaultValue="site" className="space-y-6">
        <TabsList>
          <TabsTrigger value="site">Site</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        <TabsContent value="site">
          <Card>
            <CardHeader>
              <CardTitle>Site Settings</CardTitle>
              <CardDescription>Manage general site settings and configurations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="site-name">Site Name</Label>
                <Input
                  id="site-name"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="Site Name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="site-description">Site Description</Label>
                <Textarea
                  id="site-description"
                  value={siteDescription}
                  onChange={(e) => setSiteDescription(e.target.value)}
                  placeholder="Site Description"
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      When enabled, the site will display a maintenance message to all users.
                    </p>
                  </div>
                  <Switch id="maintenance-mode" checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="registration">User Registration</Label>
                    <p className="text-sm text-muted-foreground">
                      When disabled, new users will not be able to register.
                    </p>
                  </div>
                  <Switch id="registration" checked={registrationEnabled} onCheckedChange={setRegistrationEnabled} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSiteSettings} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Settings"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>Configure email notifications and templates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email-from">From Email</Label>
                <Input
                  id="email-from"
                  value={emailFrom}
                  onChange={(e) => setEmailFrom(e.target.value)}
                  placeholder="noreply@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-reply-to">Reply-To Email</Label>
                <Input
                  id="email-reply-to"
                  value={emailReplyTo}
                  onChange={(e) => setEmailReplyTo(e.target.value)}
                  placeholder="support@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-footer">Email Footer</Label>
                <Textarea
                  id="email-footer"
                  value={emailFooter}
                  onChange={(e) => setEmailFooter(e.target.value)}
                  placeholder="Email footer text"
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveEmailSettings} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Email Settings"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Content Settings</CardTitle>
              <CardDescription>Configure content rules and restrictions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="max-tags">Maximum Tags per Question</Label>
                <Input
                  id="max-tags"
                  type="number"
                  value={maxQuestionTags}
                  onChange={(e) => setMaxQuestionTags(Number(e.target.value))}
                  min={1}
                  max={10}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="min-question-length">Minimum Question Length (characters)</Label>
                <Input
                  id="min-question-length"
                  type="number"
                  value={minQuestionLength}
                  onChange={(e) => setMinQuestionLength(Number(e.target.value))}
                  min={10}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="min-answer-length">Minimum Answer Length (characters)</Label>
                <Input
                  id="min-answer-length"
                  type="number"
                  value={minAnswerLength}
                  onChange={(e) => setMinAnswerLength(Number(e.target.value))}
                  min={10}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="anonymous-questions">Allow Anonymous Questions</Label>
                  <p className="text-sm text-muted-foreground">When enabled, users can post questions anonymously.</p>
                </div>
                <Switch
                  id="anonymous-questions"
                  checked={allowAnonymousQuestions}
                  onCheckedChange={setAllowAnonymousQuestions}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveContentSettings} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Content Settings"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
