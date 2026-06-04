import { getToken } from "./token";

export type UserRole = "organization" | "jobseeker";

export const getUserRole = (): UserRole => {
  const token = getToken();
  if (!token) return "jobseeker";

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || payload.role || payload.userType || "";
    
    const orgRoles = ["org", "company", "employer", "organization", "Organization"];
    if (orgRoles.some(r => role.toLowerCase().includes(r.toLowerCase()))) {
      return "organization";
    }
  } catch (e) {
    console.error("Failed to decode token for role detection", e);
  }

  return "jobseeker";
};
