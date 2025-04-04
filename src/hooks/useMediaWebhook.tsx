
import { useState, useEffect } from "react";
import { getMediaWebhookUrl, initMediaWebhookUrl } from "@/lib/api/mediaLibrary";

export function useMediaWebhook() {
  const [webhookUrl, setWebhookUrl] = useState<string>(getMediaWebhookUrl());
  
  useEffect(() => {
    const initWebhook = async () => {
      try {
        const url = await initMediaWebhookUrl();
        console.log(`[MediaLibrary] Webhook URL inicializado: ${url}`);
        setWebhookUrl(url);
      } catch (err) {
        console.error('[MediaLibrary] Erro ao inicializar webhook URL:', err);
      }
    };
    
    initWebhook();
  }, []);
  
  return webhookUrl;
}
