
import { useState, useEffect, useCallback, useRef } from 'react';

// TypeScript definitions for the SpeechRecognition API which may not be in all environments
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface VoiceCommandOptions {
  onCommand: (command: string) => void;
  commands: string[];
}

export const useVoiceCommands = ({ onCommand, commands }: VoiceCommandOptions) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
    }
  }, []);

  const processResult = useCallback((event: any) => {
    const transcript = event.results[event.resultIndex][0].transcript.trim().toLowerCase();
    console.log('Transcript:', transcript);

    const matchedCommand = commands.find(command =>
      transcript.includes(command.toLowerCase())
    );

    if (matchedCommand) {
      onCommand(matchedCommand);
    } else {
      console.log('No matching command found.');
    }
  }, [commands, onCommand]);

  const startListening = useCallback(() => {
    if (!isSupported || isListening || !recognitionRef.current) return;
    
    recognitionRef.current.onresult = processResult;
    recognitionRef.current.onend = () => setIsListening(false);
    recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
    };

    recognitionRef.current.start();
    setIsListening(true);
  }, [isSupported, isListening, processResult]);

  const stopListening = useCallback(() => {
    if (!isSupported || !isListening || !recognitionRef.current) return;
    recognitionRef.current.stop();
    setIsListening(false);
  }, [isSupported, isListening]);

  return { isListening, isSupported, startListening, stopListening };
};
