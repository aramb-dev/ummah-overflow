import { notFound } from "next/navigation"

interface User {
  id: number
  name: string
  email: string
  phone: string
  website: string
}

async function getUser(id: string): Promise<User> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)

  if (!res.ok) return undefined

  return await res.json()
}

export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }]
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const user = await getUser(params.id)

  if (!user) {
    return {
      title: "User Not Found",
    }
  }

  return {
    title: user.name,
    description: `Profile page of ${user.name}`,
  }
}

export default async function UserPage({ params }: { params: { id: string } }) {
  const user = await getUser(params.id)

  if (!user) {
    notFound()
  }

  return (
    <div className="container py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <img
          src={`https://robohash.org/${user.id}?set=set2&size=180x180`}
          alt={user.name}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full"
        />
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone}</p>
          <p>Website: {user.website}</p>
        </div>
      </div>
    </div>
  )
}
