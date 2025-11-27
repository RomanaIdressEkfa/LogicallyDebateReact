
import React from 'react';
import { UserRole, UserProfileDetails, Debate } from '../types';
import { Trophy, Shield, Clock, MapPin, Briefcase, GraduationCap, Link2, BookOpen, UserCheck, Swords, Gavel, Calendar, ArrowRight, AlertTriangle } from 'lucide-react';

interface ProfileProps {
  currentUserRole: UserRole;
  profileData?: any; // To allow passing dynamic user data
  userProfileDetails?: UserProfileDetails;
  debates: Debate[]; // Receive global debates to filter
}

const Profile: React.FC<ProfileProps> = ({ currentUserRole, profileData, userProfileDetails, debates = [] }) => {
  // Mock data for the profile view depending on role
  const getMockProfile = () => {
      const baseStats = {
          name: "Abdullah Al Rajjak",
          location: "Dhaka, Bangladesh",
          joined: "March 2023",
          elo: 2450,
          rank: "Grandmaster",
          badges: [
             { name: "Logic Lord", icon: "👑", color: "bg-amber-500/20 text-amber-400 border-amber-500/50" }
          ],
          history: []
      };

      let stats;

      if (currentUserRole === UserRole.PRO_DEBATER) {
          stats = {
            ...baseStats,
            role: "PRO_DEBATER",
            winRate: 84,
            accuracy: 92,
            debates: 142,
          };
      } else if (currentUserRole === UserRole.CON_DEBATER) {
           stats = {
            ...baseStats,
            name: "Jhon's Ahmed",
            role: "CON_DEBATER",
            winRate: 72,
            accuracy: 88,
            debates: 95,
          };
      } else if (currentUserRole === UserRole.JUDGE) {
          stats = {
            ...baseStats,
            name: "Hon. Sarah Connor",
            role: "JUDGE",
            rank: "Senior Adjudicator",
            winRate: "N/A",
            accuracy: 99,
            debates: 340,
          };
      } else {
          stats = {
            name: "Guest Viewer",
            role: "VIEWER",
            rank: "Spectator",
            elo: 0,
            winRate: 0,
            accuracy: 0,
            debates: 0,
            location: "Unknown",
            joined: "Just now",
            badges: [],
            history: []
          };
      }

      // Merge passed profileData if exists
      if (profileData) {
          return { ...stats, ...profileData };
      }

      return stats;
  };

  const userStats = getMockProfile();
  const displayName = userProfileDetails && profileData ? profileData.name : userStats.name;

  // --- ARENA LOGIC ---
  const isJudge = currentUserRole === UserRole.JUDGE;
  const isDebater = currentUserRole === UserRole.PRO_DEBATER || currentUserRole === UserRole.CON_DEBATER;
  const isVerified = userProfileDetails?.isVerified;

  // Filter debates for the "My Arena" section
  const upcomingDebates = debates?.filter(d => d.status !== 'COMPLETED') || [];
  
  // For Judges: Show everything as potential assignment if verified
  // For Debaters: Show debates they are assigned to, or open ones
  const myRelevantDebates = upcomingDebates.filter(d => {
      if (!isVerified) return false;
      if (isJudge) return true; // Judges see all
      if (isDebater) return d.proUser === displayName || d.conUser === displayName || d.conUser === 'Waiting...';
      return false; 
  });

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-950 p-4 md:p-8 animate-in fade-in duration-500 w-full">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Verification Alert for Pending Users */}
        {userProfileDetails && !userProfileDetails.isVerified && (
            <div className="bg-amber-900/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-4 animate-in slide-in-from-top-2">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                    <h3 className="text-amber-400 font-bold">Verification Pending</h3>
                    <p className="text-amber-200/60 text-sm mt-1">
                        Your profile is currently under review by our Admin team. Access to the {isJudge ? 'Judicial Bench' : 'Debate Arena'} is restricted until approval.
                        You will receive a notification upon verification.
                    </p>
                </div>
            </div>
        )}

        {/* Header Section */}
        <div className="bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
           
           <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="relative group">
                 <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-tr from-primary-500 to-purple-500 shadow-xl shadow-primary-900/40">
                    <img 
                      src={userProfileDetails?.avatarUrl || `https://ui-avatars.com/api/?name=${displayName}&background=random`} 
                      className="w-full h-full rounded-full object-cover border-4 border-slate-900" 
                      alt="Profile" 
                    />
                 </div>
                 {userStats.rank !== "Spectator" && (
                     <div className="absolute bottom-2 right-2 bg-amber-500 text-slate-900 font-bold text-xs px-3 py-1 rounded-full border-2 border-slate-900 flex items-center gap-1 shadow-lg">
                        <Trophy className="w-3 h-3" /> {userStats.rank}
                     </div>
                 )}
              </div>
              
              <div className="text-center md:text-left flex-1 space-y-3">
                 <div>
                     <h1 className="text-3xl md:text-4xl font-black text-white">{displayName}</h1>
                     <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
                         <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 rounded-full text-xs font-bold text-slate-300 border border-slate-700">
                             <Shield className="w-3.5 h-3.5" /> {userStats.role?.replace('_', ' ')}
                         </span>
                         {userProfileDetails?.isVerified ? (
                             <span className="bg-blue-500/10 text-blue-400 text-xs px-3 py-1 rounded-full border border-blue-500/20 flex items-center gap-1.5 font-bold">
                                 <UserCheck className="w-3.5 h-3.5" /> Verified Identity
                             </span>
                         ) : (
                             <span className="bg-slate-800 text-slate-500 text-xs px-3 py-1 rounded-full border border-slate-700 flex items-center gap-1.5 font-bold">
                                 Unverified
                             </span>
                         )}
                     </div>
                 </div>
                 
                 <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-400 text-sm">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {userStats.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Joined {userStats.joined}</span>
                 </div>
                 
                 <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-2">
                    {userStats.badges?.map((badge: any, idx: number) => (
                       <span key={idx} className={`px-3 py-1 rounded-lg text-xs font-bold border flex items-center gap-1 shadow-sm ${badge.color}`}>
                          {badge.icon} {badge.name}
                       </span>
                    ))}
                 </div>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-4 md:gap-8 bg-slate-950/50 p-6 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
                 {userStats.elo !== "N/A" && userStats.elo !== 0 && (
                    <div className="text-center">
                        <div className="text-3xl font-black text-white">{userStats.elo}</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Elo Rating</div>
                    </div>
                 )}
                 {userStats.elo !== 0 && <div className="w-px bg-slate-700/50 h-12"></div>}
                 <div className="text-center">
                    <div className="text-3xl font-black text-primary-400">{userStats.debates}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Battles</div>
                 </div>
              </div>
           </div>
        </div>

        {/* --- DYNAMIC DASHBOARD: "MY ARENA" --- */}
        {(isJudge || isDebater) && userProfileDetails?.isVerified && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isJudge ? 'bg-amber-500/10 text-amber-500' : 'bg-primary-500/10 text-primary-500'}`}>
                            {isJudge ? <Gavel className="w-6 h-6"/> : <Swords className="w-6 h-6"/>}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                {isJudge ? 'Judicial Docket' : 'My Battle Arena'}
                            </h2>
                            <p className="text-slate-400 text-xs">
                                {isJudge ? 'Upcoming debates requiring adjudication' : 'Your schedule and open challenges'}
                            </p>
                        </div>
                    </div>
                    <div className="bg-slate-800 text-white text-xs font-bold px-3 py-1 rounded-full border border-slate-700">
                        {myRelevantDebates.length} Active
                    </div>
                </div>

                <div className="divide-y divide-slate-800">
                    {myRelevantDebates.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>No active assignments found.</p>
                            {isDebater && <p className="text-xs mt-1">Check the public lobby to join new debates.</p>}
                        </div>
                    ) : (
                        myRelevantDebates.map(debate => (
                            <div key={debate.id} className="p-6 hover:bg-slate-800/30 transition-colors flex flex-col md:flex-row items-center gap-6 group">
                                <div className="relative w-full md:w-48 h-28 rounded-xl overflow-hidden shrink-0 border border-slate-700">
                                    <img src={debate.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="" />
                                    <div className="absolute top-2 right-2">
                                        {debate.status === 'LIVE' ? (
                                            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow animate-pulse">LIVE</span>
                                        ) : (
                                            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow">UPCOMING</span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex-1 w-full text-center md:text-left">
                                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary-400 transition-colors">{debate.topic}</h3>
                                    <p className="text-slate-400 text-sm line-clamp-1 mb-3">{debate.description}</p>
                                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                        <div className="flex items-center gap-2 text-xs font-bold bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                                            <span className="text-blue-400">PRO:</span>
                                            <span className="text-white">{debate.proUser}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-bold bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                                            <span className="text-red-400">CON:</span>
                                            <span className="text-white">{debate.conUser}</span>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full md:w-auto px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-primary-500 hover:text-white transition-all flex items-center justify-center gap-2 shadow-lg">
                                    {isJudge ? 'Enter Court' : 'Enter Arena'} <ArrowRight className="w-4 h-4"/>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        )}

        {/* Detailed Info */}
        {userProfileDetails && (
            <div className="grid md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-8 duration-700">
                <div className="md:col-span-2 bg-slate-900 rounded-2xl p-6 border border-slate-800">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary-500" /> Biography & Philosophy
                    </h3>
                    <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
                        {userProfileDetails.bio}
                    </p>
                    
                    <div className="mt-6 pt-6 border-t border-slate-800">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Areas of Expertise</h4>
                        <div className="flex flex-wrap gap-2">
                            {userProfileDetails.expertise?.map((exp, i) => (
                                <span key={i} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 shadow-sm">
                                    {exp}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="space-y-6">
                     <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 h-full">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Professional Credentials</h3>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center shrink-0 border border-slate-700">
                                    <GraduationCap className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 font-bold uppercase mb-0.5">Education</div>
                                    <div className="text-sm font-bold text-white">{userProfileDetails.credentials}</div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center shrink-0 border border-slate-700">
                                    <Briefcase className="w-5 h-5 text-amber-400" />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 font-bold uppercase mb-0.5">Experience</div>
                                    <div className="text-sm font-bold text-white">{userProfileDetails.yearsExperience} Years</div>
                                </div>
                            </div>
                            {userProfileDetails.linkedin && (
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center shrink-0 border border-slate-700">
                                        <Link2 className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 font-bold uppercase mb-0.5">Professional Link</div>
                                        <a href={userProfileDetails.linkedin} target="_blank" rel="noreferrer" className="text-sm font-bold text-blue-400 hover:underline truncate block max-w-[150px]">
                                            View LinkedIn
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                     </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
