import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription 
} from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Search, Loader2, MessageCircle } from 'lucide-react';
import type { AppDispatch, RootState } from '../../../store';
import { searchUsers, createConversation, type User, type Conversation } from '../../../api/messageApi';

interface Props {
  open: boolean;
  onClose: () => void;
  onConversationCreated: (conversation: Conversation) => void;
}

const NewChatDialog = ({ open, onClose, onConversationCreated }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { searchResults, loading } = useSelector((s: RootState) => s.messages);

  useEffect(() => {
    if (open) {
      dispatch(searchUsers(''));
    }
  }, [open, dispatch]);

  const formik = useFormik({
    initialValues: { query: '' },
    onSubmit: (values) => {
      dispatch(searchUsers(values.query));
    },
  });

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    formik.setFieldValue('query', value);
    dispatch(searchUsers(value));
  };

  const handleUserSelect = async (user: User) => {
    try {
      // Try both common parameter names to be safe
      const result = await dispatch(createConversation({ participantId: user.id })).unwrap();
      
      // Enrich the result with the user info we already have
      // This ensures the sidebar can show the user immediately
      const enrichedResult = {
        ...result,
        otherUser: user
      };
      
      onConversationCreated(enrichedResult);
      onClose();
    } catch (err) {
      console.error('Failed to create conversation:', err);
      // Fallback: If it already exists or fails, try to close and refresh
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold">New message</DialogTitle>
          <DialogDescription>Search for someone to start a conversation.</DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-4">
          <form onSubmit={formik.handleSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input
              name="query"
              placeholder="Type a name or username..."
              className="pl-10 h-11 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-blue-500"
              value={formik.values.query}
              onChange={handleQueryChange}
            />
          </form>
        </div>

        <div className="max-h-[350px] overflow-y-auto border-t border-slate-100">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="animate-spin text-blue-600" />
            </div>
          ) : searchResults.length === 0 ? (
            <div className="py-10 text-center text-slate-400 px-6">
              {formik.values.query ? "No people found." : "Search to find someone to message."}
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {searchResults.map((user) => (
                <div 
                  key={user.id}
                  className="flex items-center gap-3 p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => handleUserSelect(user)}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
                      {user.fullName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate">{user.fullName}</p>
                    <p className="text-xs text-slate-400 truncate">{user.title || 'User'}</p>
                  </div>
                  <MessageCircle size={18} className="text-blue-500 opacity-0 group-hover:opacity-100" />
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewChatDialog;
