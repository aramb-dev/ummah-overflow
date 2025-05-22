import { Suspense } from "react"
import { notFound } from "next/navigation"
import { collection, query, where, getDocs, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { QuestionList } from "@/components/question-list"
import { Skeleton } from "@/components/ui/skeleton"

async function getTagInfo(tagname: string) {
  const tagsRef = collection(db, "tags")
  const q = query(tagsRef, where("name", "==", tagname.toLowerCase()), limit(1))
  const querySnapshot = await getDocs(q)

  if (querySnapshot.empty) {
    return null
  }

  return {
    id: querySnapshot.docs[0].id,
    ...querySnapshot.docs[0].data(),
  }
}

export default async function TagPage({ params }: { params: { tagname: string } }) {
  const { tagname } = params
  const tag = await getTagInfo(tagname)

  if (!tag) {
    notFound()
  }

  return (
    <div className="container py-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="px-3 py-1 text-base rounded-md">
              {tag.name}
            </Badge>
            <span className="text-muted-foreground">
              {tag.count} {tag.count === 1 ? "question" : "questions"}
            </span>
          </div>
          <CardDescription className="mt-2">{tag.description}</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Questions tagged [{tag.name}]</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<QuestionsLoading />}>
            <QuestionList tag={tag.name} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}

function QuestionsLoading() {
  return (
    <div className="space-y-4">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="p-4 border rounded-md">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
        ))}
    </div>
  )
}
