"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Check, Github, Mail, MessageSquare } from "lucide-react"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simple validation
    if (!name || !email || !subject || !message) {
      setError("Please fill out all fields")
      setLoading(false)
      return
    }

    // This is a placeholder for actual form submission logic
    // In a real application, you would submit this data to a server
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSubmitted(true)
      // Reset form
      setName("")
      setEmail("")
      setSubject("")
      setMessage("")
    } catch (err) {
      setError("There was an error submitting your message. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Contact Us</h1>
              <p className="text-muted-foreground">
                Have questions, feedback, or need support? We'd love to hear from you.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Email Us</h3>
                  <p className="text-sm text-muted-foreground">
                    For general inquiries:{" "}
                    <a href="mailto:info@ummahoverflow.com" className="text-primary hover:underline">
                      info@ummahoverflow.com
                    </a>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    For technical support:{" "}
                    <a href="mailto:support@ummahoverflow.com" className="text-primary hover:underline">
                      support@ummahoverflow.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Github className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">GitHub</h3>
                  <p className="text-sm text-muted-foreground">
                    For bug reports and feature requests, visit our GitHub repository:
                  </p>
                  <a
                    href="https://github.com/ummahoverflow/platform"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    github.com/ummahoverflow/platform
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Community</h3>
                  <p className="text-sm text-muted-foreground">
                    Join our community discussion on our dedicated Meta Q&A section:
                  </p>
                  <a href="/tags/meta" className="text-sm text-primary hover:underline">
                    UmmahOverflow Meta
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="font-medium mb-2">Response Time</h3>
              <p className="text-sm text-muted-foreground">
                We aim to respond to all inquiries within 24-48 hours during business days. For urgent matters, please
                indicate this in your message subject.
              </p>
            </div>
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
              <CardDescription>Fill out the form below to get in touch with our team.</CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <Alert className="border-green-500 text-green-500">
                  <Check className="h-4 w-4" />
                  <AlertDescription>Your message has been sent successfully. We'll be in touch soon!</AlertDescription>
                </Alert>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select value={subject} onValueChange={setSubject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="report">Report an Issue</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Your message"
                      rows={5}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
