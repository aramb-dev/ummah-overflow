"use client"

import type React from "react"

import { useState } from "react"
import { ArrowUp, ArrowDown, Check, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { UserAvatar } from "@/components/user-avatar"
import { FlagButton } from "@/components/moderation/flag-button"

// Sample question data
const question = {
  id: 1,
  title: "How to implement authentication with Next.js and Firebase?",
  body: `I'm building a Next.js application and I want to implement authentication using Firebase. I've followed the Firebase documentation, but I'm having trouble integrating it with Next.js.

Here's my current code:

\`\`\`jsx
// pages/_app.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
\`\`\`

I'm getting the following error:

\`\`\`
Error: Firebase: Firebase App named '[DEFAULT]' already exists (app/duplicate-app).
\`\`\`

How can I fix this issue and properly implement authentication in my Next.js application?`,
  tags: ["next.js", "firebase", "authentication"],
  votes: 15,
  author: {
    name: "Ahmed Khan",
    email: "ahmed@example.com",
    reputation: 1234,
    isAnonymous: false,
  },
  createdAt: "2023-05-15T10:30:00Z",
  hijriDate: "1444-10-25",
}

// Sample answers data
const answers = [
  {
    id: 1,
    body: `The error you're seeing is because Firebase is being initialized multiple times. In Next.js, your code can run multiple times due to hot reloading during development.

To fix this, you should use a singleton pattern to ensure Firebase is only initialized once:

\`\`\`jsx
// lib/firebase.js
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase only if it hasn't been initialized already
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const auth = getAuth(app);
\`\`\`

Then import and use this in your components:

\`\`\`jsx
import { auth } from '../lib/firebase';
\`\`\`

This ensures Firebase is only initialized once, even if the module is imported multiple times.`,
    votes: 23,
    isAccepted: true,
    author: {
      name: "Fatima Ali",
      email: "fatima@example.com",
      reputation: 9876,
      isAnonymous: false,
    },
    createdAt: "2023-05-15T11:45:00Z",
    hijriDate: "1444-10-25",
  },
  {
    id: 2,
    body: `Another approach is to use React Context to manage your Firebase authentication state. This is a more React-friendly way to handle authentication in your Next.js app:

\`\`\`jsx
// context/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
\`\`\`

Then wrap your app with this provider:

\`\`\`jsx
// pages/_app.js
import { AuthContextProvider } from '../context/AuthContext';

function MyApp({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <Component {...pageProps} />
    </AuthContextProvider>
  );
}

export default MyApp;
\`\`\`

Now you can access the user in any component:

\`\`\`jsx
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { user } = useAuth();
  
  if (!user) {
    return <div>Please log in</div>;
  }
  
  return <div>Welcome, {user.email}</div>;
}
\`\`\``,
    votes: 12,
    isAccepted: false,
    author: {
      name: "Omar Farooq",
      email: "omar@example.com",
      reputation: 8765,
      isAnonymous: false,
    },
    createdAt: "2023-05-15T14:20:00Z",
    hijriDate: "1444-10-25",
  },
]

export default function QuestionPage({ params }: { params: { id: string } }) {
  const [newAnswer, setNewAnswer] = useState("")
  const [questionVote, setQuestionVote] = useState(question.votes)
  const [answerVotes, setAnswerVotes] = useState(answers.map((a) => a.votes))

  const handleQuestionVote = (value: number) => {
    setQuestionVote((prev) => prev + value)
  }

  const handleAnswerVote = (index: number, value: number) => {
    setAnswerVotes((prev) => {
      const newVotes = [...prev]
      newVotes[index] = newVotes[index] + value
      return newVotes
    })
  }

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle answer submission
    console.log({ questionId: params.id, body: newAnswer })
    setNewAnswer("")
  }

  return (
    <div className="container py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">{question.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span>Asked {new Date(question.createdAt).toLocaleDateString()}</span>
          <span className="text-xs">({question.hijriDate})</span>
        </div>
      </div>

      <div className="grid grid-cols-[auto,1fr] gap-4 mb-8">
        <div className="flex flex-col items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleQuestionVote(1)} className="h-8 w-8">
            <ArrowUp className="h-4 w-4" />
          </Button>
          <span className="font-medium">{questionVote}</span>
          <Button variant="ghost" size="icon" onClick={() => handleQuestionVote(-1)} className="h-8 w-8">
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
        <div>
          <div className="prose dark:prose-invert max-w-none mb-4">
            <div dangerouslySetInnerHTML={{ __html: question.body.replace(/\n/g, "<br>") }} />
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {question.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="rounded-md">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <FlagButton contentId={question.id.toString()} contentType="question" />
            <div className="flex items-center gap-2 bg-muted/30 p-3 rounded-md">
              <div className="text-sm text-muted-foreground">Asked by</div>
              <UserAvatar
                username={question.author.name}
                user={{
                  displayName: question.author.name,
                  email: question.author.email,
                }}
                isAnonymous={question.author.isAnonymous}
                size="sm"
              />
              <div>
                <div className="font-medium">{question.author.name}</div>
                <div className="text-xs text-muted-foreground">
                  {question.author.reputation.toLocaleString()} reputation
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="h-5 w-5" />
          <h2 className="text-xl font-semibold">{answers.length} Answers</h2>
        </div>

        <div className="space-y-8">
          {answers.map((answer, index) => (
            <div
              key={answer.id}
              className={`grid grid-cols-[auto,1fr] gap-4 pb-8 ${answer.isAccepted ? "bg-green-50/10 p-4 rounded-md border border-green-200/20" : ""}`}
            >
              <div className="flex flex-col items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleAnswerVote(index, 1)} className="h-8 w-8">
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <span className="font-medium">{answerVotes[index]}</span>
                <Button variant="ghost" size="icon" onClick={() => handleAnswerVote(index, -1)} className="h-8 w-8">
                  <ArrowDown className="h-4 w-4" />
                </Button>
                {answer.isAccepted && (
                  <div className="text-green-500 mt-2" title="Accepted answer">
                    <Check className="h-6 w-6" />
                  </div>
                )}
              </div>
              <div>
                <div className="prose dark:prose-invert max-w-none mb-4">
                  <div dangerouslySetInnerHTML={{ __html: answer.body.replace(/\n/g, "<br>") }} />
                </div>
                <div className="flex justify-between items-center">
                  <FlagButton contentId={answer.id.toString()} contentType="answer" />
                  <div className="flex items-center gap-2 bg-muted/30 p-3 rounded-md">
                    <div className="text-sm text-muted-foreground">Answered by</div>
                    <UserAvatar
                      username={answer.author.name}
                      user={{
                        displayName: answer.author.name,
                        email: answer.author.email,
                      }}
                      isAnonymous={answer.author.isAnonymous}
                      size="sm"
                    />
                    <div>
                      <div className="font-medium">{answer.author.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {answer.author.reputation.toLocaleString()} reputation
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-8" />

      <div>
        <h2 className="text-xl font-semibold mb-4">Your Answer</h2>
        <form onSubmit={handleSubmitAnswer} className="space-y-4">
          <div className="border rounded-md overflow-hidden">
            <div className="bg-muted px-3 py-2 border-b flex gap-2">
              <Button type="button" variant="ghost" size="sm">
                Bold
              </Button>
              <Button type="button" variant="ghost" size="sm">
                Italic
              </Button>
              <Button type="button" variant="ghost" size="sm">
                Code
              </Button>
              <Button type="button" variant="ghost" size="sm">
                Link
              </Button>
            </div>
            <Textarea
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Write your answer here..."
              className="min-h-[200px] border-0 focus-visible:ring-0 resize-none"
              required
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Supports Markdown. You can use `code`, **bold**, *italic*, and more.
          </p>
          <Button type="submit">Post Your Answer</Button>
        </form>
      </div>
    </div>
  )
}
