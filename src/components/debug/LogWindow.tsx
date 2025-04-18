
import React from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface LogWindowProps {
  title: string;
  logs: any[];
  onClose?: () => void;
}

export function LogWindow({ title, logs, onClose }: LogWindowProps) {
  if (!logs || logs.length === 0) return null;

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-96 bg-background border shadow-lg flex flex-col z-50">
      <div className="flex justify-between items-center p-3 border-b">
        <h3 className="font-semibold text-sm">{title}</h3>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1 p-3">
        {logs.map((log, index) => (
          <div key={index} className="mb-3">
            <div className="text-xs text-muted-foreground mb-1">
              {new Date(log.timestamp).toLocaleTimeString()}
            </div>
            <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
              {JSON.stringify(log.data, null, 2)}
            </pre>
          </div>
        ))}
      </ScrollArea>
    </Card>
  );
}
