import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, Briefcase, Users, ThumbsUp, MessageSquare, Settings, 
  TrendingUp, MoreHorizontal, CheckCircle2, Loader2 
} from 'lucide-react';
import { fetchNotifications, markAsRead, markAllAsRead, type Notification } from '../../../api/notificationApi';
import { respondToConnection } from '../../../api/connectionApi';
import type { AppDispatch, RootState } from '../../../store';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Separator } from '../../../components/ui/separator';

const Notifications = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { notifications, loading } = useSelector((s: RootState) => s.notifications);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAllRead = () => {
    dispatch(markAllAsRead());
  };

  const handleAction = async (n: Notification, action: 'accept' | 'reject') => {
    if (n.type === 'connection_request' && n.relatedId) {
      await dispatch(respondToConnection({ connectionId: n.relatedId, action }));
      dispatch(markAsRead(n.id));
      if (action === 'accept') {
        navigate('/messages');
      }
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'jobs') return n.type === 'job_alert';
    if (filter === 'connections') return n.type === 'connection_request' || n.type === 'connection_accepted';
    if (filter === 'posts') return n.type === 'post_like' || n.type === 'post_comment';
    if (filter === 'system') return n.type === 'system';
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'job_alert': return <Briefcase className="text-blue-600" size={20} />;
      case 'connection_request': return <Users className="text-green-600" size={20} />;
      case 'post_like': return <ThumbsUp className="text-blue-500" size={20} />;
      case 'post_comment': return <MessageSquare className="text-purple-500" size={20} />;
      default: return <Bell className="text-slate-400" size={20} />;
    }
  };

  return (
    <div className="bg-background text-foreground transition-colors duration-300 min-h-screen py-6 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Sidebar */}
        <div className="hidden lg:block lg:col-span-3 space-y-4">
          <Card className="border border-border shadow-sm overflow-hidden rounded-xl">
            <CardContent className="p-0">
              <div className="p-4 bg-card">
                <h3 className="font-bold text-slate-800 text-sm mb-4">Manage your Notifications</h3>
                <Button variant="ghost" className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-bold text-xs p-0 h-auto">
                  View Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm overflow-hidden rounded-xl">
            <CardContent className="p-4 bg-white">
              <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-blue-600" />
                Trending AI Roles
              </h3>
              <div className="space-y-3">
                {['ML Ops Engineer', 'Prompt Architect', 'AI Ethics Officer'].map((role) => (
                  <div key={role} className="flex items-center gap-2 group cursor-pointer">
                    <TrendingUp size={14} className="text-slate-400 group-hover:text-blue-600" />
                    <span className="text-xs text-slate-600 group-hover:text-blue-600 font-medium transition-colors">{role}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="border border-border shadow-sm overflow-hidden rounded-xl bg-card">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h1 className="text-xl font-black text-slate-800 tracking-tight">Notifications</h1>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-blue-600 hover:text-blue-700 font-bold text-xs"
                onClick={handleMarkAllRead}
              >
                Mark all as read
              </Button>
            </div>

            <div className="px-4 pt-2">
              <Tabs defaultValue="all" onValueChange={setFilter}>
                <TabsList className="bg-transparent border-none p-0 h-auto gap-4">
                  {['All', 'Jobs', 'Connections', 'Posts', 'System'].map((t) => (
                    <TabsTrigger 
                      key={t} 
                      value={t.toLowerCase()}
                      className="rounded-full px-4 py-1.5 text-xs font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-200 transition-all border border-slate-100"
                    >
                      {t}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div className="divide-y divide-slate-50 mt-4">
              {loading && notifications.length === 0 ? (
                <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>
              ) : filteredNotifications.length === 0 ? (
                <div className="py-24 text-center text-slate-400 italic text-sm">No notifications yet.</div>
              ) : (
                filteredNotifications.map((n) => (
                  <div 
                    key={n.id} 
                    className={`p-4 flex gap-4 transition-colors hover:bg-slate-50 group cursor-pointer ${!n.isRead ? 'bg-blue-50/30' : ''}`}
                    onClick={() => dispatch(markAsRead(n.id))}
                  >
                    <div className="relative">
                      {n.sender ? (
                        <Avatar className="h-14 w-14 border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
                          <AvatarImage src={n.sender.profilePicture} />
                          <AvatarFallback className="bg-slate-100 text-slate-600 font-black">
                            {n.sender.fullName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-14 w-14 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                          {getIcon(n.type)}
                        </div>
                      )}
                      {!n.isRead && (
                        <div className="absolute -top-1 -right-1 h-4 w-4 bg-blue-600 border-2 border-white rounded-full shadow-sm" />
                      )}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <p className="text-sm text-slate-800 leading-snug">
                          {n.sender && <span className="font-black text-slate-900">{n.sender.fullName} </span>}
                          {n.message}
                        </p>
                        <span className="text-[10px] font-bold text-slate-400 uppercase whitespace-nowrap ml-2">
                          {new Date(n.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>

                      {n.type === 'connection_request' && (
                        <div className="flex gap-2 mt-3">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 rounded-full text-xs font-black border-slate-200 hover:bg-slate-50 px-6"
                            onClick={(e) => { e.stopPropagation(); handleAction(n, 'reject'); }}
                          >
                            Ignore
                          </Button>
                          <Button 
                            size="sm" 
                            className="h-8 rounded-full text-xs font-black bg-blue-600 hover:bg-blue-700 text-white px-6 shadow-md shadow-blue-100"
                            onClick={(e) => { e.stopPropagation(); handleAction(n, 'accept'); }}
                          >
                            Accept
                          </Button>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 mt-2">
                         <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{n.title}</span>
                         {n.isRead && <CheckCircle2 size={12} className="text-green-500/50" />}
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 rounded-full h-8 w-8 transition-opacity">
                      <MoreHorizontal size={16} className="text-slate-400" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block lg:col-span-3 space-y-4">
          <Card className="border-none shadow-sm overflow-hidden rounded-xl bg-white text-center p-6">
            <div className="mb-4 flex justify-end">
              <MoreHorizontal size={16} className="text-slate-300" />
            </div>
            <p className="text-xs text-slate-500 mb-4 font-medium leading-relaxed">Unlock deeper insights with AIJob Premium</p>
            <div className="relative group cursor-pointer mb-6">
               <div className="aspect-video bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg shadow-xl shadow-blue-100 transition-transform group-hover:scale-[1.02] flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <TrendingUp size={48} className="text-white/20" />
               </div>
            </div>
            <Button className="w-full rounded-full border-blue-600 text-blue-600 hover:bg-blue-50 font-black text-xs h-10 transition-all active:scale-95" variant="outline">
               Try for Free
            </Button>
          </Card>

          <div className="px-6 text-center space-y-2">
             <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                <span>Help Center</span>
                <span>Privacy Policy</span>
                <span>Accessibility</span>
                <span>User Agreement</span>
             </div>
             <p className="text-[10px] font-black text-slate-300 flex items-center justify-center gap-1 uppercase tracking-widest">
                <span className="text-blue-600">AlJob</span> © 2024 AIJob.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
