import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="container py-10 max-w-4xl">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: May 21, 2024</p>
        </div>

        <Separator />

        <div className="prose dark:prose-invert max-w-none">
          <p>
            At UmmahOverflow, we respect your privacy and are committed to protecting your personal data. This Privacy
            Policy explains how we collect, use, and safeguard your information when you use our platform.
          </p>

          <h2>Information We Collect</h2>
          <p>We collect several types of information from and about users of our platform, including:</p>
          <ul>
            <li>
              <strong>Personal identifiers:</strong> Such as your name, email address, and username when you create an
              account.
            </li>
            <li>
              <strong>Profile information:</strong> Any additional information you choose to add to your profile, such
              as your bio, location, or website.
            </li>
            <li>
              <strong>User-generated content:</strong> Questions, answers, comments, and other content you post on the
              platform.
            </li>
            <li>
              <strong>Usage data:</strong> Information about how you interact with our platform, including pages
              visited, features used, and time spent.
            </li>
            <li>
              <strong>Technical data:</strong> IP address, browser type and version, device information, and other
              technical identifiers.
            </li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use the information we collect for various purposes, including:</p>
          <ul>
            <li>Providing, maintaining, and improving our platform</li>
            <li>Processing your account registration and maintaining your account</li>
            <li>Enabling you to interact with other users through questions, answers, and comments</li>
            <li>Sending you notifications about activity relevant to you</li>
            <li>Enforcing our community guidelines and moderating content</li>
            <li>Understanding how users interact with our platform to improve user experience</li>
            <li>Protecting against unauthorized access and other security issues</li>
          </ul>

          <h2>Data Storage and Security</h2>
          <p>
            UmmahOverflow uses Firebase, a platform developed by Google, for authentication and data storage. Your data
            is protected according to Google's security standards and practices. We implement appropriate technical and
            organizational measures to protect your personal information against unauthorized access, alteration,
            disclosure, or destruction.
          </p>

          <h2>User Content</h2>
          <p>
            When you post questions, answers, or comments on UmmahOverflow, this content is visible to other users of
            the platform. You can choose to post anonymously for specific questions if you prefer not to have your
            username associated with certain content.
          </p>

          <h2>Third-Party Services</h2>
          <p>UmmahOverflow uses certain third-party services to support our platform's functionality. These include:</p>
          <ul>
            <li>
              <strong>Firebase:</strong> For authentication, database, and hosting services
            </li>
            <li>
              <strong>Vercel:</strong> For hosting and deployment
            </li>
          </ul>
          <p>
            Each of these services has their own privacy policies governing how they handle user data. We encourage you
            to review their policies as well.
          </p>

          <h2>Your Rights</h2>
          <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
          <ul>
            <li>The right to access the personal information we hold about you</li>
            <li>The right to request correction of inaccurate information</li>
            <li>The right to request deletion of your personal information</li>
            <li>The right to restrict or object to processing of your information</li>
            <li>The right to data portability</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us using the information provided in the "Contact Us"
            section.
          </p>

          <h2>Cookies and Similar Technologies</h2>
          <p>
            UmmahOverflow uses cookies and similar tracking technologies to enhance user experience and collect usage
            information. You can set your browser to refuse all or some browser cookies, but this may affect certain
            functionality of our platform.
          </p>

          <h2>Children's Privacy</h2>
          <p>
            UmmahOverflow is not intended for children under 13 years of age. We do not knowingly collect personal
            information from children under 13. If you are a parent or guardian and believe your child has provided us
            with personal information, please contact us.
          </p>

          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
            Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy
            Policy periodically for any changes.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at{" "}
            <Link href="mailto:privacy@ummahoverflow.com">privacy@ummahoverflow.com</Link> or visit our{" "}
            <Link href="/contact">Contact page</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
