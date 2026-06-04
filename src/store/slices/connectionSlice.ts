import { createSlice } from '@reduxjs/toolkit'
import type { ConnectionsState } from '../../store/connectiontype'
import {
  fetchDirectory,
  fetchMyConnections,
  fetchPendingRequests,
  sendConnectionRequest,
  respondToConnection,
  withdrawConnectionRequest,
} from '../../api/connectionApi'

const initialState: ConnectionsState = {
  directory: [],
  myConnections: [],
  pendingIncoming: [],
  pendingSent: [],
  directoryLoading: false,
  connectionsLoading: false,
  pendingLoading: false,
  actionLoadingIds: [],
  error: null,
}

const connectionsSlice = createSlice({
  name: 'connections',
  initialState,
  reducers: {}, // no manual reducers needed — thunks handle everything
  extraReducers: (builder) => {

    // ── 1. fetchDirectory ───────────────────────────────────────────────────
    builder
      .addCase(fetchDirectory.pending, (state) => {
        state.directoryLoading = true
        state.error = null
      })
      .addCase(fetchDirectory.fulfilled, (state, action) => {
        state.directoryLoading = false
        state.directory = action.payload

        // Reconcile with already loaded connections/pending
        state.myConnections.forEach(conn => {
          const user = state.directory.find(u => u.id === conn.id)
          if (user) user.connectionStatus = 'connected'
        })
        state.pendingIncoming.forEach(req => {
          const user = state.directory.find(u => u.id === req.sender.id)
          if (user) {
            user.connectionStatus = 'pending_received'
            user.connectionId = req.id
          }
        })
        state.pendingSent.forEach(req => {
          const user = state.directory.find(u => u.id === req.receiver.id)
          if (user) {
            user.connectionStatus = 'pending_sent'
            user.connectionId = req.id
          }
        })
      })
      .addCase(fetchDirectory.rejected, (state, action) => {
        state.directoryLoading = false
        state.error = action.payload ?? 'Failed to load directory'
      })

    // ── 2. fetchMyConnections ───────────────────────────────────────────────
    builder
      .addCase(fetchMyConnections.pending, (state) => {
        state.connectionsLoading = true
        state.error = null
      })
      .addCase(fetchMyConnections.fulfilled, (state, action) => {
        state.connectionsLoading = false
        state.myConnections = action.payload

        // Reconcile directory statuses: Mark these as 'connected'
        action.payload.forEach(conn => {
          const user = state.directory.find(u => u.id === conn.id)
          if (user) user.connectionStatus = 'connected'
        })
      })
      .addCase(fetchMyConnections.rejected, (state, action) => {
        state.connectionsLoading = false
        state.error = action.payload ?? 'Failed to load connections'
      })

    // ── 3. fetchPendingRequests ─────────────────────────────────────────────
    builder
      .addCase(fetchPendingRequests.pending, (state) => {
        state.pendingLoading = true
        state.error = null
      })
      .addCase(fetchPendingRequests.fulfilled, (state, action) => {
        state.pendingLoading = false
        state.pendingIncoming = action.payload.incoming
        state.pendingSent = action.payload.sent

        // Reconcile directory statuses:
        // Mark incoming requests
        action.payload.incoming.forEach(req => {
          const user = state.directory.find(u => u.id === req.sender.id)
          if (user) {
            user.connectionStatus = 'pending_received'
            user.connectionId = req.id
          }
        })
        // Mark sent requests
        action.payload.sent.forEach(req => {
          const user = state.directory.find(u => u.id === req.receiver.id)
          if (user) {
            user.connectionStatus = 'pending_sent'
            user.connectionId = req.id
          }
        })
      })
      .addCase(fetchPendingRequests.rejected, (state, action) => {
        state.pendingLoading = false
        state.error = action.payload ?? 'Failed to load pending requests'
      })

    // ── 4. sendConnectionRequest ────────────────────────────────────────────
    builder
      .addCase(sendConnectionRequest.pending, (state, action) => {
        // Mark this user as "loading" so the button shows a spinner
        state.actionLoadingIds.push(action.meta.arg.receiverId)
      })
      .addCase(sendConnectionRequest.fulfilled, (state, action) => {
        const { receiverId, connectionId } = action.payload
        state.actionLoadingIds = state.actionLoadingIds.filter(id => id !== receiverId)

        // Update the user in the directory so the button changes to "Pending"
        const user = state.directory.find(u => u.id === receiverId)
        if (user) {
          user.connectionStatus = 'pending_sent'
          user.connectionId = connectionId
        }
      })
      .addCase(sendConnectionRequest.rejected, (state, action) => {
        state.actionLoadingIds = state.actionLoadingIds.filter(
          id => id !== action.meta.arg.receiverId
        )
        state.error = action.payload ?? 'Failed to send request'
      })

    // ── 5. respondToConnection (accept or reject) ───────────────────────────
    builder
      .addCase(respondToConnection.pending, (state, action) => {
        state.actionLoadingIds.push(action.meta.arg.connectionId)
      })
      .addCase(respondToConnection.fulfilled, (state, action) => {
        const { connectionId, action: response } = action.payload
        state.actionLoadingIds = state.actionLoadingIds.filter(id => id !== connectionId)

        // Find who sent the request before removing it
        const request = state.pendingIncoming.find(r => r.id === connectionId)

        // Remove from incoming list either way (accepted or rejected)
        state.pendingIncoming = state.pendingIncoming.filter(r => r.id !== connectionId)

        // If accepted → update their status in the directory to "connected"
        if (response === 'accept' && request) {
          const user = state.directory.find(u => u.id === request.sender.id)
          if (user) user.connectionStatus = 'connected'
        }
      })
      .addCase(respondToConnection.rejected, (state, action) => {
        state.actionLoadingIds = state.actionLoadingIds.filter(
          id => id !== action.meta.arg.connectionId
        )
        state.error = action.payload ?? 'Failed to respond to request'
      })

    // ── 6. withdrawConnectionRequest ────────────────────────────────────────
    builder
      .addCase(withdrawConnectionRequest.pending, (state, action) => {
        state.actionLoadingIds.push(action.meta.arg.connectionId)
      })
      .addCase(withdrawConnectionRequest.fulfilled, (state, action) => {
        const { connectionId } = action.payload
        state.actionLoadingIds = state.actionLoadingIds.filter(id => id !== connectionId)

        // Remove from the sent list
        state.pendingSent = state.pendingSent.filter(r => r.id !== connectionId)

        // Reset the directory user back to "none" so Connect button reappears
        const user = state.directory.find(u => u.connectionId === connectionId)
        if (user) {
          user.connectionStatus = 'none'
          user.connectionId = undefined
        }
      })
      .addCase(withdrawConnectionRequest.rejected, (state, action) => {
        state.actionLoadingIds = state.actionLoadingIds.filter(
          id => id !== action.meta.arg.connectionId
        )
        state.error = action.payload ?? 'Failed to withdraw request'
      })
  },
})

export default connectionsSlice.reducer