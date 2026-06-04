import { useNavigate, Link } from "react-router-dom";
import { Search, Sparkles, LogOut, Building2, User } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { getUserRole } from "../role";
import { ModeToggle } from "../../shared/theme-provider/ModeToggle";
import { Navlist } from "../../shared/Navlist";

export const Header = () => {
  const navigate = useNavigate();
  const role = getUserRole();

  const handleLogout = () => {
    localStorage.removeItem("store_token");
    navigate("/login");
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white h-14">
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Link to={role === "organization" ? "/org/dashboard" : "/home"} className="flex items-center gap-1 shrink-0 font-bold text-xl text-[#0A66C2]">
            AIJob
          </Link>
          {role === "organization" && (
            <Badge className="bg-[#EDF3F8] text-[#0A66C2] hover:bg-[#EDF3F8] border-none font-semibold text-xs px-2 py-0.5 rounded-full shrink-0">
              For Business
            </Badge>
          )}
          <div className="relative w-full max-w-[280px] hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={role === "organization" ? "Search candidates, jobs..." : "Search..."}
              className="pl-9 h-9 bg-[#F3F2EF] border-none focus-visible:ring-1 focus-visible:ring-[#0A66C2]"
            />
          </div>
        </div>
        <div className="flex items-center h-full gap-4 shrink-0">
          <Navlist role={role} />
          <div className="h-8 w-px bg-border" />
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <Avatar className="h-8 w-8 cursor-pointer rounded-full border">
                  <AvatarFallback className={role === "organization" ? "bg-[#EDF3F8] text-[#0A66C2]" : "bg-muted text-muted-foreground"}>
                    {role === "organization" ? <Building2 className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 mt-1">
                {role === "organization" ? (
                  <>
                    <DropdownMenuItem onClick={() => navigate("/orgprofile")}>Company Profile</DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => navigate("/profile")}>My Profile</DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {role === "jobseeker" && (
              <button
                onClick={() => navigate("/ai")}
                className="bg-[#0A66C2] hover:bg-[#004182] text-white font-medium text-sm px-4 py-1.5 rounded-full flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Sparkles className="h-4 w-4" />
                <span>AI Tools</span>
              </button>
            )}
            <ModeToggle/>
          </div>
        </div>
      </div>
    </header>
  );
};