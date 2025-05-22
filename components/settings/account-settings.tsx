"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { updateUserEmail, updateUserPassword } from "@/app/actions/update-profile"
import { AlertCircle, Check, Loader2 } from "lucide-react"

interface AccountSettingsProps {
  user: any
}

export function AccountSettings({ user }: AccountSettingsProps) {
  // Email state
  const [email, setEmail] = useState(user?.email || "")
  const [updatingEmail, setUpdatingEmail] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [emailSuccess, setEmailSuccess] = useState("")

  // Password state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [updatingPassword, setUpdatingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState("")

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError("")
    setEmailSuccess("")
    setUpdatingEmail(true)

    if (!email || email === user?.email) {
      setEmailError("Please enter a new email address")
      setUpdatingEmail(false)
      return
    }

    try {
      const result = await updateUserEmail(user.uid, email)

      if (result.success) {
        setEmailSuccess(result.message)
      } else {
        setEmailError(result.message)
      }
    } catch (error) {
      console.error("Error updating email:", error)
      setEmailError("An unexpected error occurred. Please try again.")
    } finally {
      setUpdatingEmail(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")
    setPasswordSuccess("")
    setUpdatingPassword(true)

    if (!currentPassword) {
      setPasswordError("Please enter your current password")
      setUpdatingPassword(false)
      return
    }

    if (!newPassword) {
      setPasswordError("Please enter a new password")
      setUpdatingPassword(false)
      return
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long")
      setUpdatingPassword(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match")
      setUpdatingPassword(false)
      return
    }

    try {
      const result = await updateUserPassword(user.uid, currentPassword, newPassword)

      if (result.success) {
        setPasswordSuccess(result.message)
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        setPasswordError(result.message)
      }
    } catch (error) {
      console.error("Error updating password:", error)
      setPasswordError("An unexpected error occurred. Please try again.")
    } finally {
      setUpdatingPassword(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <form onSubmit={handleEmailUpdate}>
          <CardHeader>
            <CardTitle>Email Address</CardTitle>
            <CardDescription>Update your email address</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {emailError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{emailError}</AlertDescription>
              </Alert>
            )}

            {emailSuccess && (
              <Alert className="border-green-500 text-green-500">
                <Check className="h-4 w-4" />
                <AlertDescription>{emailSuccess}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <p className="text-xs text-muted-foreground">We'll send a verification email to confirm this change</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={updatingEmail}>
              {updatingEmail ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Email"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <form onSubmit={handlePasswordUpdate}>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Change your password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {passwordError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{passwordError}</AlertDescription>
              </Alert>
            )}

            {passwordSuccess && (
              <Alert className="border-green-500 text-green-500">
                <Check className="h-4 w-4" />
                <AlertDescription>{passwordSuccess}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={updatingPassword}>
              {updatingPassword ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border border-destructive/50 p-4">
            <h3 className="text-lg font-medium">Delete Account</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Permanently delete your account and all of your content. This action cannot be undone.
            </p>
            <Button variant="destructive" className="mt-4">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
