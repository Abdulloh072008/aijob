import { createSlice,type PayloadAction } from '@reduxjs/toolkit';
import { askAi, analyzeCv, draftAiMessage, analyzeSkillGap, draftCoverLetter, type AiMessage } from '../../api/aiApi';

export type AiToolType = 'ask' | 'analyze' | 'gap' | 'cover' | 'draft';

interface AiState {
  histories: Record<AiToolType, AiMessage[]>;
  loadingStates: Record<AiToolType, boolean>;
  error: string | null;
  usage: {
    queriesUsed: number;
    queriesLimit: number;
    cvAnalysesUsed: number;
    cvAnalysesLimit: number;
  };
}

const initialState: AiState = {
  histories: {
    ask: [],
    analyze: [],
    gap: [],
    cover: [],
    draft: [],
  },
  loadingStates: {
    ask: false,
    analyze: false,
    gap: false,
    cover: false,
    draft: false,
  },
  error: null,
  usage: {
    queriesUsed: 0,
    queriesLimit: 500,
    cvAnalysesUsed: 0,
    cvAnalysesLimit: 10,
  },
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    clearChat: (state, action: PayloadAction<AiToolType>) => {
      state.histories[action.payload] = [];
    },
    addMessage: (state, action: PayloadAction<{ tool: AiToolType; message: AiMessage }>) => {
      const { tool, message } = action.payload;
      state.histories[tool].push(message);
    },
  },
  extraReducers: (builder) => {
    builder
      // Ask AI
      .addCase(askAi.pending, (state) => { state.loadingStates.ask = true; state.error = null; })
      .addCase(askAi.fulfilled, (state, action) => {
        state.loadingStates.ask = false;
        state.histories.ask.push({
          id: Date.now().toString(),
          role: 'assistant',
          content: action.payload.answer,
          timestamp: new Date().toISOString(),
        });
        if (action.payload.usage) state.usage = action.payload.usage;
      })
      .addCase(askAi.rejected, (state, action) => {
        state.loadingStates.ask = false;
        state.error = action.payload as string;
      })

      // Analyze CV
      .addCase(analyzeCv.pending, (state) => { state.loadingStates.analyze = true; })
      .addCase(analyzeCv.fulfilled, (state, action) => {
        state.loadingStates.analyze = false;
        state.histories.analyze.push({
          id: Date.now().toString(),
          role: 'assistant',
          content: action.payload.answer,
          timestamp: new Date().toISOString(),
        });
        if (action.payload.usage) state.usage = action.payload.usage;
      })
      .addCase(analyzeCv.rejected, (state) => { state.loadingStates.analyze = false; })

      // Draft Message
      .addCase(draftAiMessage.pending, (state) => { state.loadingStates.draft = true; })
      .addCase(draftAiMessage.fulfilled, (state, action) => {
        state.loadingStates.draft = false;
        state.histories.draft.push({
          id: Date.now().toString(),
          role: 'assistant',
          content: action.payload.answer,
          timestamp: new Date().toISOString(),
        });
        if (action.payload.usage) state.usage = action.payload.usage;
      })
      .addCase(draftAiMessage.rejected, (state) => { state.loadingStates.draft = false; })

      // Skill Gap
      .addCase(analyzeSkillGap.pending, (state) => { state.loadingStates.gap = true; })
      .addCase(analyzeSkillGap.fulfilled, (state, action) => {
        state.loadingStates.gap = false;
        state.histories.gap.push({
          id: Date.now().toString(),
          role: 'assistant',
          content: action.payload.answer,
          timestamp: new Date().toISOString(),
        });
        if (action.payload.usage) state.usage = action.payload.usage;
      })
      .addCase(analyzeSkillGap.rejected, (state) => { state.loadingStates.gap = false; })

      // Cover Letter
      .addCase(draftCoverLetter.pending, (state) => { state.loadingStates.cover = true; })
      .addCase(draftCoverLetter.fulfilled, (state, action) => {
        state.loadingStates.cover = false;
        state.histories.cover.push({
          id: Date.now().toString(),
          role: 'assistant',
          content: action.payload.answer,
          timestamp: new Date().toISOString(),
        });
        if (action.payload.usage) state.usage = action.payload.usage;
      })
      .addCase(draftCoverLetter.rejected, (state) => { state.loadingStates.cover = false; });
  },
});

export const { clearChat, addMessage } = aiSlice.actions;
export default aiSlice.reducer;
