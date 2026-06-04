import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  fetchAnalytics,
  fetchEducations,
  fetchExperiences,
  fetchLanguages,
  fetchMe, fetchProfile,
  fetchSkills,
} from '../../../api/profileApi';
import type { AppDispatch, RootState } from '../../../store';

import {
  Briefcase,
  Building2,
  Calendar,
  ExternalLink,
  Eye,
  Globe,
  Globe2,
  GraduationCap,
  Info,
  LayoutGrid,
  MapPin,
  MoreHorizontal,
  Pencil, Plus,
  Search,
  Sparkles,
  Star,
  User,
  Users
} from 'lucide-react';
import EducationDialog from '../../../components/shared/Dialog/Educationdialog';
import ExperienceDialog from '../../../components/shared/Dialog/Experiencedialog';
import LanguageDialog from '../../../components/shared/Dialog/Languagedialog';
import EditProfileDialog from '../../../components/shared/Dialog/ProfileDailog';
import SkillDialog from '../../../components/shared/Dialog/Skilldialog';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Separator } from '../../../components/ui/separator';
import { Skeleton } from '../../../components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '../../../components/ui/tabs';

const formatDate = (d: string) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present';

const Profile = () => {
  const { id: paramId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { me, profile, analytics, experiences, educations, skills, languages, loading } =
    useSelector((s: RootState) => s.profile);

  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [expDialog, setExpDialog] = useState<{ open: boolean; item? }>({ open: false });
  const [eduDialog, setEduDialog] = useState<{ open: boolean; item? }>({ open: false });
  const [skillOpen, setSkillOpen] = useState(false);
  const [langDialog, setLangDialog] = useState<{ open: boolean; item? }>({ open: false });

  const activeUserId = paramId || (me?.id ? String(me.id) : null);
  const isOwnProfile = !paramId || String(paramId) === String(me?.id);
  const isOrg = profile?.role === 'Organization';

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    if (activeUserId) {
      dispatch(fetchProfile(activeUserId));
      dispatch(fetchAnalytics(activeUserId));
      dispatch(fetchExperiences(activeUserId));
      dispatch(fetchEducations(activeUserId));
      dispatch(fetchSkills(activeUserId));
      dispatch(fetchLanguages(activeUserId));
    }
  }, [activeUserId, dispatch]);

  if (loading && !profile) return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
      <Skeleton className="h-52 w-full rounded-xl" />
      <Skeleton className="h-28 w-full rounded-xl" />
      <Skeleton className="h-48 w-full rounded-xl" />
    </div>
  );

  return (
    <section className='bg-background min-h-screen transition-colors duration-300'>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">

          <div className="col-span-12 lg:col-span-8 space-y-4">

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden rounded-xl">
              <div className="relative">
                <div
                  className="h-48 bg-gradient-to-r from-[#0A66C2] to-[#60A5FA]"
                  style={profile?.bannerUrl ? { backgroundImage: `url(${profile.bannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                />
                {isOwnProfile && (
                  <Button
                    variant="ghost" size="icon"
                    className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full shadow-md transition-all h-9 w-9"
                    onClick={() => setEditProfileOpen(true)}
                  >
                    <Pencil size={16} className="text-slate-700" />
                  </Button>
                )}
              </div>

              <CardContent className="px-6 pb-6">
                <div className="-mt-12 mb-4 relative z-10 flex items-end justify-between">
                  <div className="relative group">
                    <Avatar className={`h-32 w-32 border-4 border-white shadow-xl ${isOrg ? 'rounded-lg' : 'rounded-full'}`}>
                      <AvatarImage src={profile?.avatarUrl} />
                      <AvatarFallback className={`text-4xl font-black bg-[#EEF3F8] text-[#0A66C2] ${isOrg ? 'rounded-lg' : ''}`}>
                        {profile?.fullName?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    {isOwnProfile && (
                      <div 
                        className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                        onClick={() => setEditProfileOpen(true)}
                      >
                        <Pencil size={24} className="text-white" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                       <h1 className="text-2xl font-black text-foreground tracking-tight">{profile?.fullName}</h1>
                       {isOrg && <Badge variant="secondary" className="bg-blue-50 text-blue-700 font-bold border-none flex gap-1"><Sparkles size={12} /> Verified</Badge>}
                    </div>
                    <p className="text-sm font-semibold text-slate-600 leading-tight">
                      {isOrg ? `${profile?.title || 'Technology'} • 10,001+ employees` : profile?.title || 'No headline added'}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1">
                      <p className="text-xs text-slate-500 font-bold flex items-center gap-1">
                        <MapPin size={14} className="text-slate-400" /> {profile?.location || 'Location not specified'}
                      </p>
                      {isOrg && (
                         <a href="#" className="text-xs text-[#0A66C2] font-black flex items-center gap-1 hover:underline">
                           <Globe size={14} /> Official Website <ExternalLink size={10} />
                         </a>
                      )}
                      <p className="text-xs text-[#0A66C2] font-black flex items-center gap-1">
                        <Users size={14} /> {profile?.connectionsCount || 0}+ connections
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                    {isOwnProfile ? (
                      <div className="flex gap-2 w-full">
                        <Button className="flex-1 md:flex-none rounded-full bg-[#0A66C2] hover:bg-[#004182] font-black h-9 px-8 shadow-md" onClick={() => setEditProfileOpen(true)}>
                          Edit Profile
                        </Button>
                        <Button variant="outline" className="flex-1 md:flex-none rounded-full border-[#0A66C2] text-[#0A66C2] font-black h-9 px-6 hover:bg-blue-50">
                          Add Section
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Button className="flex-1 md:flex-none rounded-full bg-[#0A66C2] hover:bg-[#004182] font-black h-9 px-8 shadow-lg shadow-blue-100">
                          {isOrg ? '+ Follow' : 'Connect'}
                        </Button>
                        <Button variant="outline" className="flex-1 md:flex-none rounded-full border-[#0A66C2] text-[#0A66C2] font-black h-9 px-8 hover:bg-blue-50">
                          {isOrg ? 'Visit website' : 'Message'}
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {isOrg && (
                  <div className="mt-6 border-t border-slate-100 pt-2">
                    <Tabs defaultValue="about" className="w-full">
                      <TabsList className="bg-transparent border-none p-0 h-auto gap-8">
                        {['About', 'Jobs', 'Members'].map(tab => (
                          <TabsTrigger 
                            key={tab} value={tab.toLowerCase()}
                            className="p-0 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-[#0A66C2] data-[state=active]:text-[#0A66C2] bg-transparent font-black text-xs uppercase tracking-wider transition-all"
                          >
                            {tab}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ANALYTICS SECTION - Enhanced with Imports */}
            {isOwnProfile && !isOrg && (
              <Card className="border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl overflow-hidden">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                     <h2 className="text-base font-black text-foreground uppercase tracking-tight flex items-center gap-2">
                       <LayoutGrid size={18} className="text-[#0A66C2]" /> Analytics
                     </h2>
                     <p className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1"><Eye size={12} /> Private to you</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group">
                      <div className="bg-blue-50 p-2.5 rounded-xl group-hover:bg-blue-100 transition-colors"><Users size={20} className="text-[#0A66C2]" /></div>
                      <div>
                        <p className="text-lg font-black text-foreground leading-tight">{analytics?.profileViews || 0}</p>
                        <p className="text-xs font-bold text-slate-500">Profile views</p>
                        <p className="text-[10px] text-slate-400 mt-1">Discover who's viewing you</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group">
                      <div className="bg-blue-50 p-2.5 rounded-xl group-hover:bg-blue-100 transition-colors"><Search size={20} className="text-[#0A66C2]" /></div>
                      <div>
                        <p className="text-lg font-black text-foreground leading-tight">{analytics?.searchAppearances || 0}</p>
                        <p className="text-xs font-bold text-slate-500">Search appearances</p>
                        <p className="text-[10px] text-slate-400 mt-1">See how often you show up</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* DYNAMIC CONTENT */}
            {isOrg ? (
               <Card className="border border-slate-200 shadow-sm bg-white rounded-xl">
                 <CardContent className="p-8">
                   <h2 className="text-lg font-black text-foreground mb-6 flex items-center gap-2">
                     <Building2 size={20} className="text-[#0A66C2]" /> Overview
                   </h2>
                   <p className="text-sm text-slate-600 leading-relaxed font-medium mb-8">
                     {profile?.bio || 'Company bio not available.'}
                   </p>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 border-t border-slate-100 pt-8">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400"><MapPin size={20} /></div>
                        <div>
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Headquarters</h4>
                          <p className="text-sm font-bold text-slate-700 mt-1">{profile?.location || 'Global'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400"><Calendar size={20} /></div>
                        <div>
                          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">Founded</h4>
                          <p className="text-sm font-bold text-slate-700 mt-1">2010</p>
                        </div>
                      </div>
                   </div>

                   <div className="mt-10">
                      <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Specialties</h4>
                      <div className="flex flex-wrap gap-2">
                         {['AI', 'Cloud Computing', 'Enterprise SaaS', 'Deep Learning'].map(tag => (
                           <Badge key={tag} variant="secondary" className="px-5 py-2 rounded-lg font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 border-none transition-colors">
                             {tag}
                           </Badge>
                         ))}
                      </div>
                   </div>
                 </CardContent>
               </Card>
            ) : (
              <div className="space-y-4">
                <Card className="border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                       <h2 className="font-black text-base text-foreground uppercase tracking-tight flex items-center gap-2">
                         <Info size={18} className="text-[#0A66C2]" /> About
                       </h2>
                       {isOwnProfile && <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setEditProfileOpen(true)}><Pencil size={14} /></Button>}
                    </div>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                      {profile?.bio || 'Add a bio to tell people about your background and goals.'}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-black text-base text-foreground flex items-center gap-2 uppercase tracking-tight">
                        <Briefcase size={18} className="text-[#0A66C2]" /> Experience
                      </h2>
                      {isOwnProfile && (
                        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-slate-100" onClick={() => setExpDialog({ open: true })}>
                          <Plus size={20} className="text-slate-600" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-6">
                      {experiences.length === 0 ? <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic px-2">No experience added yet.</p> :
                        experiences.map((exp, idx) => (
                          <div key={exp.id || idx}>
                            <div className="flex gap-4 group">
                              <div className="h-12 w-12 bg-[#EEF3F8] rounded-lg flex items-center justify-center shrink-0 border border-blue-50">
                                <Building2 size={22} className="text-[#0A66C2]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div className="min-w-0">
                                    <h4 className="text-sm font-black text-foreground truncate">{exp.title}</h4>
                                    <p className="text-xs font-bold text-slate-700">{exp.company} • {exp.employmentType}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase mt-1 flex items-center gap-1">
                                      <Calendar size={12} /> {formatDate(exp.startDate)} – {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                                    </p>
                                  </div>
                                  {isOwnProfile && <Pencil size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 cursor-pointer hover:text-[#0A66C2] transition-all" onClick={() => setExpDialog({ open: true, item: exp })} />}
                                </div>
                                {exp.description && <p className="text-xs mt-3 text-slate-500 font-medium leading-relaxed">{exp.description}</p>}
                              </div>
                            </div>
                            {idx < experiences.length - 1 && <Separator className="mt-6 border-slate-50" />}
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-black text-base text-foreground flex items-center gap-2 uppercase tracking-tight">
                        <GraduationCap size={18} className="text-[#0A66C2]" /> Education
                      </h2>
                      {isOwnProfile && (
                        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-slate-100" onClick={() => setEduDialog({ open: true })}>
                          <Plus size={20} className="text-slate-600" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-6">
                      {educations.length === 0 ? <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic px-2">No education added yet.</p> :
                        educations.map((edu, idx) => (
                          <div key={edu.id || idx}>
                            <div className="flex gap-4 group">
                              <div className="h-12 w-12 bg-[#EEF3F8] rounded-lg flex items-center justify-center shrink-0 border border-blue-50">
                                <GraduationCap size={22} className="text-[#0A66C2]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div className="min-w-0">
                                    <h4 className="text-sm font-black text-foreground truncate">{edu.school || 'University'}</h4>
                                    <p className="text-xs font-bold text-slate-700">{edu.degree} {edu.fieldOfStudy ? `· ${edu.fieldOfStudy}` : ''}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase mt-1 flex items-center gap-1">
                                      <Calendar size={12} /> {formatDate(edu.startDate)} – {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                                    </p>
                                  </div>
                                  {isOwnProfile && <Pencil size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 cursor-pointer hover:text-[#0A66C2] transition-all" onClick={() => setEduDialog({ open: true, item: edu })} />}
                                </div>
                              </div>
                            </div>
                            {idx < educations.length - 1 && <Separator className="mt-6 border-slate-50" />}
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card className="border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="font-black text-sm text-foreground flex items-center gap-2 uppercase tracking-tight">
                          <Star size={16} className="text-[#0A66C2]" /> Skills
                        </h2>
                        {isOwnProfile && <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setSkillOpen(true)}><Plus size={16} /></Button>}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {skills.length === 0 ? <p className="text-[10px] font-bold text-slate-300 uppercase">Not added</p> :
                          skills.map((sk, i) => (
                            <Badge key={i} variant="secondary" className="px-3 py-1 bg-slate-50 text-[#0A66C2] border-slate-100 hover:bg-blue-50 transition-colors cursor-default font-bold text-[11px] rounded-lg">
                              {sk.skillName || sk.name}
                            </Badge>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="font-black text-sm text-foreground flex items-center gap-2 uppercase tracking-tight">
                          <Globe2 size={16} className="text-[#0A66C2]" /> Languages
                        </h2>
                        {isOwnProfile && <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setLangDialog({ open: true })}><Plus size={16} /></Button>}
                      </div>
                      <div className="space-y-3">
                        {languages.length === 0 ? <p className="text-[10px] font-bold text-slate-300 uppercase">Not added</p> :
                          languages.map((lang, i) => (
                            <div key={i} className="flex justify-between items-center group">
                               <div>
                                  <p className="text-xs font-black text-slate-800">{lang.language}</p>
                                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{lang.proficiency}</p>
                               </div>
                               {isOwnProfile && <Pencil size={12} className="text-slate-300 opacity-0 group-hover:opacity-100 cursor-pointer hover:text-[#0A66C2]" onClick={() => setLangDialog({ open: true, item: lang })} />}
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl overflow-hidden">

               <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{isOrg ? 'Similar Organizations' : 'People also viewed'}</h3>
                  <MoreHorizontal size={14} className="text-slate-300" />
               </div>
               <CardContent className="p-4 space-y-6">
                  {isOrg ? (
                    [
                      { name: 'CloudSphere Dynamics', desc: 'Software • 5k employees', icon: <Building2 size={18} /> },
                      { name: 'NeuralSystems Inc.', desc: 'AI • 2k employees', icon: <Sparkles size={18} /> },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-3 group cursor-pointer">
                         <div className="h-10 w-10 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center shrink-0 text-slate-400 group-hover:bg-blue-50 group-hover:text-[#0A66C2] transition-all"><LayoutGrid size={18} /></div>
                         <div className="min-w-0 flex-1">
                            <p className="text-xs font-black text-slate-800 truncate leading-none mb-1">{item.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase truncate">{item.desc}</p>
                            <Button variant="link" className="h-auto p-0 text-[10px] font-black text-[#0A66C2] uppercase mt-1">+ Follow</Button>
                         </div>
                      </div>
                    ))
                  ) : (
                    [
                      { name: 'Lisa Wong', title: 'Principal ML Engineer', icon: <User size={18} /> },
                      { name: 'David Kumar', title: 'ML Research Lead', icon: <User size={18} /> },
                    ].map((person, i) => (
                      <div key={i} className="flex items-center gap-3 group cursor-pointer">
                         <Avatar className="h-10 w-10 border border-white shadow-sm ring-1 ring-slate-100">
                           <AvatarFallback className="bg-slate-50 text-slate-400 text-xs font-bold">{person.name.charAt(0)}</AvatarFallback>
                         </Avatar>
                         <div className="min-w-0 flex-1">
                            <p className="text-xs font-black text-slate-800 group-hover:text-[#0A66C2] group-hover:underline truncate">{person.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase truncate">{person.title}</p>
                         </div>
                         <Button variant="outline" size="sm" className="rounded-full h-7 text-[10px] font-black uppercase px-3 border-[#0A66C2] text-[#0A66C2]">Connect</Button>
                      </div>
                    ))
                  )}
               </CardContent>
            </Card>

            <div className="text-center space-y-4 pt-6">
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-[11px] font-black text-slate-400 uppercase tracking-tighter">
                <span className="hover:text-[#0A66C2] cursor-pointer">About</span>
                <span className="hover:text-[#0A66C2] cursor-pointer">Careers</span>
                <span className="hover:text-[#0A66C2] cursor-pointer">Help Center</span>
              </div>
              <p className="text-[10px] font-black text-slate-300 flex items-center justify-center gap-2 uppercase tracking-widest">
                <span className="bg-[#0A66C2] text-white px-2 py-0.5 rounded text-[9px]">AIJob</span> © 2024 AI Professional Network.
              </p>
            </div>

          </div>
        </div>

        {/* DIALOGS */}
        <EditProfileDialog open={editProfileOpen} onClose={() => setEditProfileOpen(false)} />
        <ExperienceDialog open={expDialog.open} item={expDialog.item} userId={Number(activeUserId)} onClose={() => setExpDialog({ open: false })} />
        <EducationDialog open={eduDialog.open} item={eduDialog.item} onClose={() => setEduDialog({ open: false })} />
        <SkillDialog open={skillOpen} onClose={() => setSkillOpen(false)} userId={String(activeUserId || '')} />
        <LanguageDialog open={langDialog.open} item={langDialog.item} onClose={() => setLangDialog({ open: false })} profileId={String(profile?.id || '')} />
      </div>
    </section>
  );
};

export default Profile;
