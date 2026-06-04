import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Bot, FileText, Target, Mail, Send, Sparkles,
  Loader2, TrendingUp, Info, Upload,
} from 'lucide-react';
import {
  askAi, analyzeCv, draftAiMessage, analyzeSkillGap, draftCoverLetter,
} from '../../../api/aiApi';
import { addMessage, clearChat, type AiToolType } from '../../../store/slices/aiSlice';
import type { AppDispatch, RootState } from '../../../store';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Progress } from '../../../components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';

// ─── Tab config ────────────────────────────────────────────────────────────────
const tabs: { id: AiToolType; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'ask', label: 'Ask AI', icon: <Bot size={18} />, desc: 'Ask anything about your career' },
  { id: 'analyze', label: 'Analyze CV', icon: <FileText size={18} />, desc: 'Upload your CV for AI feedback' },
  { id: 'gap', label: 'Skill Gap', icon: <Target size={18} />, desc: 'Find skills you are missing for a job' },
  { id: 'cover', label: 'Cover Letter', icon: <Mail size={18} />, desc: 'Generate a tailored cover letter' },
  { id: 'draft', label: 'Draft Message', icon: <Send size={18} />, desc: 'Draft a professional message' },
];

// ─── Component ─────────────────────────────────────────────────────────────────
const AI = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { histories, loadingStates, usage } = useSelector((s: RootState) => s.ai);
  const { me } = useSelector((s: RootState) => s.profile);

  const [activeTab, setActiveTab] = useState<AiToolType>('ask');
  const [askInput, setAskInput] = useState('');   // for "ask" tab
  const [jobId, setJobId] = useState('');   // for gap / cover
  const [draftCtx, setDraftCtx] = useState('');   // context for draft
  const [recipientId, setRecipientId] = useState(''); // recipient for draft
  const [cvFile, setCvFile] = useState<File | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentHistory = histories[activeTab] || [];
  const currentLoading = loadingStates[activeTab] || false;
  const currentTab = tabs.find(t => t.id === activeTab)!;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [currentHistory, currentLoading]);

  // ── Send logic per tool ────────────────────────────────────────────────────
  const pushUserMsg = (tool: AiToolType, content: string) => {
    dispatch(addMessage({
      tool,
      message: { id: Date.now().toString(), role: 'user', content, timestamp: new Date().toISOString() },
    }));
  };

  const handleSend = async () => {
    if (currentLoading) return;

    switch (activeTab) {

      // 1. Ask AI — needs text
      case 'ask': {
        if (!askInput.trim()) return;
        pushUserMsg('ask', askInput);
        const msg = askInput;
        setAskInput('');
        await dispatch(askAi(msg));
        break;
      }

      // 2. Analyze CV — needs a file
      case 'analyze': {
        if (!cvFile) return;
        pushUserMsg('analyze', `Analyzing file: ${cvFile.name}`);
        await dispatch(analyzeCv(cvFile));
        setCvFile(null);
        break;
      }

      // 3. Skill Gap — needs a Job ID
      case 'gap': {
        if (!jobId.trim()) return;
        pushUserMsg('gap', `Skill gap analysis for Job ID: ${jobId}`);
        await dispatch(analyzeSkillGap({ jobId }));
        break;
      }

      // 4. Cover Letter — needs a Job ID
      case 'cover': {
        if (!jobId.trim()) return;
        pushUserMsg('cover', `Draft cover letter for Job ID: ${jobId}`);
        await dispatch(draftCoverLetter({ jobId }));
        break;
      }

      // 5. Draft Message — needs recipient + optional context
      case 'draft': {
        if (!recipientId.trim()) return;
        const context = draftCtx || 'Follow up';
        pushUserMsg('draft', `Draft message to ${recipientId} — "${context}"`);
        await dispatch(draftAiMessage({ recipientId, context }));
        setDraftCtx('');
        break;
      }
    }
  };

  // ── Enter key sends (except for textarea-like fields) ─────────────────────
  const onEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Send button enabled state ──────────────────────────────────────────────
  const canSend = () => {
    if (currentLoading) return false;
    if (activeTab === 'ask') return askInput.trim().length > 0;
    if (activeTab === 'analyze') return cvFile !== null;
    if (activeTab === 'gap') return jobId.trim().length > 0;
    if (activeTab === 'cover') return jobId.trim().length > 0;
    if (activeTab === 'draft') return recipientId.trim().length > 0;
    return false;
  };

  // ─── JSX ──────────────────────────────────────────────────────────────────
  return (
    <div className="bg-background text-foreground transition-colors duration-300 h-screen overflow-hidden flex flex-col lg:py-6 lg:px-4 font-sans">

      {/* ── Mobile Tab Strip (only visible on small screens) ─────────────── */}
      <div className="flex lg:hidden items-center gap-2 px-3 py-2 bg-card border-b border-border overflow-x-auto shrink-0 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0 ${activeTab === tab.id
                ? 'bg-[#0A66C2] text-white shadow-sm'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Main Grid ─────────────────────────────────────────────────────── */}
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 lg:gap-6 flex-1 min-h-0">

        {/* ── Left Sidebar ─────────────────────────────────────────────────── */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-4 overflow-y-auto">
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">AI Tools</h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Career Suite</p>
          </div>

          <div className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id
                    ? 'bg-[#DCE6F1] text-[#0A66C2] border-l-4 border-[#0A66C2] shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200'
                  }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <Card className="border-none shadow-sm bg-[#E9E5F3]/50 rounded-xl mt-auto">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Sparkles size={16} className="text-[#663399] mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-[10px] font-black text-[#663399] uppercase tracking-widest">Pro Tip</h4>
                  <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed italic font-medium">
                    Each AI tool keeps its own separate chat history. Switch tabs freely!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Main Chat Card ───────────────────────────────────────────────── */}
        <Card className="lg:col-span-6 flex flex-col border-0 lg:border lg:border-border shadow-none lg:shadow-sm rounded-none lg:rounded-xl overflow-hidden bg-card h-full">

          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between bg-card z-10 shadow-sm shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-[#0A66C2] p-2.5 rounded-xl text-white shadow-md shadow-blue-100">
                {currentTab.icon}
              </div>
              <div>
                <h2 className="font-bold text-base text-foreground">{currentTab.label}</h2>
                <p className="text-[10px] text-slate-500 font-medium">{currentTab.desc}</p>
              </div>
            </div>
            <Button
              variant="ghost" size="sm"
              className="text-[#0A66C2] hover:text-[#004182] font-black text-[10px] uppercase tracking-widest"
              onClick={() => dispatch(clearChat(activeTab))}
            >
              Clear
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 min-h-0 p-6" viewportRef={scrollRef}>
            <div className="flex flex-col gap-6">

              {/* Empty state */}
              {currentHistory.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="bg-slate-50 p-8 rounded-full shadow-inner border border-slate-100">
                    <Sparkles size={48} className="text-blue-200" />
                  </div>
                  <div className="max-w-xs">
                    <h3 className="text-slate-800 font-bold text-sm">
                      {currentTab.label} is ready!
                    </h3>
                    <p className="text-slate-400 font-medium text-xs mt-2">{currentTab.desc}</p>
                  </div>
                </div>
              )}

              {/* Message bubbles */}
              {currentHistory.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <Avatar className={`h-9 w-9 shrink-0 shadow-sm border-2 border-white ring-1 ${msg.role === 'user' ? 'ring-blue-100' : 'ring-slate-100'}`}>
                      {msg.role === 'user'
                        ? <AvatarImage src={me?.profilePicture} />
                        : <div className="bg-[#0A66C2] w-full h-full flex items-center justify-center text-white"><Bot size={16} /></div>
                      }
                      <AvatarFallback className="text-[10px] uppercase font-black">
                        {msg.role === 'user' ? (me?.fullName?.charAt(0) || 'U') : 'AI'}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed shadow-sm break-words whitespace-pre-wrap ${msg.role === 'user'
                          ? 'bg-[#EBF4FF] text-[#0A66C2] rounded-tr-none border border-blue-50'
                          : 'bg-[#F3F2EF] text-slate-800 rounded-tl-none border border-slate-200/50'
                        }`}>
                        {msg.content}
                      </div>
                      <span className="text-[9px] font-black text-slate-300 mt-1.5 uppercase tracking-tighter">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {currentLoading && (
                <div className="flex justify-start animate-in fade-in duration-500">
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="h-9 w-9 rounded-full bg-[#0A66C2] flex items-center justify-center text-white shadow-lg border-2 border-white ring-1 ring-slate-100 shrink-0">
                      <Bot size={16} />
                    </div>
                    <div className="bg-[#F3F2EF] px-5 py-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm flex items-center gap-3">
                      <Loader2 className="animate-spin text-blue-600" size={16} />
                      <span className="text-[13px] text-slate-500 font-bold tracking-tight">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* ── Adaptive Input Panel ─────────────────────────────────────── */}
          <div className="p-4 border-t border-border bg-card shrink-0">

            {/* ASK AI — plain text input */}
            {activeTab === 'ask' && (
              <div className="relative">
                <Input
                  placeholder="Ask anything about your career..."
                  className="pr-12 h-12 bg-muted border-none focus-visible:ring-2 focus-visible:ring-[#0A66C2] rounded-xl text-sm font-medium"
                  value={askInput}
                  onChange={(e) => setAskInput(e.target.value)}
                  onKeyDown={onEnter}
                />
                <Button
                  size="icon"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-lg shadow-md active:scale-95 disabled:opacity-30"
                  onClick={handleSend}
                  disabled={!canSend()}
                >
                  <Send size={16} />
                </Button>
              </div>
            )}

            {/* ANALYZE CV — file upload */}
            {activeTab === 'analyze' && (
              <div className="space-y-3">
                {cvFile && (
                  <p className="text-xs text-slate-500 font-medium px-1">
                    📄 Selected: <span className="font-bold text-slate-700">{cvFile.name}</span>
                  </p>
                )}
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
                  />
                  <Button
                    variant="outline"
                    className="flex-1 border-dashed border-2 border-blue-200 hover:bg-blue-50 text-[#0A66C2] font-bold text-sm h-11 flex gap-2 rounded-xl"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={16} /> {cvFile ? 'Change File' : 'Choose CV File (.pdf / .doc)'}
                  </Button>
                  <Button
                    className="h-11 px-6 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-xl font-bold disabled:opacity-30"
                    onClick={handleSend}
                    disabled={!canSend()}
                  >
                    {currentLoading ? <Loader2 size={16} className="animate-spin" /> : 'Analyze'}
                  </Button>
                </div>
              </div>
            )}

            {/* SKILL GAP — Job ID */}
            {activeTab === 'gap' && (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter Job ID (e.g. 101)"
                  className="flex-1 h-12 bg-[#F3F2EF] border-none focus-visible:ring-2 focus-visible:ring-[#0A66C2] rounded-xl text-sm font-medium"
                  value={jobId}
                  onChange={(e) => setJobId(e.target.value)}
                  onKeyDown={onEnter}
                />
                <Button
                  className="h-12 px-6 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-xl font-bold disabled:opacity-30"
                  onClick={handleSend}
                  disabled={!canSend()}
                >
                  {currentLoading ? <Loader2 size={16} className="animate-spin" /> : 'Analyze Gap'}
                </Button>
              </div>
            )}

            {/* COVER LETTER — Job ID */}
            {activeTab === 'cover' && (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter Job ID (e.g. 101)"
                  className="flex-1 h-12 bg-[#F3F2EF] border-none focus-visible:ring-2 focus-visible:ring-[#0A66C2] rounded-xl text-sm font-medium"
                  value={jobId}
                  onChange={(e) => setJobId(e.target.value)}
                  onKeyDown={onEnter}
                />
                <Button
                  className="h-12 px-6 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-xl font-bold disabled:opacity-30"
                  onClick={handleSend}
                  disabled={!canSend()}
                >
                  {currentLoading ? <Loader2 size={16} className="animate-spin" /> : 'Generate'}
                </Button>
              </div>
            )}

            {/* DRAFT MESSAGE — Recipient ID + optional context */}
            {activeTab === 'draft' && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Recipient ID"
                    className="w-36 h-10 bg-[#F3F2EF] border-none focus-visible:ring-2 focus-visible:ring-[#0A66C2] rounded-xl text-xs font-medium"
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                  />
                  <Input
                    placeholder='Context, e.g. "follow up after interview"'
                    className="flex-1 h-10 bg-[#F3F2EF] border-none focus-visible:ring-2 focus-visible:ring-[#0A66C2] rounded-xl text-xs font-medium"
                    value={draftCtx}
                    onChange={(e) => setDraftCtx(e.target.value)}
                    onKeyDown={onEnter}
                  />
                  <Button
                    className="h-10 px-5 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-xl font-bold disabled:opacity-30"
                    onClick={handleSend}
                    disabled={!canSend()}
                  >
                    {currentLoading ? <Loader2 size={16} className="animate-spin" /> : 'Draft'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* ── Right Sidebar ────────────────────────────────────────────────── */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-4 overflow-y-auto">
          <Card className="border-none shadow-sm bg-white overflow-hidden rounded-xl border border-slate-100">
            <CardContent className="p-5 space-y-6">
              <h3 className="font-black text-slate-800 text-[11px] uppercase tracking-widest">Usage This Month</h3>

              <div className="space-y-2.5">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-tighter">
                  <span className="text-slate-400">AI Queries</span>
                  <span className="text-[#0A66C2]">{usage.queriesUsed} / {usage.queriesLimit}</span>
                </div>
                <Progress value={(usage.queriesUsed / usage.queriesLimit) * 100} className="h-1.5 bg-slate-100" />
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-tighter">
                  <span className="text-slate-400">CV Analysis</span>
                  <span className="text-[#0A66C2]">{usage.cvAnalysesUsed} / {usage.cvAnalysesLimit}</span>
                </div>
                <Progress value={(usage.cvAnalysesUsed / usage.cvAnalysesLimit) * 100} className="h-1.5 bg-slate-100" />
              </div>

              <Button variant="outline" className="w-full rounded-full border-2 border-[#0A66C2] text-[#0A66C2] font-black text-[11px] uppercase tracking-widest h-10 hover:bg-blue-50 active:scale-95">
                Upgrade to Pro
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white overflow-hidden rounded-xl group cursor-pointer border border-slate-100">
            <div className="aspect-video bg-gradient-to-br from-slate-900 via-slate-800 to-[#0A66C2] relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 p-5 text-center">
                <div className="flex justify-center mb-3">
                  <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/20 shadow-xl group-hover:scale-110 transition-transform duration-500">
                    <TrendingUp size={28} className="text-blue-400" />
                  </div>
                </div>
                <h4 className="text-white font-black text-[10px] uppercase tracking-[0.2em] mb-1.5">Coming Soon</h4>
                <p className="text-[10px] text-slate-300 leading-relaxed font-medium px-2">
                  AI Mock Interview: Practice real-time voice conversations with AI recruiters.
                </p>
              </div>
              <div className="absolute top-0 right-0 p-3">
                <Info size={14} className="text-slate-500 hover:text-white transition-colors" />
              </div>
            </div>
          </Card>

          <div className="px-6 text-center space-y-2 mt-auto">
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] font-black text-slate-300 uppercase tracking-tighter">
              <span>Careers</span><span>Privacy</span><span>Terms</span>
            </div>
            <p className="text-[10px] font-black text-slate-200 flex items-center justify-center gap-1 uppercase tracking-widest">
              <span className="text-[#0A66C2] opacity-50">AIJob</span> © 2024 AIJob.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AI;
