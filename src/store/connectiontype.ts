// ─── Exactly what the API returns from /User/directory ───────────────────────
export interface ApiUser {
  id: number
  fullName: string
  username: string
  email: string
  role: 'Candidate' | 'Organization'
  profilePicture?: string
}

// ─── The four states a connection button can be in ───────────────────────────
export type ConnectionStatus =
  | 'none'              // no relationship yet
  | 'pending_sent'      // current user sent a request, waiting for them
  | 'pending_received'  // they sent a request to the current user
  | 'connected'         // accepted on both sides

// ─── A directory user with their connection status attached ──────────────────
export interface DirectoryUser extends ApiUser {
  connectionStatus: ConnectionStatus
  connectionId?: number  // needed to withdraw / accept / reject
}

// ─── A pending connection request from the API ───────────────────────────────
export interface PendingRequest {
  id: number
  sender: ApiUser
  receiver: ApiUser
  status: 'pending'
  createdAt: string
}

// ─── The Redux state shape ────────────────────────────────────────────────────
export interface ConnectionsState {
  directory: DirectoryUser[]
  myConnections: DirectoryUser[]
  pendingIncoming: PendingRequest[]
  pendingSent: PendingRequest[]
  directoryLoading: boolean
  connectionsLoading: boolean
  pendingLoading: boolean
  actionLoadingIds: number[]  // user/connection IDs currently being actioned
  error: string | null
}