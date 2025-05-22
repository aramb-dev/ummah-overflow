import { ModeratorGuard } from "@/components/moderation/moderator-guard"
import { UserManagement } from "@/components/moderation/user-management"

export default function UserManagementPage() {
  return (
    <ModeratorGuard>
      <UserManagement />
    </ModeratorGuard>
  )
}
