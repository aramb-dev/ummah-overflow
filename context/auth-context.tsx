"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<Error | null>(null)

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          setUser(user)
          setLoading(false)
        },
        (error) => {
          console.error("Auth state change error:", error)
          setAuthError(error)
          setLoading(false)
        },
      )

      return () => unsubscribe()
    } catch (error) {
      console.error("Auth initialization error:", error)
      setLoading(false)
    }
  }, [])

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Update the user's profile with the display name
      await updateProfile(user, { displayName })

      // Create a user document in Firestore
      try {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          displayName,
          username: displayName.toLowerCase().replace(/\s+/g, ""),
          createdAt: serverTimestamp(),
          reputation: 0,
          badges: {
            gold: 0,
            silver: 0,
            bronze: 0,
          },
        })
      } catch (firestoreError) {
        console.error("Error creating user document:", firestoreError)
        // Continue even if Firestore fails - the user is still authenticated
      }

      return
    } catch (error) {
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return
    } catch (error) {
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      const user = userCredential.user

      // Check if the user document already exists
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid))

        if (!userDoc.exists()) {
          // Create a user document in Firestore if it doesn't exist
          await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            username: user.displayName?.toLowerCase().replace(/\s+/g, "") || `user${user.uid.substring(0, 6)}`,
            photoURL: user.photoURL,
            createdAt: serverTimestamp(),
            reputation: 0,
            badges: {
              gold: 0,
              silver: 0,
              bronze: 0,
            },
          })
        }
      } catch (firestoreError) {
        console.error("Error checking/creating user document:", firestoreError)
        // Continue even if Firestore fails - the user is still authenticated
      }

      return
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      return
    } catch (error) {
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email)
      return
    } catch (error) {
      throw error
    }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    resetPassword,
  }

  // If there's an auth initialization error, render children anyway
  // This allows the app to function even if Firebase auth has issues
  if (authError) {
    console.error("Auth provider error:", authError)
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
