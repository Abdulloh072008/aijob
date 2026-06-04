import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { 
  toggleLike, 
  repost, 
  deletePost,
  addComment,
  fetchComments,
  deleteComment
} from '../../api/postApi';
import type { AppDispatch } from '../../store';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { 
  ThumbsUp, 
  MessageSquare, 
  Repeat2, 
  Send, 
  MoreHorizontal, 
  Trash2,
  Edit2,
  Globe,
  MoreVertical
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../../components/ui/dropdown-menu';
import { Separator } from '../../components/ui/separator';

interface PostCardProps {
  post;
  currentUserId: string | undefined;
  currentUserInitial: string | undefined;
}

const PostCard = ({ post, currentUserId, currentUserInitial }: PostCardProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleLike = () => dispatch(toggleLike(post.id));
  const handleRepost = () => dispatch(repost(post.id));
  const handleDelete = () => dispatch(deletePost(post.id));
  
  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      dispatch(addComment({ postId: post.id, content: commentText }));
      setCommentText('');
    }
  };

  useEffect(() => {
    if (showComments && (!post.comments || post.comments.length === 0)) {
      dispatch(fetchComments(post.id));
    }
  }, [showComments, post.id, dispatch, post.comments]);

  const isMyPost = String(post.authorId) === String(currentUserId);

  // Safely get counts to avoid NaN
  const likesCount = Number(post.likesCount) || 0;
  const commentsCount = Number(post.commentsCount) || 0;
  const repostsCount = Number(post.repostsCount) || 0;

  return (
    <Card className="border shadow-sm overflow-hidden bg-card text-foreground transition-colors duration-300">
      <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
        <div className="flex gap-2">
          <Avatar className="h-12 w-12">
            <AvatarImage src={post.authorAvatar} />
            <AvatarFallback>{post.authorName?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="text-sm font-bold hover:text-blue-600 hover:underline cursor-pointer">{post.authorName}</h4>
            <p className="text-[10px] text-muted-foreground">{post.authorTitle || '1,420,380 followers'}</p>
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">2h • <Globe size={10} /></p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><MoreHorizontal size={16} /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isMyPost && (
              <>
                <DropdownMenuItem className="gap-2 cursor-pointer"><Edit2 size={14} /> Edit post</DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive" onClick={handleDelete}>
                   <Trash2 size={14} /> Delete post
                </DropdownMenuItem>
              </>
            )}
            {!isMyPost && (
              <DropdownMenuItem className="gap-2 cursor-pointer text-xs">Save for later</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <CardContent className="p-4 pt-2 space-y-4 text-sm">
        <p className="whitespace-pre-wrap">{post.content}</p>
        
        {post.imageUrl && (
          <div className="-mx-4 bg-muted flex justify-center">
             <img src={post.imageUrl} alt="Post content" className="max-w-full h-auto max-h-[500px] object-contain" />
          </div>
        )}

        {post.videoUrl && (
          <div className="-mx-4 bg-black">
             <video src={post.videoUrl} controls className="w-full h-auto max-h-[500px]" />
          </div>
        )}
        
        <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-2">
          <div className="flex items-center gap-1 cursor-pointer hover:text-blue-600 hover:underline">
             <div className="bg-blue-600 text-white rounded-full p-0.5 flex items-center justify-center h-3.5 w-3.5">
                <ThumbsUp size={8} fill="currentColor" />
             </div>
             <span>{likesCount}</span>
          </div>
          <div className="flex gap-2">
             <span className="hover:text-blue-600 hover:underline cursor-pointer" onClick={() => setShowComments(!showComments)}>
                {commentsCount} comments
             </span>
             <span className="hover:text-blue-600 hover:underline cursor-pointer">
                {repostsCount} reposts
             </span>
          </div>
        </div>
      </CardContent>

      <Separator className="mx-4 w-auto" />

      <div className="px-2 py-1 flex justify-between">
        <Button variant="ghost" size="sm" onClick={handleLike} className={`flex-1 gap-2 rounded-md ${post.isLiked ? 'text-blue-600' : 'text-muted-foreground'}`}>
           <ThumbsUp size={18} fill={post.isLiked ? 'currentColor' : 'none'} />
           <span className="text-xs font-semibold">Like</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)} className={`flex-1 gap-2 rounded-md ${showComments ? 'text-blue-600' : 'text-muted-foreground'}`}>
           <MessageSquare size={18} />
           <span className="text-xs font-semibold">Comment</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={handleRepost} className="flex-1 gap-2 text-muted-foreground rounded-md">
           <Repeat2 size={18} />
           <span className="text-xs font-semibold">Repost</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex-1 gap-2 text-muted-foreground rounded-md">
           <Send size={18} />
           <span className="text-xs font-semibold">Send</span>
        </Button>
      </div>

      {showComments && (
        <div className="p-4 pt-0 space-y-4">
           <Separator className="mb-4" />
           <form onSubmit={handleComment} className="flex gap-2">
              <Avatar className="h-8 w-8">
                 <AvatarFallback>{currentUserInitial || 'U'}</AvatarFallback>
              </Avatar>
              <Input 
                 placeholder="Add a comment..." 
                 className="rounded-full text-xs h-9 bg-muted border-none focus-visible:ring-1 focus-visible:ring-blue-600" 
                 value={commentText}
                 onChange={(e) => setCommentText(e.target.value)}
              />
           </form>

           <div className="space-y-4 mt-4">
              {post.comments?.map((comment) => (
                <div key={comment.id} className="flex gap-2 group">
                   <Avatar className="h-8 w-8">
                      <AvatarFallback>{comment.authorName?.charAt(0) || 'U'}</AvatarFallback>
                   </Avatar>
                   <div className="flex-1">
                      <div className="bg-muted p-3 rounded-lg rounded-tl-none relative">
                         <div className="flex justify-between items-start">
                            <div>
                               <h5 className="text-xs font-bold">{comment.authorName}</h5>
                               <p className="text-[10px] text-muted-foreground">Professional</p>
                            </div>
                            {String(comment.authorId) === String(currentUserId) && (
                              <DropdownMenu>
                                 <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2"><MoreVertical size={14} /></Button>
                                 </DropdownMenuTrigger>
                                 <DropdownMenuContent align="end">
                                    <DropdownMenuItem 
                                       className="text-destructive focus:text-destructive cursor-pointer"
                                       onClick={() => dispatch(deleteComment({ postId: post.id, commentId: comment.id }))}
                                    >
                                       <Trash2 size={14} className="mr-2" /> Delete
                                    </DropdownMenuItem>
                                 </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                         </div>
                         <p className="text-xs mt-2">{comment.content}</p>
                      </div>
                      <div className="flex gap-3 text-[10px] font-bold text-muted-foreground mt-1 ml-2">
                         <button className="hover:text-foreground">Like</button>
                         <span>|</span>
                         <button className="hover:text-foreground">Reply</button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}
    </Card>
  );
};

export default PostCard;
