import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StudyPlan, StudyTask } from '@/types';

interface StudyPlanState {
  plans: StudyPlan[];
  addPlan: (plan: StudyPlan) => void;
  updatePlan: (planId: string, updates: Partial<StudyPlan>) => void;
  toggleTaskCompletion: (planId: string, taskId: string) => void;
  getTodayPlan: () => StudyPlan | undefined;
  generateNewPlan: (subjects: string[]) => void;
}

const useStudyPlanStore = create<StudyPlanState>()(
  persist(
    (set, get) => ({
      plans: [],
      addPlan: (plan) => {
        set((state) => ({
          plans: [plan, ...state.plans],
        }));
      },
      updatePlan: (planId, updates) => {
        set((state) => ({
          plans: state.plans.map((plan) =>
            plan.id === planId ? { ...plan, ...updates } : plan
          ),
        }));
      },
      toggleTaskCompletion: (planId, taskId) => {
        set((state) => ({
          plans: state.plans.map((plan) => {
            if (plan.id !== planId) return plan;
            
            return {
              ...plan,
              tasks: plan.tasks.map((task) => {
                if (task.id !== taskId) return task;
                return { ...task, completed: !task.completed };
              }),
              completed: plan.tasks.every(task => 
                task.id === taskId ? !task.completed : task.completed
              ),
            };
          }),
        }));
      },
      getTodayPlan: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().plans.find((plan) => plan.date === today);
      },
      generateNewPlan: (subjects) => {
        const today = new Date().toISOString().split('T')[0];
        
        // Check if a plan for today already exists
        if (get().plans.some((plan) => plan.date === today)) {
          return;
        }
        
        // Generate 3-5 random tasks from the subjects
        const numTasks = Math.floor(Math.random() * 3) + 3; // 3-5 tasks
        const tasks: StudyTask[] = [];
        
        for (let i = 0; i < numTasks; i++) {
          const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
          const duration = (Math.floor(Math.random() * 4) + 1) * 15; // 15, 30, 45, or 60 minutes
          
          tasks.push({
            id: `task-${Date.now()}-${i}`,
            subject: randomSubject,
            description: `Study ${randomSubject} for ${duration} minutes`,
            completed: false,
            duration,
          });
        }
        
        const newPlan: StudyPlan = {
          id: `plan-${Date.now()}`,
          date: today,
          completed: false,
          tasks,
        };
        
        get().addPlan(newPlan);
      },
    }),
    {
      name: 'study-plan-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useStudyPlanStore;