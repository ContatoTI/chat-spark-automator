
import React, { useState } from "react";
import { MediaLibraryDialog } from "@/components/media/MediaLibraryDialog";
import { MediaFile } from "@/lib/api/mediaLibrary";
import { CampaignNameInput } from "./message-tab/CampaignNameInput";
import { MediaTypeSelector } from "./message-tab/MediaTypeSelector";
import { MediaUrlInput } from "./message-tab/MediaUrlInput";
import { MessageTextareas } from "./message-tab/MessageTextareas";
import { useVariableInsertion } from "@/hooks/useVariableInsertion";

interface MessageTabProps {
  campaignName: string;
  setCampaignName: (value: string) => void;
  message1: string;
  setMessage1: (value: string) => void;
  message2: string;
  setMessage2: (value: string) => void;
  message3: string;
  setMessage3: (value: string) => void;
  message4: string;
  setMessage4: (value: string) => void;
  mediaType: string | null;
  setMediaType: (value: string | null) => void;
  mediaUrl: string;
  setMediaUrl: (value: string) => void;
  handleMediaSelection: (type: string) => void;
}

export const MessageTab: React.FC<MessageTabProps> = ({
  campaignName,
  setCampaignName,
  message1,
  setMessage1,
  message2,
  setMessage2,
  message3,
  setMessage3,
  message4,
  setMessage4,
  mediaType,
  mediaUrl,
  setMediaUrl,
  handleMediaSelection,
}) => {
  const [mediaLibraryOpen, setMediaLibraryOpen] = useState(false);
  
  const { activeTextarea, setActiveTextarea, insertVariable: insertVariableBase } = 
    useVariableInsertion({ campaignName, setCampaignName });
  
  const handleMediaFileSelect = (file: MediaFile) => {
    setMediaUrl(file.url);
  };

  const insertVariable = (variable: string) => {
    insertVariableBase(variable, {
      message1,
      setMessage1,
      message2,
      setMessage2,
      message3,
      setMessage3,
      message4,
      setMessage4,
    });
  };

  return (
    <div className="space-y-6">
      <CampaignNameInput 
        campaignName={campaignName}
        setCampaignName={setCampaignName}
        insertVariable={insertVariable}
      />
      
      <div className="space-y-4">
        <MediaTypeSelector 
          mediaType={mediaType}
          handleMediaSelection={handleMediaSelection}
        />
        
        <MediaUrlInput 
          mediaType={mediaType}
          mediaUrl={mediaUrl}
          setMediaUrl={setMediaUrl}
          onOpenMediaLibrary={() => setMediaLibraryOpen(true)}
        />
        
        <MessageTextareas 
          message1={message1}
          setMessage1={setMessage1}
          message2={message2}
          setMessage2={setMessage2}
          message3={message3}
          setMessage3={setMessage3}
          message4={message4}
          setMessage4={setMessage4}
          setActiveTextarea={setActiveTextarea}
        />
      </div>
      
      {/* Media Library Dialog */}
      <MediaLibraryDialog
        open={mediaLibraryOpen}
        onOpenChange={setMediaLibraryOpen}
        onSelect={handleMediaFileSelect}
        currentType={
          mediaType === 'image' ? 'image' :
          mediaType === 'video' ? 'video' :
          'document'
        }
      />
    </div>
  );
};
