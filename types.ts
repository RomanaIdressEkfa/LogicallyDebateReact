
export enum UserRole {
  VIEWER = 'VIEWER',
  PRO_DEBATER = 'PRO_DEBATER',
  CON_DEBATER = 'CON_DEBATER',
  JUDGE = 'JUDGE',
  ADMIN = 'ADMIN'
}

export interface Message {
  id: string;
  sender: string;
  role: 'PRO' | 'CON' | 'SYSTEM' | 'JUDGE';
  content: string;
  timestamp: number;
}

export interface ArgumentNode {
  id: string;
  author: string;
  role: 'PRO' | 'CON' | 'JUDGE';
  content: string;
  type: 'ARGUMENT' | 'REBUTTAL' | 'AGREEMENT' | 'DISAGREEMENT';
  timestamp: number;
  votes: {
    likes: number;
    support: number;
  };
  children: ArgumentNode[];
}

export interface Debate {
  id: string;
  topic: string;
  category: string;
  description: string;
  status: 'UPCOMING' | 'LIVE' | 'COMPLETED' | 'CANCELLED';
  proUser: string;
  conUser: string;
  viewers: number;
  votes: {
    pro: number;
    con: number;
  };
  // We keep messages for linear transcripts if needed, but primary view is now argumentTree
  messages: Message[];
  argumentTree: ArgumentNode[];
  imageUrl: string;
  startTime?: number;
}

export interface AnalysisResult {
  winner: string;
  reasoning: string;
  proScore: number;
  conScore: number;
}

export interface DebaterProfile {
  id: string;
  name: string;
  rank: string;
  winRate: number;
  debatesCount: number;
  avatarUrl: string;
  badges: string[];
}

export interface Notification {
  id: string;
  type: 'LOGIN' | 'REPORT' | 'SYSTEM';
  message: string;
  timestamp: number;
  read: boolean;
}
