import {
  Bookmark,
  Briefcase,
  CheckCircle2,
  Clock, DollarSign,
  GraduationCap,
  Loader2,
  Search,
  Share2,
  Sparkles
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  applyToJob,
  fetchJobs,
  toggleSaveJob
} from '../../../api/jobApi';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Separator } from '../../../components/ui/separator';
import { useToast } from '../../../components/ui/use-toast';
import type { AppDispatch, RootState } from '../../../store';
import { setSelectedJob } from '../../../store/slices/jobSlice';


const JobSearch = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs, selectedJob, loading } = useSelector((s: RootState) => s.jobs);
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const handleApply = async (id: string | number) => {
    try {
      await dispatch(applyToJob(id)).unwrap();
      toast({ title: 'Application Sent!', description: 'Your profile has been shared with the recruiter.' });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to apply. Please try again.' });
    }
  };

  const handleSave = (id: string | number) => {
    dispatch(toggleSaveJob(id));
    const job = jobs.find(j => j.id === id);
    toast({ title: !job?.isSaved ? 'Job Saved' : 'Job Unsaved' });
  };

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-background text-foreground transition-colors duration-300 min-h-screen">
      <div className="max-w-[1440px] mx-auto flex h-[calc(100vh-64px)] overflow-hidden">
        
        <div className="w-[380px] flex flex-col border-r bg-card">
          <div className="p-4 border-b">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="text"
                placeholder="Search jobs by title or company"
                className="w-full h-11 pl-10 pr-4 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-3 space-y-3">
              {loading && jobs.length === 0 ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-600" /></div>
              ) : filteredJobs.length === 0 ? (
                <div className="text-center py-20 text-slate-400 italic text-sm">No jobs found.</div>
              ) : (
                filteredJobs.map((job) => (
                  <div 
                    key={job.id}
                    className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                      selectedJob?.id === job.id 
                      ? 'bg-blue-50/50 border-blue-600 shadow-sm' 
                      : 'hover:bg-slate-50 border-transparent hover:border-slate-100'
                    }`}
                    onClick={() => dispatch(setSelectedJob(job))}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="h-10 w-10 bg-white rounded-lg border overflow-hidden flex items-center justify-center shadow-sm">
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-100 font-bold text-[10px] tracking-tight uppercase px-2 py-0.5">
                        {job.aiMatchScore || 50}% Match
                      </Badge>
                    </div>
                    <h3 className={`font-bold text-base truncate mb-1 ${selectedJob?.id === job.id ? 'text-blue-700' : 'text-foreground'}`}>
                      {job.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mb-3">{job.companyName} • {job.location}</p>
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <span className="flex items-center gap-1"><Clock size={12} /> {job.postedAt || 'Posted 2h ago'}</span>
                      <span className="text-blue-600 font-black">{job.salary || 'Not specified'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="flex-1 flex flex-col bg-muted/30">
          {selectedJob ? (
            <ScrollArea className="flex-1">
              <div className="p-8 max-w-4xl mx-auto w-full">
                <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-card">
                  <CardContent className="p-0">
                    <div className="p-8 pb-6 flex justify-between items-start">
                      <div className="flex gap-6">
                        <div className="h-20 w-20 bg-muted rounded-2xl border border-border overflow-hidden flex items-center justify-center shadow-inner">
                        </div>
                        <div className="space-y-1">
                          <h1 className="text-3xl font-black text-foreground tracking-tight">{selectedJob.title}</h1>
                          <p className="text-muted-foreground font-bold flex items-center gap-2 text-lg">
                            {selectedJob.companyName} • {selectedJob.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button 
                          className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 h-12 rounded-2xl shadow-xl shadow-blue-600/30 transition-all active:scale-95"
                          onClick={() => handleApply(selectedJob.id)}
                        >
                          Apply Now
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className={`h-12 w-12 rounded-2xl transition-all ${selectedJob.isSaved ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'}`}
                          onClick={() => handleSave(selectedJob.id)}
                        >
                          <Bookmark className={selectedJob.isSaved ? 'fill-current' : ''} />
                        </Button>
                        <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl text-muted-foreground"><Share2 /></Button>
                      </div>
                    </div>

                    <div className="px-8 pb-10">
                      <div className="grid grid-cols-4 gap-4 p-5 bg-muted/50 rounded-[2rem] border border-border">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                            <Briefcase size={12} /> Experience
                          </p>
                          <p className="font-bold text-foreground">{selectedJob.experienceLevel || '5+ Years'}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                            <GraduationCap size={12} /> Education
                          </p>
                          <p className="font-bold text-foreground">{selectedJob.educationLevel || 'PhD / Masters'}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                            <DollarSign size={12} /> Salary
                          </p>
                          <p className="font-bold text-foreground">{selectedJob.salary || 'Not specified'}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center gap-1.5">
                            <Sparkles size={12} /> AI Match
                          </p>
                          <p className="font-black text-green-500">{selectedJob.aiMatchScore || 50}% Match</p>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-border h-px mx-8" />

                    <div className="p-8 flex flex-col lg:flex-row gap-12">
                      <div className="flex-1 space-y-10">
                        <section>
                          <h2 className="text-xl font-black text-foreground mb-4 tracking-tight uppercase tracking-wider text-xs opacity-50">Job Description</h2>
                          <div className="text-muted-foreground leading-relaxed font-medium space-y-4">
                            {selectedJob.description.split('\n').map((para, i) => (
                              <p key={i}>{para}</p>
                            ))}
                          </div>
                        </section>

                        <section>
                          <h2 className="text-xl font-black text-foreground mb-5 tracking-tight uppercase tracking-wider text-xs opacity-50">Required Skills</h2>
                          <div className="flex flex-wrap gap-3">
                            {(selectedJob.skills || ['PyTorch', 'Transformers', 'Distributed Training', 'CUDA', 'NLP', 'Deep Learning', 'LLMs']).map(skill => (
                              <Badge 
                                key={skill} 
                                variant="outline" 
                                className="px-5 py-2 rounded-full border-border text-muted-foreground font-bold text-xs hover:border-blue-600 hover:text-blue-600 transition-colors cursor-default bg-card"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </section>
                      </div>

                      <div className="w-full lg:w-[320px] space-y-8">
                        <div className="p-6 bg-blue-50/50 rounded-[2.5rem] border border-blue-100 ring-1 ring-blue-50 relative overflow-hidden group">
                          <div className="absolute -right-4 -top-4 bg-blue-600/5 h-24 w-24 rounded-full group-hover:scale-150 transition-transform duration-700" />
                          <div className="relative z-10 space-y-6">
                             <div className="flex items-center gap-3">
                               <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200"><Sparkles size={18} /></div>
                               <h3 className="font-black text-blue-700 uppercase tracking-widest text-[10px]">Why You Match</h3>
                             </div>
                             <div className="space-y-4">
                                {[
                                  'Your AI experience matches requirements.',
                                  'Previous ML research experience.',
                                  'Salary expectations fit range.',
                                  'Leadership opportunity available.'
                                ].map((reason, i) => (
                                  <div key={i} className="flex gap-3 items-start">
                                    <CheckCircle2 size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-[11px] font-bold text-blue-900 leading-tight">{reason}</p>
                                  </div>
                                ))}
                             </div>
                             <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black h-11 rounded-2xl shadow-lg shadow-blue-600/20 text-xs">
                               View Full Fit Report
                             </Button>
                          </div>
                        </div>

                        <div className="p-6 border border-slate-100 rounded-[2.5rem] bg-white shadow-sm space-y-6">
                           <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px]">Recruiter Info</h3>
                           <div className="flex items-center gap-4">
                              <Avatar className="h-14 w-14 shadow-lg border-2 border-white ring-1 ring-slate-100">
                                <AvatarImage src={selectedJob.recruiter?.avatarUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"} />
                                <AvatarFallback>SC</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-black text-foreground text-sm leading-tight">{selectedJob.recruiter?.fullName || 'Sarah Chen'}</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{selectedJob.recruiter?.title || 'Head of Talent'}</p>
                              </div>
                           </div>
                           <Button variant="ghost" className="w-full rounded-2xl text-xs font-black text-blue-600 hover:bg-blue-50 gap-2">
                             <MessageSquare size={14} /> Contact Recruiter
                           </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-card m-8 rounded-[3rem] shadow-sm border-2 border-dashed border-border">
              <div className="bg-muted p-10 rounded-full mb-8">
                <Briefcase size={64} className="text-muted-foreground/30" />
              </div>
              <h2 className="text-3xl font-black text-foreground mb-4 tracking-tighter">Select a job to view details</h2>
              <p className="text-muted-foreground max-w-sm font-medium leading-relaxed">
                Click on one of the positions in the list to your left to explore the full description, requirements, and AI match analysis.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

const MessageSquare = ({ size }: { size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

export default JobSearch;
