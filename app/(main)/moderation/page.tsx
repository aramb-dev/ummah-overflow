import { ModeratorGuard } from "@/components/moderation/moderator-guard"
import { ModerationDashboard } from "@/components/moderation/moderation-dashboard"

export default function ModerationPage() {
  return (
    <ModeratorGuard>
      <ModerationDashboard />
    </ModeratorGuard>
  )
}
