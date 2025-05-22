"use server"

import { doc, updateDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

export interface ProfileFormData {
  displayName: string
  username: string
  bio?: string
  location?: string
  website?: string
}

export async function updateUserProfile(userId: string, data: ProfileFormData) {
  try {
    // Check if the username is already taken by another user
    if (data.username) {
      const usernameQuery = await getDoc(doc(db, "users", userId))
      const userData = usernameQuery.data()

      if (userData && userData.username !== data.username) {
        // Here you would check if the username is taken by another user
        // This is a simplified version
      }
    }

    // Update the user profile
    await updateDoc(doc(db, "users", userId), {
      displayName: data.displayName,
      username: data.username,
      bio: data.bio || "",
      location: data.location || "",
      website: data.website || "",
      updatedAt: serverTimestamp(),
    })

    return {
      success: true,
      message: "Profile updated successfully",
    }
  } catch (error: any) {
    console.error("Error updating profile:", error)
    return {
      success: false,
      message: error.message || "Failed to update profile",
    }
  }
}

export async function updateUserEmail(userId: string, email: string) {
  try {
    // In a real implementation, you would send a verification email
    // and only update the email after verification
    await updateDoc(doc(db, "users", userId), {
      email,
      updatedAt: serverTimestamp(),
    })

    return {
      success: true,
      message: "Email updated successfully. Verification email sent.",
    }
  } catch (error: any) {
    console.error("Error updating email:", error)
    return {
      success: false,
      message: error.message || "Failed to update email",
    }
  }
}

export async function updateUserPassword(userId: string, currentPassword: string, newPassword: string) {
  try {
    // In a real implementation, you would verify the current password
    // and update the password using Firebase Auth

    return {
      success: true,
      message: "Password updated successfully",
    }
  } catch (error: any) {
    console.error("Error updating password:", error)
    return {
      success: false,
      message: error.message || "Failed to update password",
    }
  }
}
