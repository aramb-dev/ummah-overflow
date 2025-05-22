// User roles
export type UserRole = "user" | "moderator" | "admin"

// Flag reasons
export type FlagReason =
  | "spam"
  | "rude_or_abusive"
  | "low_quality"
  | "off_topic"
  | "needs_improvement"
  | "plagiarism"
  | "other"

// Flag status
export type FlagStatus = "pending" | "approved" | "rejected" | "resolved"

// Flag content type
export type FlagContentType = "question" | "answer" | "comment"

// Flag interface
export interface Flag {
  id?: string
  contentId: string
  contentType: FlagContentType
  reason: FlagReason
  description?: string
  reporterId: string
  status: FlagStatus
  createdAt: any // Firestore timestamp
  updatedAt: any // Firestore timestamp
  reviewerId?: string
  reviewNote?: string
  reviewedAt?: any // Firestore timestamp
}

// Extended user interface with roles
export interface User {
  uid: string
  email: string
  displayName: string
  username: string
  photoURL?: string
  bio?: string
  reputation: number
  badges: {
    gold: number
    silver: number
    bronze: number
  }
  role: UserRole
  createdAt: any // Firestore timestamp
  isBanned?: boolean
  banReason?: string
  bannedUntil?: any // Firestore timestamp
}
