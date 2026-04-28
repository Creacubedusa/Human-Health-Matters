import { useEffect, useRef } from 'react';
import { getMockAiResponse, computeTriageResult } from '../services/triage.service';
import { useTriageStore } from '../store/triage.store';
import type { TriageMessage, TriageResult } from '../types/triage.types';

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function useTriage() {
  const { currentSession, isTyping, startSession, addMessage, setTyping, setResult, resetSession } =
    useTriageStore();

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      startSession();
      // Auto-post opening AI message after a short delay
      setTimeout(() => {
        const opening = getMockAiResponse([]);
        addMessage(opening);
      }, 400);
    }
  }, []);

  const messages = currentSession?.messages ?? [];
  const result = currentSession?.result ?? null;
  const sessionId = currentSession?.id ?? '';

  async function sendMessage(text: string) {
    if (!text.trim()) return;

    const userMsg: TriageMessage = {
      id: uid(),
      role: 'user',
      content: text.trim(),
      timestamp: Date.now(),
    };
    addMessage(userMsg);
    setTyping(true);

    await new Promise((r) => setTimeout(r, 1000));

    const userTexts = [...messages, userMsg]
      .filter((m) => m.role === 'user')
      .map((m) => m.content);

    const aiMsg = getMockAiResponse(userTexts);
    addMessage(aiMsg);
    setTyping(false);

    if (aiMsg.showViewResult) {
      const triageResult = computeTriageResult(userTexts, sessionId);
      setResult(triageResult);
    }
  }

  function handleReset() {
    initialized.current = false;
    resetSession();
    setTimeout(() => {
      const opening = getMockAiResponse([]);
      addMessage(opening);
    }, 400);
  }

  return {
    messages,
    isTyping,
    result,
    sendMessage,
    resetSession: handleReset,
  };
}
