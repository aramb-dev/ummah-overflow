import { ModerationDashboard } from "@/components/moderation/moderation-dashboard"

export default function AdminModerationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Moderation</h1>
        <p className="text-muted-foreground">Review and moderate flagged content</p>
      </div>

      <ModerationDashboard />
    </div>
  )
}
