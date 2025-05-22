/**
 * Utility functions for generating Vercel avatars
 */

// Generate a Vercel avatar URL for a user
export function getVercelAvatar(username: string, email?: string, size = 80) {
  // Use email for more consistent avatars if available
  const identifier = email || username

  // Create a URL-safe hash from the identifier
  const safeIdentifier = encodeURIComponent(identifier)

  // Generate the Vercel avatar URL
  return `https://avatar.vercel.sh/${safeIdentifier}?size=${size}`
}

// Generate a fallback avatar for anonymous users
export function getAnonymousAvatar(size = 80) {
  return `https://avatar.vercel.sh/anonymous?size=${size}`
}
