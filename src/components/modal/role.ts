export const getUserRole = (): "organization" | "jobseeker" => {
  const token = localStorage.getItem("store_token");
  if (!token) return "jobseeker";
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const role = (payload.role || payload.userType || "").toLowerCase();
    if (["org", "company", "employer", "organization"].includes(role)) return "organization";
    return "jobseeker";
  } catch {
    return "jobseeker";
  }
};