import { useFormik } from 'formik';
import {
  Bot,
  Clock,
  Image,
  Loader2,
  MoreHorizontal,
  Paperclip,
  Phone,
  Search,
  Send,
  Smile,
  Sparkles,
  SquarePen,
  Trash2,
  Video,
  X
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as Yup from 'yup';
import {
  createConversation,
  fetchChatHistory,
  fetchConversations,
  searchUsers,
  sendMessage
} from '../../../api/messageApi';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { cn } from '../../../lib/utils';
import { useAppDispatch, useAppSelector } from '../../../store/Hooks';
import { clearActiveChat } from '../../../store/slices/messageSlice';

const validationSchema = Yup.object({
  content: Yup.string().required('Message cannot be empty'),
});

export default function MessagePage() {
  const dispatch = useAppDispatch();
  const { conversations, activeChat, loading, searchResults } = useAppSelector(state => state.messages);
  const [activeConvId, setActiveConvId] = useState<string | number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [convSearchQuery, setConvSearchQuery] = useState('');
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [isAiDraftOpen, setIsAiDraftOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [tempUsers, setTempUsers] = useState<Record<string, any>>({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastMsgIdRef = useRef<number | string | null>(null);

  // 1. Resolve current user ID from profile store or token
  const me = useAppSelector(state => state.profile.profile);
  const currentUserId = useMemo(() => {
    if (me?.id) return String(me.id);
    
    const token = localStorage.getItem("store_token");
    if (!token) return undefined;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const id = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || payload.id || payload.sub || payload.userId;
      return id ? String(id) : undefined;
    } catch (e) {
      return undefined;
    }
  }, [me]);

  // 2. Fetch all conversations on mount
  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  // 3. Handle polling for new messages when a conversation is active
  useEffect(() => {
    if (!activeConvId) return;

    const poll = () => {
      dispatch(fetchChatHistory(activeConvId));
    };

    const interval = setInterval(poll, 4000);
    return () => clearInterval(interval);
  }, [dispatch, activeConvId]);

  // 4. Search directory users when query changes
  useEffect(() => {
    if (isNewChatOpen) {
      dispatch(searchUsers(searchQuery));
    }
  }, [isNewChatOpen, searchQuery, dispatch]);

  // 5. Auto-scroll to bottom
  useEffect(() => {
    if (activeChat.length === 0) return;
    const lastMsg = activeChat[activeChat.length - 1];

    if (lastMsg.id !== lastMsgIdRef.current) {
      lastMsgIdRef.current = lastMsg.id;
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }
  }, [activeChat]);

  const formik = useFormik({
    initialValues: { content: '' },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      if (!values.content.trim() || !activeConvId) return;
      const textToSend = values.content.trim();
      resetForm();
      await dispatch(sendMessage({ conversationId: activeConvId, content: textToSend }));
      dispatch(fetchConversations());
    }
  });

  const handleSelectConversation = (id: string | number) => {
    dispatch(clearActiveChat());
    setActiveConvId(id);
    dispatch(fetchChatHistory(id));
    setIsMenuOpen(false);
    setIsAiDraftOpen(false);
    formik.resetForm();
  };

  const handleStartNewChat = async (user: any) => {
    setIsNewChatOpen(false);
    setSearchQuery('');
    const resultAction = await dispatch(createConversation({ participantId: user.id }));
    if (createConversation.fulfilled.match(resultAction)) {
      const newConv = resultAction.payload;
      const convId = newConv.id || newConv.conversationId;
      setTempUsers(prev => ({ ...prev, [convId]: user }));
      handleSelectConversation(convId);
      dispatch(fetchConversations());
    }
  };

  const handleClearChat = () => {
    dispatch(clearActiveChat());
    setActiveConvId(null);
  };

  const resolveUserObj = (conv: any) => {
    const convId = conv.id || conv.conversationId;
    // Prioritize temporary users from search results
    if (convId && tempUsers[convId]) return tempUsers[convId];
    
    // Explicit otherUser property
    if (conv.otherUser) return conv.otherUser;

    // Participant objects (common in some API responses)
    if (conv.participant1 && String(conv.participant1.id || conv.participant1.userId) !== currentUserId) {
      return conv.participant1;
    }
    if (conv.participant2 && String(conv.participant2.id || conv.participant2.userId) !== currentUserId) {
      return conv.participant2;
    }

    // Participants array fallback
    if (conv.participants && Array.isArray(conv.participants)) {
      const partner = conv.participants.find((p: any) => {
        const pid = String(p.id || p.userId);
        return pid !== currentUserId;
      });
      if (partner) return partner;
    }

    return {};
  };

  const handleAiDraftGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setAiGenerating(true);
    // Logic for AI generation...
    setTimeout(() => {
      formik.setFieldValue('content', `Hi, I'm reaching out regarding ${aiPrompt}. I'd love to connect!`);
      setAiGenerating(false);
      setAiPrompt('');
      setIsAiDraftOpen(false);
    }, 1500);
  };

  const filteredConversations = conversations.filter(conv => {
    const partner = resolveUserObj(conv);
    const name = partner.fullName || partner.username || partner.userName || '';
    return name.toLowerCase().includes(convSearchQuery.toLowerCase());
  });

  const activePartner = activeConvId ? resolveUserObj(conversations.find(c => (c.id || c.conversationId) === activeConvId) || {}) : null;

  return (
    <div className="flex h-screen w-full bg-background text-foreground transition-colors duration-300 overflow-hidden antialiased font-sans">
      <div className="max-w-6xl w-full mx-auto flex h-full bg-card shadow-md border-x border-border">
        
        {/* LEFT PANEL */}
        <div className="w-[340px] flex flex-col h-full bg-card border-r border-border flex-shrink-0">
          <div className="p-4 flex items-center justify-between border-b border-border">
            <h1 className="text-xl font-bold text-foreground tracking-tight">Messaging</h1>
            <button 
              onClick={() => setIsNewChatOpen(true)} 
              className="p-2 hover:bg-muted text-[#0A66C2] rounded-full transition-all"
            >
              <SquarePen size={20} />
            </button>
          </div>
          
          <div className="p-3 border-b border-border bg-muted/30">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-muted-foreground" size={16} />
              <input 
                type="text" 
                placeholder="Search messages..." 
                value={convSearchQuery} 
                onChange={(e) => setConvSearchQuery(e.target.value)} 
                className="w-full pl-9 pr-4 py-2 bg-muted border-none rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/30 transition-all font-medium" 
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-card">
            {loading && conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
                <Loader2 className="animate-spin text-[#0A66C2]" size={20} />
                <span className="text-xs font-semibold">Loading chats...</span>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-12 text-xs font-medium text-muted-foreground">
                No conversations found
              </div>
            ) : (
              filteredConversations.map((conv, index) => {
                const partner = resolveUserObj(conv);
                const convId = conv.id || conv.conversationId || `conv-${index}`;
                const isActive = convId === activeConvId;
                const displayName = partner?.fullName || partner?.username || partner?.userName || 'Chat Partner';
                
                return (
                  <button 
                    key={convId} 
                    onClick={() => handleSelectConversation(convId)} 
                    className={cn(
                      "w-full flex items-start gap-3 p-3 rounded-xl transition-all text-left border",
                      isActive ? "bg-[#0A66C2]/10 border-[#0A66C2]/30 shadow-sm" : "hover:bg-muted border-transparent"
                    )}
                  >
                    <div className="relative flex-shrink-0 mt-0.5">
                      <Avatar className="h-11 w-11 border-2 border-background shadow-sm ring-1 ring-border">
                        <AvatarImage src={partner?.avatarUrl || partner?.profilePicture} className="object-cover" />
                        <AvatarFallback className="bg-[#0A66C2]/10 text-[#0A66C2] font-bold text-sm">
                          {displayName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-background rounded-full"></span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-foreground truncate block">{displayName}</span>
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tight shrink-0">
                          {conv.lastMessage ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground font-medium truncate block">
                        {conv.lastMessage?.content || 'No messages yet'}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 flex flex-col h-full bg-muted/30">
          {activeConvId ? (
            <div className="flex flex-col flex-1 h-full">
              
              <div className="h-16 border-b border-border px-6 flex items-center justify-between flex-shrink-0 bg-card shadow-sm relative z-10">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                      <AvatarImage src={activePartner?.avatarUrl || activePartner?.profilePicture} className="object-cover" />
                      <AvatarFallback className="bg-[#0A66C2]/10 text-[#0A66C2] font-bold text-sm">
                        {(activePartner?.fullName || 'U').charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-background rounded-full"></span>
                  </div>
                  <div>
                    <span className="font-bold text-sm text-foreground block leading-tight">
                      {activePartner?.fullName || activePartner?.username || activePartner?.userName || 'Chat Partner'}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1.5 mt-0.5">
                      {activePartner?.title || 'User'}
                      <span className="text-emerald-500 font-bold uppercase tracking-widest text-[9px]">• Active now</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-muted-foreground">
                  <button className="p-2 hover:bg-muted rounded-full transition-colors"><Video size={18} /></button>
                  <button className="p-2 hover:bg-muted rounded-full transition-colors"><Phone size={16} /></button>
                  <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 hover:bg-muted rounded-full transition-colors relative"><MoreHorizontal size={18} /></button>
                  {isMenuOpen && (
                    <div className="absolute right-6 top-14 mt-1 w-44 rounded-xl border border-border bg-card p-1 shadow-lg z-20">
                      <button 
                        onClick={handleClearChat} 
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors text-left"
                      >
                        <Trash2 size={14} /> Clear chat
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <ScrollArea className="flex-1 p-6" viewportRef={scrollRef}>
                <div className="flex flex-col gap-4">
                  {activeChat.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                      <div className="bg-muted p-6 rounded-full">
                        <Bot size={48} className="text-[#0A66C2]/30" />
                      </div>
                      <div>
                        <h3 className="text-foreground font-bold">Say hello!</h3>
                        <p className="text-muted-foreground text-xs mt-1">Start a conversation with {activePartner?.fullName || 'this user'}.</p>
                      </div>
                    </div>
                  ) : (
                    activeChat.map((msg, i) => {
                      const isMe = String(msg.senderId) === String(currentUserId);
                      return (
                        <div key={msg.id || i} className={cn("flex group", isMe ? "justify-end" : "justify-start")}>
                          <div className={cn("max-w-[75%] flex gap-2.5", isMe ? "flex-row-reverse" : "flex-row")}>
                            {!isMe && (
                              <Avatar className="h-8 w-8 shrink-0 border border-border shadow-sm mt-0.5">
                                <AvatarImage src={activePartner?.avatarUrl || activePartner?.profilePicture} className="object-cover" />
                                <AvatarFallback className="bg-muted text-muted-foreground font-bold text-xs">
                                  {(activePartner?.fullName || 'U').charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div className="flex flex-col">
                              <div className={cn(
                                "px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-sm break-words whitespace-pre-wrap",
                                isMe ? "bg-[#0A66C2] text-white rounded-tr-none" : "bg-muted text-foreground rounded-tl-none border border-border/50"
                              )}>
                                <p className="m-0 font-medium">{msg.content}</p>
                              </div>
                              <span className={cn("text-[9px] font-black text-muted-foreground mt-1.5 uppercase tracking-tighter", isMe ? "text-right" : "text-left")}>
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-border bg-card flex-shrink-0 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
                {isAiDraftOpen && (
                  <div className="mb-3 p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900 rounded-xl space-y-2.5 animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center gap-2 text-[#663399] dark:text-indigo-400">
                      <Sparkles size={16} />
                      <span className="text-xs font-bold uppercase tracking-wider">AI Copilot Messenger</span>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Context (e.g. 'follow up about job')"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        className="h-10 bg-background border-border text-xs font-medium focus-visible:ring-[#0A66C2]"
                      />
                      <Button
                        onClick={handleAiDraftGenerate}
                        disabled={aiGenerating}
                        className="h-10 bg-[#0A66C2] hover:bg-[#004182] text-white font-bold px-4 rounded-lg flex gap-1.5"
                      >
                        {aiGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                        {aiGenerating ? "Drafting..." : "Generate"}
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setIsAiDraftOpen(false)}
                        className="h-10 text-muted-foreground hover:bg-muted font-bold px-2 rounded-lg"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <form onSubmit={formik.handleSubmit} className="space-y-3">
                  <div className="relative">
                    <Input 
                      name="content"
                      placeholder="Write a message..." 
                      value={formik.values.content} 
                      onChange={formik.handleChange} 
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); formik.handleSubmit(); } }}
                      className="pr-28 h-12 bg-muted border-none focus-visible:ring-2 focus-visible:ring-[#0A66C2]/40 rounded-xl text-sm font-medium transition-all"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-muted-foreground">
                      <button type="button" className="p-1 hover:text-[#0A66C2] transition-colors"><Image size={16} /></button>
                      <button type="button" className="p-1 hover:text-[#0A66C2] transition-colors"><Paperclip size={16} /></button>
                      <button type="button" className="p-1 hover:text-[#0A66C2] transition-colors"><Smile size={16} /></button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAiDraftOpen(!isAiDraftOpen)}
                      className="border-indigo-200 dark:border-indigo-900 text-[#0A66C2] dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 font-bold text-xs h-9 px-3.5 flex gap-1.5 rounded-full transition-all"
                    >
                      <Sparkles size={14} />
                      AI Draft Message
                    </Button>

                    <div className="flex items-center gap-3">
                      <button type="button" className="text-muted-foreground hover:text-foreground transition-colors"><Clock size={16} /></button>
                      <Button 
                        type="submit" 
                        disabled={!formik.values.content.trim()} 
                        className="h-9 px-5 bg-[#0A66C2] hover:bg-[#004182] disabled:opacity-50 text-white text-xs font-bold rounded-full transition-all"
                      >
                        Send <Send size={12} className="ml-1.5" />
                      </Button>
                    </div>
                  </div>
                </form>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-background">
              <div className="w-16 h-16 border border-border bg-muted rounded-2xl flex items-center justify-center text-[#0A66C2] mb-4 shadow-sm">
                <SquarePen size={28} />
              </div>
              <h3 className="text-sm font-bold text-foreground">Your Inbox</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-[240px] text-center leading-relaxed">
                Select a contact from the sidebar or search your network to start messaging.
              </p>
              <Button 
                onClick={() => setIsNewChatOpen(true)} 
                className="mt-4 bg-[#0A66C2] hover:bg-[#004182] font-bold px-5 py-2 rounded-full text-white text-xs"
              >
                New Message
              </Button>
            </div>
          )}
        </div>

      </div>

      {isNewChatOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card text-foreground border border-border rounded-2xl w-full max-w-sm shadow-xl flex flex-col max-h-[460px] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 flex items-center justify-between border-b border-border">
              <div>
                <h2 className="text-base font-bold text-foreground leading-none">New message</h2>
                <p className="text-xs text-muted-foreground mt-1">Search the directory to start a new chat.</p>
              </div>
              <button 
                onClick={() => { setIsNewChatOpen(false); setSearchQuery(''); }} 
                className="p-1 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-3 border-b border-border bg-muted/30">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-muted-foreground" size={16} />
                <input 
                  type="text" 
                  placeholder="Search by name or username..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="w-full pl-9 pr-4 py-1.5 bg-muted border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/30 transition-all font-medium" 
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-0.5 bg-card">
              {searchResults.length === 0 ? (
                <div className="text-center py-10 text-xs font-semibold text-muted-foreground">
                  No directory users found
                </div>
              ) : (
                searchResults.map((user) => {
                  const itemDisplayName = user.fullName || user.username || user.userName || 'User';
                  return (
                    <button 
                      key={user.id} 
                      onClick={() => handleStartNewChat(user)} 
                      className="w-full flex items-center gap-3 p-2.5 hover:bg-muted rounded-xl text-left transition-all border border-transparent"
                    >
                      <Avatar className="h-9 w-9 border border-border shadow-sm">
                        <AvatarImage src={user.avatarUrl || user.profilePicture} className="object-cover" />
                        <AvatarFallback className="bg-muted text-muted-foreground font-bold text-xs">
                          {itemDisplayName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-bold text-sm text-foreground block leading-tight">{itemDisplayName}</span>
                        <span className="text-[11px] font-semibold text-muted-foreground mt-0.5 block">{user.title || 'Professional'}</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
