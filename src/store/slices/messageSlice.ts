  import { createSlice } from '@reduxjs/toolkit';
  import { 
    fetchConversations, 
    createConversation,
    fetchChatHistory, 
    sendMessage, 
    searchUsers,
    type Conversation,
    type Message,
    type User
  } from '../../api/messageApi';

  interface MessageState {
    conversations: Conversation[];
    activeChat: Message[];
    searchResults: User[];
    loading: boolean;
    activeChatLoading: boolean;
    error: string | null;
  }

  const initialState: MessageState = {
    conversations: [],
    activeChat: [],
    searchResults: [],
    loading: false,
    activeChatLoading: false,
    error: null,
  };

  const messageSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
      clearActiveChat: (state) => {
        state.activeChat = [];
      },
      addMessageToChat: (state, action) => {
        state.activeChat.push(action.payload);
      }
    },
    extraReducers: (builder) => {
      builder
        // Conversations
        .addCase(fetchConversations.pending, (state) => { state.loading = true; })
        .addCase(fetchConversations.fulfilled, (state, action) => {
          state.loading = false;
          const emptyConvs = state.conversations.filter(c => !c.lastMessage);
          const fetchedIds = new Set(action.payload.map(c => c.id));
          const missingEmptyConvs = emptyConvs.filter(c => !fetchedIds.has(c.id));
          state.conversations = [...action.payload, ...missingEmptyConvs];
        })
        .addCase(fetchConversations.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || 'Failed to fetch conversations';
        })

        // Create Conversation
        .addCase(createConversation.fulfilled, (state, action) => {
          const existing = state.conversations.find(c => c.id === action.payload.id);
          if (!existing) {
            state.conversations.unshift(action.payload);
          }
        })

        // History
        .addCase(fetchChatHistory.pending, (state) => { state.activeChatLoading = true; })
        .addCase(fetchChatHistory.fulfilled, (state, action) => {
          state.activeChatLoading = false;
          state.activeChat = action.payload;
        })

        // Send
        .addCase(sendMessage.fulfilled, (state, action) => {
          state.activeChat.push(action.payload);
          // Update last message in conversations
          const conv = state.conversations.find(c => c.id === action.payload.conversationId);
          if (conv) {
            conv.lastMessage = action.payload;
            // Move to top
            state.conversations = [conv, ...state.conversations.filter(c => c.id !== conv.id)];
          }
        })

        // Search
        .addCase(searchUsers.fulfilled, (state, action) => {
          state.searchResults = action.payload;
        });
    },
  });

  export const { clearActiveChat, addMessageToChat } = messageSlice.actions;
  export default messageSlice.reducer;
