
import { useRef, useState } from "react";

interface UseVariableInsertionParams {
  campaignName: string;
  setCampaignName: (value: string) => void;
}

export const useVariableInsertion = ({
  campaignName,
  setCampaignName,
}: UseVariableInsertionParams) => {
  const [activeTextarea, setActiveTextarea] = useState<"message1" | "message2" | "message3" | "message4" | null>(null);
  const campaignNameRef = useRef<HTMLInputElement>(null);

  const insertVariable = (
    variable: string,
    {
      message1,
      setMessage1,
      message2,
      setMessage2,
      message3,
      setMessage3,
      message4,
      setMessage4,
    }: {
      message1: string;
      setMessage1: (value: string) => void;
      message2: string;
      setMessage2: (value: string) => void;
      message3: string;
      setMessage3: (value: string) => void;
      message4: string;
      setMessage4: (value: string) => void;
    }
  ) => {
    // Verificar qual é o elemento ativo no momento
    const activeElement = document.activeElement;
    
    // Verifique se o campo de nome da campanha está ativo
    if (activeElement === campaignNameRef.current) {
      const input = campaignNameRef.current;
      if (input) {
        const startPos = input.selectionStart || 0;
        const endPos = input.selectionEnd || 0;
        const newValue = campaignName.substring(0, startPos) + variable + campaignName.substring(endPos);
        setCampaignName(newValue);
        
        // Set cursor position after the inserted variable
        setTimeout(() => {
          input.focus();
          const newCursorPos = startPos + variable.length;
          input.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
        return;
      }
    }
    
    // Inserir variável no textarea ativo
    let setValue: (value: string) => void = () => {};
    let currentValue = "";
    
    switch (activeTextarea) {
      case "message1":
        setValue = setMessage1;
        currentValue = message1;
        break;
      case "message2":
        setValue = setMessage2;
        currentValue = message2;
        break;
      case "message3":
        setValue = setMessage3;
        currentValue = message3;
        break;
      case "message4":
        setValue = setMessage4;
        currentValue = message4;
        break;
      default:
        // Se nenhum textarea estiver ativo, tente encontrar um textarea focado
        if (activeElement && activeElement.tagName === "TEXTAREA") {
          const textarea = activeElement as HTMLTextAreaElement;
          const startPos = textarea.selectionStart ?? 0;
          const endPos = textarea.selectionEnd ?? 0;
          
          // Determinar qual textarea está ativo com base no elemento focado
          if (textarea.id === "message-text-1") {
            currentValue = message1;
            setValue = setMessage1;
          } else if (textarea.id === "message-text-2") {
            currentValue = message2;
            setValue = setMessage2;
          } else if (textarea.id === "message-text-3") {
            currentValue = message3;
            setValue = setMessage3;
          } else if (textarea.id === "message-text-4") {
            currentValue = message4;
            setValue = setMessage4;
          } else {
            return;
          }
          
          const newValue = currentValue.substring(0, startPos) + variable + currentValue.substring(endPos);
          setValue(newValue);

          // Set cursor position after the inserted variable
          setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(startPos + variable.length, startPos + variable.length);
          }, 0);
          return;
        }
        return;
    }

    // Se chegamos aqui, temos um textarea ativo conforme o estado, mas precisamos verificar se está focado
    const activeTextareaElement = document.activeElement as HTMLTextAreaElement;
    if (activeTextareaElement && activeTextareaElement.tagName === "TEXTAREA") {
      const startPos = activeTextareaElement.selectionStart ?? 0;
      const endPos = activeTextareaElement.selectionEnd ?? 0;
      
      const newValue = currentValue.substring(0, startPos) + variable + currentValue.substring(endPos);
      setValue(newValue);

      // Set cursor position after the inserted variable
      setTimeout(() => {
        activeTextareaElement.focus();
        activeTextareaElement.setSelectionRange(startPos + variable.length, startPos + variable.length);
      }, 0);
    }
  };

  return {
    activeTextarea,
    setActiveTextarea,
    campaignNameRef,
    insertVariable
  };
};
