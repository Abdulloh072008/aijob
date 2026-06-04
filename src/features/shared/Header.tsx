import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Search, 
  Sparkles, 
  LogOut, 
  User, 
  Settings, 
  Building2,
  ChevronDown,
  Users,
  Moon,
  Sun
} from "lucide-react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "../../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Navlist } from "./Navlist";
import { getUserRole, type UserRole } from "../../utils/role";
import { getToken } from "../../utils/token";

export const Header = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>("jobseeker");
  const [user, setUser] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    const userRole = getUserRole();
    setRole(userRole);
    
    const token = getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({
          name: payload.fullName || payload.name || "User",
          initial: (payload.fullName || payload.name || "U").charAt(0).toUpperCase(),
          logo: payload.logoUrl
        });
      } catch (e) {
        console.error("Error parsing token", e);
      }
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("store_token");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background text-foreground">
      <div className="mx-auto flex h-14 max-w-[1128px] items-center justify-between px-4">
        <div className="flex items-center gap-4 flex-1">
          <Link to={role === "organization" ? "/org/dashboard" : "/home"} className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 bg-[#0A66C2] rounded-md flex items-center justify-center text-white font-bold text-xl">in</div>
              <span className="text-[#0A66C2] font-bold text-xl hidden sm:inline">AIJob</span>
            </div>
            {role === "organization" && (
              <Badge variant="secondary" className="bg-[#EDF3F8] dark:bg-blue-900/30 text-[#0A66C2] dark:text-blue-400 border-none font-semibold text-[10px] px-1.5 py-0">
                For Business
              </Badge>
            )}
          </Link>

          <div className="relative max-w-[280px] w-full hidden md:block">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={role === "organization" ? "Search candidates, jobs..." : "Search"}
              className="pl-9 bg-[#EDF3F8] dark:bg-muted border-none h-9 focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>

        <div className="flex items-center h-full gap-1 sm:gap-2">
          <Navlist role={role} />

          <div className="h-8 w-[1px] bg-border mx-2 hidden sm:block" />

          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full h-8 w-8 text-muted-foreground" 
            onClick={toggleTheme}
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {role === "jobseeker" && (
            <Button 
              variant="default" 
              size="sm" 
              className="bg-[#0A66C2] hover:bg-[#004182] text-white rounded-full gap-1.5 hidden lg:flex"
              onClick={() => navigate("/ai")}
            >
              <Sparkles className="h-4 w-4" />
              AI Tools
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex flex-col items-center justify-center min-w-[64px] h-full text-muted-foreground hover:text-foreground outline-none group">
                <Avatar className="h-6 w-6 border">
                  <AvatarImage src={user?.logo} />
                  <AvatarFallback className={role === "organization" ? "bg-blue-50 dark:bg-blue-900/50 text-[#0A66C2] dark:text-blue-300 text-[10px]" : "text-[10px]"}>
                    {user?.initial || "Me"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center text-[10px] font-normal mt-0.5">
                  <span>{role === "organization" ? "Company" : "Me"}</span>
                  <ChevronDown className="h-3 w-3 ml-0.5" />
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover text-popover-foreground">
              <div className="flex items-center gap-2 p-2">
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src={user?.logo} />
                  <AvatarFallback className={role === "organization" ? "bg-blue-50 dark:bg-blue-900/50 text-[#0A66C2] dark:text-blue-300" : ""}>
                    {user?.initial}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-bold text-sm truncate">{user?.name}</span>
                  <span className="text-xs text-muted-foreground truncate">
                    {role === "organization" ? "Organization Account" : "Job Seeker"}
                  </span>
                </div>
              </div>
              <DropdownMenuSeparator />
              {role === "organization" ? (
                <>
                  <DropdownMenuItem onClick={() => navigate("/org/profile")}>
                    <Building2 className="mr-2 h-4 w-4" />
                    Company Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/org/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Account Settings
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/mynetwork")}>
                    <Users className="mr-2 h-4 w-4" />
                    My Network
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
