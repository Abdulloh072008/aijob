import { createAsyncThunk } from '@reduxjs/toolkit'
import { axiosRequest } from '../utils/token'
import type { ApiUser, DirectoryUser, PendingRequest } from '../store/connectiontype'

// ─── 1. Load everyone in the platform (User Directory tab) ───────────────────
// Route: GET /api/User/directory
export const fetchDirectory = createAsyncThunk<
  DirectoryUser[],
  void,
  { rejectValue: string }
>('connections/fetchDirectory', async (_, { rejectWithValue }) => {
  try {
    const res = await axiosRequest.get('/api/User/directory')
    const data = res.data.data ?? res.data

    if (!Array.isArray(data)) return []

    return data.map((user: ApiUser) => ({
      ...user,
      connectionStatus: 'none' as const,
    }))
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : 'Unknown error')
  }
})


// ─── 2. Load only my accepted connections (My Connections tab) ────────────────
// Route: GET /api/Connection/my
export const fetchMyConnections = createAsyncThunk<
  DirectoryUser[],
  void,
  { rejectValue: string }
>('connections/fetchMyConnections', async (_, { getState, rejectWithValue }) => {
  try {
    const res = await axiosRequest.get('/api/Connection/my')
    const data = res.data.data ?? res.data

    // We need 'me' to know which user in the connection is NOT the current user
    const state = getState() as any
    const myId = state.profile?.me?.id

    if (!Array.isArray(data)) return []

    return data.map((item) => {
      if (item.sender && item.receiver) {
        const otherUser = String(item.senderId) === String(myId) ? item.receiver : item.sender
        return {
          ...otherUser,
          connectionId: item.id,
          connectionStatus: 'connected' as const,
        }
      }

      // Fallback if it returns raw users
      return {
        ...item,
        connectionStatus: 'connected' as const,
      }
    })
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : 'Unknown error')
  }
})


// ─── 3. Load pending requests — both incoming and sent (Pending tab) ──────────
// Route: GET /Connection/pending
export const fetchPendingRequests = createAsyncThunk<
  { incoming: PendingRequest[]; sent: PendingRequest[] },
  void,
  { rejectValue: string }
>('connections/fetchPendingRequests', async (_, { rejectWithValue }) => {
  try {
    const res = await axiosRequest.get('/api/Connection/pending')
    const data = res.data.data ?? res.data

    return {
      incoming: Array.isArray(data.incoming) ? data.incoming : [],
      sent: Array.isArray(data.sent) ? data.sent : [],
    }
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : 'Unknown error')
  }
})

// ─── 4. Send a connection request to another user ────────────────────────────
// Route: POST /Connection/send/{addresseeId}
export const sendConnectionRequest = createAsyncThunk<
  { connectionId: number; receiverId: number },
  { receiverId: number },
  { rejectValue: string }
>('connections/sendConnectionRequest', async ({ receiverId }, { rejectWithValue }) => {
  try {
    // addresseeId goes in the URL, not the body
    const { data } = await axiosRequest.post<{ id: number }>(
      `/api/Connection/send/${receiverId}`
    )
    return { connectionId: data.id, receiverId }
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : 'Unknown error')
  }
})

// ─── 5. Accept or reject an incoming request ─────────────────────────────────
// Route: PUT /Connection/{id}/respond   body: { accept: true/false }
export const respondToConnection = createAsyncThunk<
  { connectionId: number; action: 'accept' | 'reject' },
  { connectionId: number; action: 'accept' | 'reject' },
  { rejectValue: string }
>('connections/respondToConnection', async ({ connectionId, action }, { rejectWithValue }) => {
  try {
    await axiosRequest.put(`/api/Connection/${connectionId}/respond`, {
      accept: action === 'accept',  // backend expects { accept: true } or { accept: false }
    })
    return { connectionId, action }
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : 'Unknown error')
  }
})

// ─── 6. Cancel a sent request before the other person accepts ────────────────
// Route: DELETE /Connection/{id}
export const withdrawConnectionRequest = createAsyncThunk<
  { connectionId: number },
  { connectionId: number },
  { rejectValue: string }
>('connections/withdrawConnectionRequest', async ({ connectionId }, { rejectWithValue }) => {
  try {
    await axiosRequest.delete(`/api/Connection/${connectionId}`)
    return { connectionId }
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : 'Unknown error')
  }
})