"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { AdminAccountForm, type AccountUser } from "./AdminAccountForm";
import { TeamMemberManager } from "./TeamMemberManager";
import { PlatformSettingsForm, type PlatformSettingsView } from "./PlatformSettingsForm";

interface AdminSettingsPanelProps {
  currentUser: AccountUser;
  teamMembers: AccountUser[];
  canManageTeam: boolean;
  platformSettings: PlatformSettingsView;
}

type Tab = "account" | "team" | "platform";

export function AdminSettingsPanel({
  currentUser,
  teamMembers,
  canManageTeam,
  platformSettings,
}: AdminSettingsPanelProps) {
  const tabs: { id: Tab; label: string; show?: boolean }[] = [
    { id: "account", label: "Mon compte" },
    { id: "team", label: "Équipe", show: canManageTeam },
    { id: "platform", label: "Plateforme" },
  ];

  const [active, setActive] = useState<Tab>("account");

  return (
    <div>
      <nav className="flex flex-wrap gap-2 border-b border-brand-100 pb-1 mb-8">
        {tabs
          .filter((t) => t.show !== false)
          .map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={cn(
                "px-4 py-2.5 text-xs uppercase tracking-widest transition-colors border-b-2 -mb-px",
                active === tab.id
                  ? "border-brand-950 text-brand-950 font-medium"
                  : "border-transparent text-brand-400 hover:text-brand-700"
              )}
            >
              {tab.label}
            </button>
          ))}
      </nav>

      {active === "account" && <AdminAccountForm user={currentUser} />}

      {active === "team" && canManageTeam && (
        <TeamMemberManager
          initialMembers={teamMembers}
          actorRole={currentUser.role}
          currentUserId={currentUser.id}
        />
      )}

      {active === "platform" && (
        <PlatformSettingsForm initial={platformSettings} canEdit={canManageTeam} />
      )}
    </div>
  );
}
