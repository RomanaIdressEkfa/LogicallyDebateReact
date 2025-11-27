
import React, { useState, useRef } from 'react';
import { UserRole, UserProfileDetails } from '../types';
import { UserCheck, BookOpen, Briefcase, Linkedin, Save, AlertCircle, Camera, Upload } from 'lucide-react';

interface ProfileSetupProps {
  role: UserRole;
  email: string;
  onComplete: (details: UserProfileDetails, name: string) => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ role, email, onComplete }) => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [expertise, setExpertise] = useState('');
  const [credentials, setCredentials] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [yearsExperience, setYearsExperience] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const details: UserProfileDetails = {
      bio,
      expertise: expertise.split(',').map(s => s.trim()),
      credentials,
      linkedin,
      yearsExperience,
      isVerified: false, // Default to false until admin verifies
      avatarUrl
    };
    onComplete(details, name);
  };

  const getRoleTitle = () => {
      switch(role) {
          case UserRole.JUDGE: return 'Judicial Certification';
          case UserRole.PRO_DEBATER: return 'Pro Debater Profile';
          case UserRole.CON_DEBATER: return 'Con Debater Profile';
          default: return 'Profile Setup';
      }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="bg-slate-950 p-8 border-b border-slate-800 text-center relative overflow-hidden">
             {/* Background Pattern */}
             <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
             
            <div className="w-16 h-16 bg-primary-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary-500/30 relative z-10">
                <UserCheck className="w-8 h-8 text-primary-500" />
            </div>
            <h1 className="text-3xl font-black text-white mb-2 relative z-10">{getRoleTitle()}</h1>
            <p className="text-slate-400 text-sm max-w-md mx-auto relative z-10">
                Establish your identity on the platform. High-quality profiles receive 3x more debate invitations.
            </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            {/* Avatar Upload Section */}
            <div className="flex flex-col items-center">
                <div 
                    className="relative w-32 h-32 rounded-full bg-slate-800 border-2 border-dashed border-slate-600 flex items-center justify-center cursor-pointer group hover:border-primary-500 hover:bg-slate-800/50 transition-all overflow-hidden"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-center group-hover:scale-105 transition-transform">
                            <Camera className="w-8 h-8 text-slate-500 mx-auto mb-1 group-hover:text-primary-400" />
                            <span className="text-[10px] text-slate-500 uppercase font-bold group-hover:text-primary-400">Upload Photo</span>
                        </div>
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                         <Upload className="w-6 h-6 text-white" />
                    </div>
                </div>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                />
                <p className="text-xs text-slate-500 mt-2">Recommended: 400x400px JPG/PNG</p>
            </div>

            <div className="bg-amber-900/10 border border-amber-500/20 p-4 rounded-xl flex gap-3 items-start">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-200/80 leading-relaxed">
                    <strong>Notice:</strong> As a {role.replace('_', ' ')}, your credentials will be manually reviewed by Admins. Providing verifiable information speeds up approval.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Full Display Name</label>
                    <input 
                        type="text" 
                        required 
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-primary-500 outline-none"
                        placeholder="e.g. Dr. Jane Doe"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Credentials / Title</label>
                    <input 
                        type="text" 
                        required 
                        value={credentials}
                        onChange={e => setCredentials(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-primary-500 outline-none"
                        placeholder="e.g. PhD Political Science"
                    />
                </div>
            </div>

            <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Professional Bio</label>
                <textarea 
                    required 
                    rows={4}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                    placeholder="Describe your background, debating style, and philosophy..."
                />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Areas of Expertise</label>
                    <div className="relative">
                        <BookOpen className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                        <input 
                            type="text" 
                            required 
                            value={expertise}
                            onChange={e => setExpertise(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 pl-10 text-white focus:ring-2 focus:ring-primary-500 outline-none"
                            placeholder="Law, Ethics, Theology"
                        />
                    </div>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Years of Experience</label>
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                        <input 
                            type="number" 
                            required 
                            min="0"
                            value={yearsExperience}
                            onChange={e => setYearsExperience(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 pl-10 text-white focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">LinkedIn / Portfolio URL</label>
                <div className="relative">
                    <Linkedin className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <input 
                        type="url" 
                        value={linkedin}
                        onChange={e => setLinkedin(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 pl-10 text-white focus:ring-2 focus:ring-primary-500 outline-none"
                        placeholder="https://linkedin.com/in/..."
                    />
                </div>
            </div>

            <button 
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-900/20 transition-all flex items-center justify-center gap-2 mt-4 hover:scale-[1.01] active:scale-[0.99]"
            >
                <Save className="w-5 h-5" /> Complete Registration
            </button>

        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
