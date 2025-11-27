

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
  type: 'LOGIN' | 'REPORT' | 'SYSTEM' | 'REGISTRATION';
  message: string;
  timestamp: number;
  read: boolean;
  actionRequired?: boolean;
  targetUserId?: string;
}

export interface Toast {
  id: string;
  type: 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING';
  message: string;
}

// Admin Panel Types & User Profile Extension
export interface UserProfileDetails {
  bio: string;
  expertise: string[]; // e.g., ["Law", "Philosophy"]
  credentials: string; // e.g., "PhD in Ethics"
  linkedin?: string;
  yearsExperience: number;
  isVerified: boolean;
  avatarUrl?: string; // New field for profile picture
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'ACTIVE' | 'BANNED' | 'SUSPENDED' | 'PENDING_APPROVAL';
  joinedDate: string;
  country: string;
  ip: string;
  profileDetails?: UserProfileDetails; // New field for rich data
}

export interface Report {
  id: string;
  targetId: string;
  targetType: 'USER' | 'DEBATE' | 'COMMENT';
  reason: string;
  reporter: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  timestamp: number;
}

export interface SystemLog {
  id: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
  message: string;
  module: string;
  timestamp: number;
}

export interface ContentItem {
  id: string;
  title: string;
  type: 'ANNOUNCEMENT' | 'PAGE' | 'BANNER';
  status: 'PUBLISHED' | 'DRAFT';
  lastModified: string;
}