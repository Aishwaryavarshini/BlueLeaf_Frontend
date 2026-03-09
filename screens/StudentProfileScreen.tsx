
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Users, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Edit3, 
  BookOpen, 
  Cpu, 
  FileText, 
  Globe, 
  Star, 
  ShieldCheck, 
  Coffee,
  ArrowLeft
} from 'lucide-react';
import { UserPreferences } from '../App';
import DashboardHeader from '../components/DashboardHeader';

interface StudentProfileScreenProps {
  preferences: UserPreferences;
  onBack: () => void;
}

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onEdit?: () => void;
}

const CollapsibleSection: React.FC<SectionProps> = ({ title, icon, children, onEdit }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden mb-6">
      <div 
        className="px-8 py-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#2563eb]">
            {icon}
          </div>
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">{title}</h3>
        </div>
        <div className="flex items-center space-x-4">
          {onEdit && (
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="p-2 text-slate-400 hover:text-[#2563eb] transition-colors"
            >
              <Edit3 size={18} />
            </button>
          )}
          <div className="text-slate-300">
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-8 pb-8 pt-2 border-t border-slate-50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const InfoField: React.FC<{ label: string; value: string; icon?: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="flex flex-col space-y-1">
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
    <div className="flex items-center space-x-2">
      {icon && <div className="text-slate-300">{icon}</div>}
      <span className="text-sm font-bold text-slate-700">{value || 'Not specified'}</span>
    </div>
  </div>
);

const DynamicList: React.FC<{ 
  title: string; 
  items: string[]; 
  onAdd: () => void; 
  onRemove: (index: number) => void;
  placeholder?: string;
}> = ({ title, items, onAdd, onRemove, placeholder }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</h4>
      <button 
        onClick={onAdd}
        className="w-6 h-6 bg-blue-50 text-[#2563eb] rounded-lg flex items-center justify-center hover:bg-[#2563eb] hover:text-white transition-all shadow-sm"
      >
        <Plus size={14} strokeWidth={3} />
      </button>
    </div>
    <div className="space-y-2">
      {items.length === 0 ? (
        <p className="text-[10px] font-bold text-slate-300 italic uppercase tracking-widest">{placeholder || 'No entries yet'}</p>
      ) : (
        items.map((item, index) => (
          <div key={index} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100 group">
            <span className="text-xs font-bold text-slate-600">{item}</span>
            <button 
              onClick={() => onRemove(index)}
              className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))
      )}
    </div>
  </div>
);

const StudentProfileScreen: React.FC<StudentProfileScreenProps> = ({ preferences, onBack }) => {
  // Mock data for the profile
  const [profile, setProfile] = useState({
    name: preferences.username,
    department: 'Computer Science & Engineering',
    program: 'B.E. Computer Science',
    candidateId: 'CSE2024001',
    contact: '+91 98765 43210',
    email: 'learner@college.edu',
    gender: 'Male',
    bloodGroup: 'O+',
    bio: 'Passionate computer science student with a focus on AI and full-stack development. Always eager to learn new technologies and contribute to open-source projects.',
    education: {
      degree: 'Bachelor of Engineering',
      course: 'Computer Science',
      year: '3rd Year',
      institution: 'Institute of Technology & Science',
      occupation: 'Student'
    },
    skills: {
      experience: ['Intern at Tech Corp (3 months)', 'Freelance Web Developer'],
      exams: ['GATE 2024 (Qualified)', 'JEE Advanced'],
      technical: ['React', 'TypeScript', 'Node.js', 'Python', 'Tailwind CSS'],
      publications: ['AI in Education - Journal of CS'],
      patents: []
    },
    projects: [
      {
        title: 'AI Study Assistant',
        members: 'Self, John Doe',
        mentor: 'Dr. Sarah Smith',
        funding: 'Self-funded',
        consultancy: 'None',
        activities: 'Coding, UI Design'
      }
    ],
    achievements: {
      address: '123, Academic Lane, Knowledge City, 560001',
      certificates: ['AWS Certified Cloud Practitioner', 'Google Data Analytics'],
      events: ['Hackathon 2023 - 1st Place', 'Tech Symposium'],
      honors: ['Dean\'s List 2023', 'Merit Scholarship']
    },
    leadership: {
      scholarships: ['State Merit Scholarship'],
      memberships: ['ACM Student Member', 'IEEE'],
      clubs: ['Coding Club (President)', 'Robotics Society']
    },
    extras: {
      other: ['Volunteered at local NGO'],
      training: ['Full Stack Bootcamp'],
      courses: ['Machine Learning Specialization']
    }
  });

  const handleAddSkill = (category: keyof typeof profile.skills) => {
    const newVal = prompt(`Add new ${String(category)}:`);
    if (newVal) {
      setProfile(prev => ({
        ...prev,
        skills: {
          ...prev.skills,
          [category]: [...prev.skills[category], newVal]
        }
      }));
    }
  };

  const handleRemoveSkill = (category: keyof typeof profile.skills, index: number) => {
    setProfile(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].filter((_, i) => i !== index)
      }
    }));
  };

  return (
    <div className="h-full flex flex-col relative animate-fade-in overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#2563eb] to-white z-0 pointer-events-none" />
      
      <DashboardHeader preferences={preferences} title="Student Profile" />

      <div className="flex-1 overflow-y-auto relative z-10 px-6 pb-20">
        <div className="max-w-6xl mx-auto mt-8">
          
          {/* 1. Profile Header */}
          <div className="bg-white rounded-[3rem] shadow-xl border border-white p-8 mb-8 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 z-0" />
            
            <div className="relative z-10">
              <div className="w-32 h-32 rounded-[3.5rem] bg-[#2563eb] flex items-center justify-center text-white text-5xl font-black shadow-2xl border-4 border-white">
                {profile.name[0]}
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-2xl shadow-lg flex items-center justify-center text-[#2563eb] border border-blue-50 hover:scale-110 transition-transform">
                <Edit3 size={18} />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{profile.name}</h1>
                  <p className="text-[#2563eb] font-black uppercase tracking-[0.2em] text-[10px] mt-2">
                    {profile.department} • {profile.program}
                  </p>
                  <div className="flex items-center justify-center md:justify-start space-x-4 mt-4">
                    <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 flex items-center space-x-2">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ID:</span>
                      <span className="text-xs font-bold text-slate-700">{profile.candidateId}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              
              {/* 2. Basic Information */}
              <CollapsibleSection title="Basic Information" icon={<User size={20} />} onEdit={() => {}}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InfoField label="Full Name" value={profile.name} icon={<User size={14} />} />
                  <InfoField label="Department" value={profile.department} icon={<Briefcase size={14} />} />
                  <InfoField label="Candidate ID" value={profile.candidateId} icon={<ShieldCheck size={14} />} />
                  <InfoField label="Contact Number" value={profile.contact} icon={<Phone size={14} />} />
                  <InfoField label="Email ID" value={profile.email} icon={<Mail size={14} />} />
                  <InfoField label="Gender" value={profile.gender} icon={<Users size={14} />} />
                  <InfoField label="Blood Group" value={profile.bloodGroup} icon={<Star size={14} />} />
                </div>
              </CollapsibleSection>

              {/* 3. Professional Summary */}
              <CollapsibleSection title="Professional Summary" icon={<FileText size={20} />} onEdit={() => {}}>
                <p className="text-sm font-bold text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  {profile.bio}
                </p>
              </CollapsibleSection>

              {/* 4. Education Details */}
              <CollapsibleSection title="Education Details" icon={<GraduationCap size={20} />} onEdit={() => {}}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InfoField label="Degree" value={profile.education.degree} icon={<GraduationCap size={14} />} />
                  <InfoField label="Course / Branch" value={profile.education.course} icon={<BookOpen size={14} />} />
                  <InfoField label="Year of Study" value={profile.education.year} icon={<Star size={14} />} />
                  <InfoField label="Institution" value={profile.education.institution} icon={<Globe size={14} />} />
                  <InfoField label="Occupation" value={profile.education.occupation} icon={<Briefcase size={14} />} />
                </div>
              </CollapsibleSection>

              {/* 8. Leadership & Responsibility */}
              <CollapsibleSection title="Leadership & Responsibility" icon={<ShieldCheck size={20} />}>
                <div className="grid grid-cols-1 gap-6">
                  <DynamicList 
                    title="Scholarships" 
                    items={profile.leadership.scholarships} 
                    onAdd={() => {}} 
                    onRemove={() => {}} 
                  />
                  <DynamicList 
                    title="Memberships" 
                    items={profile.leadership.memberships} 
                    onAdd={() => {}} 
                    onRemove={() => {}} 
                  />
                  <DynamicList 
                    title="Clubs / Associations" 
                    items={profile.leadership.clubs} 
                    onAdd={() => {}} 
                    onRemove={() => {}} 
                  />
                </div>
              </CollapsibleSection>

            </div>

            {/* Right Column */}
            <div className="space-y-8">
              
              {/* 5. Skills & Competencies */}
              <CollapsibleSection title="Skills & Competencies" icon={<Cpu size={20} />}>
                <div className="grid grid-cols-1 gap-6">
                  <DynamicList 
                    title="Technical Skills" 
                    items={profile.skills.technical} 
                    onAdd={() => handleAddSkill('technical')} 
                    onRemove={(i) => handleRemoveSkill('technical', i)} 
                  />
                  <DynamicList 
                    title="Work Experience" 
                    items={profile.skills.experience} 
                    onAdd={() => handleAddSkill('experience')} 
                    onRemove={(i) => handleRemoveSkill('experience', i)} 
                  />
                  <DynamicList 
                    title="Competitive Exams" 
                    items={profile.skills.exams} 
                    onAdd={() => handleAddSkill('exams')} 
                    onRemove={(i) => handleRemoveSkill('exams', i)} 
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <DynamicList 
                      title="Publications" 
                      items={profile.skills.publications} 
                      onAdd={() => handleAddSkill('publications')} 
                      onRemove={(i) => handleRemoveSkill('publications', i)} 
                    />
                    <DynamicList 
                      title="Patents" 
                      items={profile.skills.patents} 
                      onAdd={() => handleAddSkill('patents')} 
                      onRemove={(i) => handleRemoveSkill('patents', i)} 
                      placeholder="No patents listed"
                    />
                  </div>
                </div>
              </CollapsibleSection>

              {/* 6. Projects & Research */}
              <CollapsibleSection title="Projects & Research" icon={<Globe size={20} />}>
                <div className="space-y-4">
                  {profile.projects.map((project, i) => (
                    <div key={i} className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4 relative group">
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-slate-800 uppercase tracking-tight text-sm">{project.title}</h4>
                        <button className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <InfoField label="Team Members" value={project.members} />
                        <InfoField label="Mentor" value={project.mentor} />
                        <InfoField label="Funding" value={project.funding} />
                        <InfoField label="Activities" value={project.activities} />
                      </div>
                    </div>
                  ))}
                  <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-[#2563eb] hover:text-[#2563eb] transition-all">
                    Add New Project
                  </button>
                </div>
              </CollapsibleSection>

              {/* 7. Achievements & Activities */}
              <CollapsibleSection title="Achievements & Activities" icon={<Award size={20} />}>
                <div className="space-y-6">
                  <InfoField label="Permanent Address" value={profile.achievements.address} icon={<MapPin size={14} />} />
                  <div className="grid grid-cols-1 gap-6">
                    <DynamicList 
                      title="Certificates" 
                      items={profile.achievements.certificates} 
                      onAdd={() => {}} 
                      onRemove={() => {}} 
                    />
                    <DynamicList 
                      title="Events Participated" 
                      items={profile.achievements.events} 
                      onAdd={() => {}} 
                      onRemove={() => {}} 
                    />
                    <DynamicList 
                      title="Honors & Awards" 
                      items={profile.achievements.honors} 
                      onAdd={() => {}} 
                      onRemove={() => {}} 
                    />
                  </div>
                </div>
              </CollapsibleSection>

              {/* 9. Extras */}
              <CollapsibleSection title="Extras" icon={<Coffee size={20} />}>
                <div className="grid grid-cols-1 gap-6">
                  <DynamicList 
                    title="Other Achievements" 
                    items={profile.extras.other} 
                    onAdd={() => {}} 
                    onRemove={() => {}} 
                  />
                  <DynamicList 
                    title="Training Programs" 
                    items={profile.extras.training} 
                    onAdd={() => {}} 
                    onRemove={() => {}} 
                  />
                  <DynamicList 
                    title="Courses Attended" 
                    items={profile.extras.courses} 
                    onAdd={() => {}} 
                    onRemove={() => {}} 
                  />
                </div>
              </CollapsibleSection>

            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <button 
              onClick={onBack}
              className="flex items-center space-x-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-[#2563eb] transition-colors"
            >
              <ArrowLeft size={16} strokeWidth={3} />
              <span>Back to Dashboard</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentProfileScreen;
