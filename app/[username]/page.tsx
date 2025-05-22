import { redirect } from "next/navigation"
import { collection, query, where, getDocs, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"
import UserProfile from "@/app/(main)/users/[id]/page"

export default async function UsernamePage({ params }: { params: { username: string } }) {
  const { username } = params

  // Query Firestore to find the user with this username
  const usersRef = collection(db, "users")
  const q = query(usersRef, where("username", "==", username.toLowerCase()), limit(1))
  const querySnapshot = await getDocs(q)

  // If no user found with this username, redirect to 404
  if (querySnapshot.empty) {
    redirect("/404")
  }

  // Get the user ID
  const userId = querySnapshot.docs[0].id

  // Render the user profile page with the found user ID
  return <UserProfile params={{ id: userId }} />
}
