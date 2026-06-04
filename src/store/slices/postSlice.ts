import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { 
  fetchFeed, 
  createPost, 
  deletePost, 
  toggleLike, 
  addComment,
  repost,
  deleteComment,
  fetchComments
} from "../../api/postApi";

interface Comment {
  id: number;
  content: string;
  authorName: string; 
  authorId: string;
  createdAt: string;
}

interface Post {
  id: number;
  content: string;
  authorName: string;
  authorId: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  isLiked: boolean;
  imageUrl?: string;
  videoUrl?: string;
  authorAvatar?: string;
  authorTitle?: string;
  comments?: Comment[];
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

interface PostState {
  items: Post[];
  loading: boolean;
  error: string | null;
}

const initialState: PostState = {
  items: [],
  loading: false,
  error: null,
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeed.fulfilled, (state, action: PayloadAction<Post[] | ApiResponse<Post[]>>) => {
        state.loading = false;
        const payload = action.payload;
        const posts = Array.isArray(payload) ? payload : (payload as ApiResponse<Post[]>).data || [];
        state.items = posts;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch feed';
      })
      .addCase(createPost.fulfilled, (state, action: PayloadAction<Post | ApiResponse<Post>>) => {
        const payload = action.payload;
        const post = ('data' in payload) ? payload.data : payload;
        state.items.unshift(post);
      })
      .addCase(deletePost.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(toggleLike.fulfilled, (state, action: PayloadAction<number>) => {
        const post = state.items.find(item => item.id === action.payload);
        if (post) {
          post.isLiked = !post.isLiked;
          post.likesCount += post.isLiked ? 1 : -1;
        }
      })
      .addCase(repost.fulfilled, (state, action: PayloadAction<{ originalPostId: number; newPost: Post | ApiResponse<Post> }>) => {
        const { originalPostId, newPost } = action.payload;
        const originalPost = state.items.find(item => item.id === originalPostId);
        if (originalPost) {
          originalPost.repostsCount += 1;
        }
        const postToAdd = ('data' in newPost) ? newPost.data : newPost;
        state.items.unshift(postToAdd);
      })
      .addCase(fetchComments.fulfilled, (state, action: PayloadAction<{ postId: number; comments: Comment[] | ApiResponse<Comment[]> }>) => {
        const { postId, comments } = action.payload;
        const post = state.items.find(item => item.id === postId);
        if (post) {
          post.comments = Array.isArray(comments) ? comments : (comments as ApiResponse<Comment[]>).data || [];
        }
      })
      .addCase(addComment.fulfilled, (state, action: PayloadAction<{ postId: number; comment: Comment | ApiResponse<Comment> }>) => {
        const { postId, comment } = action.payload;
        const post = state.items.find(item => item.id === postId);
        if (post) {
          const newComment = ('data' in comment) ? comment.data : comment;
          if (!post.comments) post.comments = [];
          post.comments.push(newComment);
          post.commentsCount += 1;
        }
      })
      .addCase(deleteComment.fulfilled, (state, action: PayloadAction<{ postId: number; commentId: number }>) => {
        const { postId, commentId } = action.payload;
        const post = state.items.find(item => item.id === postId);
        if (post) {
          post.comments = post.comments?.filter(c => c.id !== commentId);
          post.commentsCount -= 1;
        }
      });
  },
});

export default postSlice.reducer;
