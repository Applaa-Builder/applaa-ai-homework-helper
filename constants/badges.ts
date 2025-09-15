export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiredPoints: number;
  color: string;
}

const badges: Badge[] = [
  {
    id: 'first_question',
    name: 'Curious Mind',
    description: 'Asked your first question',
    icon: 'help-circle',
    requiredPoints: 1,
    color: '#4C6EF5',
  },
  {
    id: 'five_questions',
    name: 'Knowledge Seeker',
    description: 'Asked 5 questions',
    icon: 'search',
    requiredPoints: 5,
    color: '#12B886',
  },
  {
    id: 'ten_questions',
    name: 'Deep Thinker',
    description: 'Asked 10 questions',
    icon: 'brain',
    requiredPoints: 10,
    color: '#7950F2',
  },
  {
    id: 'math_expert',
    name: 'Math Wizard',
    description: 'Solved 5 math problems',
    icon: 'calculator',
    requiredPoints: 5,
    color: '#FA5252',
  },
  {
    id: 'science_explorer',
    name: 'Science Explorer',
    description: 'Asked 5 science questions',
    icon: 'flask',
    requiredPoints: 5,
    color: '#15AABF',
  },
  {
    id: 'consistent_learner',
    name: 'Consistent Learner',
    description: 'Used the app for 5 days in a row',
    icon: 'calendar',
    requiredPoints: 5,
    color: '#FD7E14',
  },
  {
    id: 'photo_master',
    name: 'Photo Master',
    description: 'Uploaded 3 homework photos',
    icon: 'image',
    requiredPoints: 3,
    color: '#40C057',
  },
];

export default badges;