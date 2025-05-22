import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Check, Code, MessageSquare, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container py-10 max-w-4xl">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">About UmmahOverflow</h1>
          <p className="text-muted-foreground">
            A Q&A platform created by and for Muslim developers to share knowledge and grow together.
          </p>
        </div>

        <Separator />

        <div className="prose dark:prose-invert max-w-none">
          <h2>Our Mission</h2>
          <p>
            UmmahOverflow was founded with a clear mission: to create a respectful, high-quality technical community
            where Muslim developers can support one another professionally. We believe in the power of knowledge sharing
            and collaborative problem-solving while upholding Islamic values of respect, integrity, and excellence.
          </p>

          <h2>Our Story</h2>
          <p>
            The idea for UmmahOverflow emerged from the experiences of Muslim developers who felt the need for a
            dedicated space where they could ask technical questions, share knowledge, and grow professionally in an
            environment aligned with their values. Existing platforms, while technically robust, often lacked cultural
            sensitivity and moderation policies that aligned with Islamic principles.
          </p>
          <p>
            Founded in 2023, UmmahOverflow set out to fill this gap by building a Stack Overflow-inspired platform
            specifically designed for the Muslim developer community. Our goal is to combine technical excellence with
            values-based community guidelines to create a truly unique developer resource.
          </p>

          <h2>Our Values</h2>
          <ul>
            <li>
              <strong>Respect:</strong> We foster an environment where all interactions are based on mutual respect,
              regardless of technical skill level or background.
            </li>
            <li>
              <strong>Excellence:</strong> We strive for technical excellence in both the platform we build and the
              content we host.
            </li>
            <li>
              <strong>Inclusion:</strong> We welcome all Muslim developers, from beginners to experts, across all
              technical disciplines.
            </li>
            <li>
              <strong>Knowledge Sharing:</strong> We believe in the Islamic principle that sharing knowledge is a form
              of charity (sadaqah jariyah).
            </li>
            <li>
              <strong>Integrity:</strong> We maintain high standards for content moderation and user conduct.
            </li>
          </ul>

          <h2>What Makes Us Different</h2>
          <div className="grid sm:grid-cols-2 gap-4 not-prose mt-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                  Values-Based Moderation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our moderation policies are designed to maintain a respectful environment aligned with Islamic values,
                  ensuring all content is appropriate and beneficial.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Code className="h-5 w-5 mr-2 text-primary" />
                  Technical Excellence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We prioritize high-quality technical content, with features specifically designed for developers,
                  including robust code formatting and syntax highlighting.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  Community-Focused
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our reputation system rewards helpful contributions and encourages community members to support one
                  another's professional growth.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Check className="h-5 w-5 mr-2 text-primary" />
                  Ad-Free Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We provide a clean, distraction-free environment without intrusive advertisements, allowing users to
                  focus on learning and sharing knowledge.
                </p>
              </CardContent>
            </Card>
          </div>

          <h2>Open Source</h2>
          <p>
            UmmahOverflow is proud to be an open-source project. We believe in transparency and community collaboration,
            and we invite developers to contribute to the platform's growth and improvement. By making our codebase open
            source, we hope to:
          </p>
          <ul>
            <li>Encourage innovation and continuous improvement</li>
            <li>Provide learning opportunities for developers</li>
            <li>Build trust through transparency</li>
            <li>Create a platform that truly belongs to the community it serves</li>
          </ul>

          <h2>Join Our Community</h2>
          <p>
            Whether you're a seasoned developer or just starting your journey, UmmahOverflow welcomes you. Join us in
            building a unique technical resource that serves the Muslim developer community while upholding our shared
            values.
          </p>
        </div>
      </div>
    </div>
  )
}
