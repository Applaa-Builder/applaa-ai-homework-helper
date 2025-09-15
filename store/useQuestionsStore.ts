import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Question, Message } from '@/types';

interface QuestionsState {
  questions: Question[];
  messages: Message[];
  addQuestion: (question: Question) => string;
  addMessage: (message: Message) => void;
  getMessagesForQuestion: (questionId: string) => Message[];
  markQuestionAsAnswered: (questionId: string) => void;
}

const useQuestionsStore = create<QuestionsState>()(
  persist(
    (set, get) => ({
      questions: [],
      messages: [],
      addQuestion: (question) => {
        set((state) => ({
          questions: [question, ...state.questions],
        }));
        return question.id;
      },
      addMessage: (message) => {
        set((state) => ({
          messages: [message, ...state.messages],
        }));
      },
      getMessagesForQuestion: (questionId) => {
        return get().messages.filter(
          (message) => message.questionId === questionId
        ).sort((a, b) => a.timestamp - b.timestamp);
      },
      markQuestionAsAnswered: (questionId) => {
        set((state) => ({
          questions: state.questions.map((q) =>
            q.id === questionId ? { ...q, answered: true } : q
          ),
        }));
      },
    }),
    {
      name: 'questions-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useQuestionsStore;