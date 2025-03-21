
import React from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopBarProps {
  setSidebarOpen: (open: boolean) => void;
  sidebarOpen: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ setSidebarOpen, sidebarOpen }) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 sm:px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Button
        variant="ghost"
        className="mr-2 md:mr-4 p-0 w-9 h-9 rounded-full"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <span className="sr-only">Toggle menu</span>
        {sidebarOpen ? (
          <X className="h-5 w-5 text-muted-foreground" />
        ) : (
          <Menu className="h-5 w-5 text-muted-foreground" />
        )}
      </Button>
      <div className="flex items-center gap-2">
        <div className={cn(
          "h-8 w-8 rounded-full bg-whatsapp flex items-center justify-center",
          "shadow-sm transition-all duration-300"
        )}>
          <svg 
            className="w-5 h-5 text-white" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.18 2.094 3.195 5.073 4.485.709.3 1.263.48 1.694.625.714.227 1.365.195 1.88.125.571-.075 1.758-.721 2.006-1.42.255-.705.255-1.305.18-1.425-.074-.15-.27-.225-.57-.375z"/>
            <path d="M12.002 21.75c-2.568 0-5.067-.834-7.127-2.392l-.136-.115-2.764.714.728-2.68-.124-.142a10.75 10.75 0 01-2.579-7.003c0-5.935 4.832-10.767 10.768-10.767s10.767 4.832 10.767 10.767-4.831 10.768-10.767 10.768H12zm0-19.534c-4.833 0-8.767 3.935-8.767 8.767 0 2.223.847 4.346 2.39 5.963l.235.245-.993 3.657 3.74-.966.253.224a8.725 8.725 0 005.548 1.96h.002c4.833 0 8.766-3.933 8.766-8.767 0-4.832-3.933-8.767-8.766-8.767H12z" />
          </svg>
        </div>
        <h1 className="text-xl font-medium">
          AutomaWhats
        </h1>
      </div>
      <div className="ml-auto flex items-center gap-2">
        {/* Profile section - would contain user profile/settings */}
        <div className="h-8 w-8 rounded-full bg-muted" />
      </div>
    </header>
  );
};
