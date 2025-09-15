export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const subjects: Subject[] = [
  {
    id: 'math',
    name: 'Mathematics',
    icon: 'calculator',
    color: '#4A90E2',
  },
  {
    id: 'science',
    name: 'Science',
    icon: 'flask',
    color: '#2ECC71',
  },
  {
    id: 'english',
    name: 'English',
    icon: 'book-open',
    color: '#9B59B6',
  },
  {
    id: 'history',
    name: 'History',
    icon: 'landmark',
    color: '#F39C12',
  },
  {
    id: 'geography',
    name: 'Geography',
    icon: 'globe',
    color: '#16A085',
  },
  {
    id: 'languages',
    name: 'Languages',
    icon: 'message-circle',
    color: '#E74C3C',
  },
  {
    id: 'arts',
    name: 'Arts',
    icon: 'palette',
    color: '#8E44AD',
  },
  {
    id: 'other',
    name: 'Other',
    icon: 'more-horizontal',
    color: '#7F8C8D',
  },
];

export default subjects;