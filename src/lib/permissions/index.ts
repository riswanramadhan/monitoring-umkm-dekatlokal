export const appRoles = ["superadmin", "viewer"] as const;
export type AppRole = (typeof appRoles)[number];

export const permissions = {
  superadmin: new Set([
    "read",
    "edit",
    "verify",
    "export_full",
    "reveal_pii",
    "manage_modules",
    "manage_users",
    "override_score",
    "delete_restore",
    "read_audit",
  ]),
  viewer: new Set(["read", "export_masked"]),
} as const;

export type Permission =
  | "read"
  | "edit"
  | "verify"
  | "export_full"
  | "export_masked"
  | "reveal_pii"
  | "manage_modules"
  | "progress_modules"
  | "manage_users"
  | "override_score"
  | "delete_restore"
  | "read_audit";

export function can(role: AppRole, permission: Permission) {
  return (permissions[role] as ReadonlySet<string>).has(permission);
}
