import { Link, useLocation } from "react-router-dom";
import { Home, Users, Briefcase, MessageSquare, Bell, BarChart2 } from "lucide-react";
import { cn } from "../../lib/utils";

interface NavlistProps {
  role: "organization" | "jobseeker";
}

export const Navlist = ({ role }: NavlistProps) => {
  const location = useLocation();

  const links = role === "organization"
    ? [
        { label: "Dashboard", to: "/dashboard", icon: Home },
        { label: "Job Posts", to: "/postjob", icon: Briefcase },
        { label: "Applicants", to: "/application", icon: Users },
        { label: "Messaging", to: "/messages", icon: MessageSquare },
        { label: "Analytics", to: "/analytics", icon: BarChart2 },
      ]
    : [
        { label: "Home", to: "/home", icon: Home },
        { label: "My Network", to: "/mynetwork", icon: Users },
        { label: "Jobs", to: "/jobs", icon: Briefcase },
        { label: "Messaging", to: "/messages", icon: MessageSquare },
        { label: "Notifications", to: "/notifications", icon: Bell },
      ];

  return (
    <nav className="flex items-center space-x-1 h-full">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = location.pathname === link.to;
        return (
          <Link
            key={link.to}
            to={link.to}
            className={cn(
              "flex flex-col items-center justify-center min-w-[72px] h-full text-xs font-normal text-muted-foreground hover:text-foreground relative transition-colors pt-1",
              isActive && "text-[#0A66C2] hover:text-[#0A66C2]"
            )}
          >
            <Icon className="h-5 w-5 mb-0.5" />
            <span className="hidden sm:inline">{link.label}</span>
            {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0A66C2]" />}
          </Link>
        );
      })}
    </nav>
  );
};