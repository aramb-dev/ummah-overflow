import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="container py-10 max-w-4xl">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: May 21, 2024</p>
        </div>

        <Separator />

        <div className="prose dark:prose-invert max-w-none">
          <p>
            Welcome to UmmahOverflow. By accessing or using our platform, you agree to be bound by these Terms of
            Service. Please read them carefully.
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using UmmahOverflow, you agree to be bound by these Terms of Service and all applicable laws
            and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing
            this platform.
          </p>

          <h2>2. User Accounts</h2>
          <p>
            To participate fully in UmmahOverflow, you must create an account. When you create an account, you agree to
            provide accurate, current, and complete information. You are responsible for maintaining the confidentiality
            of your account credentials and for all activities that occur under your account.
          </p>
          <p>UmmahOverflow reserves the right to terminate accounts that violate our community guidelines or terms.</p>

          <h2>3. User Content</h2>
          <p>
            When you post content on UmmahOverflow, you retain ownership of your content, but you grant us a worldwide,
            non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute
            your content in any medium and any format.
          </p>
          <p>You represent and warrant that:</p>
          <ul>
            <li>You own or have the necessary rights to the content you post</li>
            <li>Your content does not violate the rights of any third party</li>
            <li>Your content complies with these Terms of Service and our Community Guidelines</li>
          </ul>

          <h2>4. Community Guidelines</h2>
          <p>All users of UmmahOverflow must adhere to our Community Guidelines, which include:</p>
          <ul>
            <li>Treating all users with respect and dignity</li>
            <li>Refraining from posting offensive, harmful, or inappropriate content</li>
            <li>
              Not engaging in spamming, harassment, or any activities that disrupt the positive community environment
            </li>
            <li>
              Ensuring that technical content is accurate to the best of your knowledge and helpful to the community
            </li>
            <li>Respecting intellectual property rights and providing proper attribution when necessary</li>
          </ul>
          <p>
            Violations of our Community Guidelines may result in content removal, account suspension, or termination.
          </p>

          <h2>5. Content Moderation</h2>
          <p>
            UmmahOverflow reserves the right to moderate, edit, or remove any content that violates our Terms of Service
            or Community Guidelines. We employ both automated systems and human moderators to maintain the quality and
            appropriateness of content on our platform.
          </p>
          <p>
            Users can flag inappropriate content for review by our moderation team. We strive to review all flagged
            content promptly, but response times may vary based on volume.
          </p>

          <h2>6. Intellectual Property</h2>
          <p>
            The UmmahOverflow platform, including its logo, design, code, and features, is protected by copyright,
            trademark, and other intellectual property laws. You may not copy, modify, distribute, or create derivative
            works based on our platform without explicit permission.
          </p>

          <h2>7. Reputation System and Badges</h2>
          <p>
            UmmahOverflow uses a reputation system and badges to recognize user contributions. These virtual rewards
            have no monetary value and remain the property of UmmahOverflow. We reserve the right to adjust reputation
            scores and badges at our discretion to maintain system integrity.
          </p>

          <h2>8. Privacy</h2>
          <p>
            Your use of UmmahOverflow is also governed by our <Link href="/privacy">Privacy Policy</Link>, which is
            incorporated into these Terms of Service by reference.
          </p>

          <h2>9. Disclaimer of Warranties</h2>
          <p>
            UmmahOverflow is provided "as is" and "as available" without any warranties of any kind, either express or
            implied. We do not guarantee that the platform will be uninterrupted, secure, or error-free.
          </p>

          <h2>10. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, UmmahOverflow shall not be liable for any indirect, incidental,
            special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly
            or indirectly, or any loss of data, use, goodwill, or other intangible losses.
          </p>

          <h2>11. Modification of Terms</h2>
          <p>
            UmmahOverflow reserves the right to modify these Terms of Service at any time. We will provide notice of
            significant changes by posting the updated terms on our platform with a new "Last updated" date. Your
            continued use of UmmahOverflow after such changes constitutes your acceptance of the new terms.
          </p>

          <h2>12. Governing Law</h2>
          <p>
            These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction in
            which UmmahOverflow operates, without regard to its conflict of law provisions.
          </p>

          <h2>13. Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at{" "}
            <Link href="mailto:terms@ummahoverflow.com">terms@ummahoverflow.com</Link> or visit our{" "}
            <Link href="/contact">Contact page</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
