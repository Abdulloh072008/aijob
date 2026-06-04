import { Moon, Sun } from "lucide-react"
import { useTheme } from "./ThemeProvider"
import { Switch } from "@/components/ui/switch"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()

    const isDark = theme === "dark"

    const toggleTheme = () => {
        setTheme(isDark ? "light" : "dark")
    }

    return (
        <div className="flex items-center gap-2 px-2">
            {isDark ? (
                <Sun className="h-4 w-4 text-yellow-500" />
            ) : (
                <Moon className="h-4 w-4 text-slate-400" />
            )}
            <Switch 
                checked={isDark} 
                onCheckedChange={toggleTheme}
            />

        </div>
    )
}
