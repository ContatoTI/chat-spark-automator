
import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="h-9 w-9 rounded-md hover:bg-gray-200 dark:hover:bg-slate-700"
            aria-label="Alternar tema"
          >
            {isDark ? (
              <Sun className="h-[1.2rem] w-[1.2rem] text-amber-400" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem] text-slate-700 dark:text-slate-200" />
            )}
            <span className="sr-only">Alternar tema</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isDark ? "Modo claro" : "Modo escuro"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
