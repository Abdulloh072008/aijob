import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../store/Hooks'
import {
  fetchDirectory,
  fetchMyConnections,
  fetchPendingRequests,
  sendConnectionRequest,
  respondToConnection,
  withdrawConnectionRequest,
} from '../../../api/connectionApi'
import { fetchJobs } from '../../../api/jobApi'
import type { DirectoryUser, PendingRequest } from '../../../store/connectiontype'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '../../../components/ui/avatar'
import { Badge } from '../../../components/ui/badge'
import { Card, CardContent } from '../../../components/ui/card'
import { Skeleton } from '../../../components/ui/skeleton'
import { Alert, AlertDescription } from '../../../components/ui/alert'
import { Search, UserPlus, MessageCircle, Clock, Users, Briefcase } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function getInitials(fullName?: string) {
  if (!fullName) return '?'
  return fullName
    .split(' ')
    .filter(Boolean)
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function UserAvatar({ fullName, profilePicture }: { fullName?: string; profilePicture?: string }) {
  return (
    <Avatar className="h-12 w-12 shrink-0">
      {profilePicture && <AvatarImage src={profilePicture} alt={fullName} />}
      <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-sm">
        {getInitials(fullName)}
      </AvatarFallback>
    </Avatar>
  )
}

function ConnectionButton({
  user,
  actionLoadingIds,
  onConnect,
  onWithdraw,
}: {
  user: DirectoryUser
  actionLoadingIds: number[]
  onConnect: (id: number) => void
  onWithdraw: (connectionId: number) => void
}) {
  const navigate = useNavigate()
  const isLoading =
    actionLoadingIds.includes(user.id) ||
    (user.connectionId != null ? actionLoadingIds.includes(user.connectionId) : false)

  if (user.connectionStatus === 'connected') {
    return (
      <Button 
        size="sm" 
        variant="outline" 
        className="w-full gap-1 border-blue-600 text-blue-600 hover:bg-blue-50"
        onClick={() => navigate('/messages')}
      >
        <MessageCircle className="h-3.5 w-3.5" />
        Message
      </Button>
    )
  }

  if (user.connectionStatus === 'pending_sent') {
    return (
      <Button
        size="sm"
        variant="secondary"
        className="w-full gap-1"
        disabled={isLoading}
        onClick={() => user.connectionId != null && onWithdraw(user.connectionId)}
      >
        <Clock className="h-3.5 w-3.5" />
        {isLoading ? 'Withdrawing...' : 'Pending'}
      </Button>
    )
  }

  if (user.connectionStatus === 'pending_received') {
    return (
      <Button size="sm" variant="outline" className="w-full" disabled>
        Wants to connect
      </Button>
    )
  }

  return (
    <Button
      size="sm"
      className="w-full gap-1"
      disabled={isLoading}
      onClick={() => onConnect(user.id)}
    >
      <UserPlus className="h-3.5 w-3.5" />
      {isLoading ? 'Sending...' : 'Connect'}
    </Button>
  )
}

function PersonCard({
  user,
  actionLoadingIds,
  onConnect,
  onWithdraw,
}: {
  user: DirectoryUser
  actionLoadingIds: number[]
  onConnect: (id: number) => void
  onWithdraw: (connectionId: number) => void
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex flex-col items-center text-center gap-3">
        <UserAvatar fullName={user.fullName} profilePicture={user.profilePicture} />

        <div className="w-full">
          <p className="font-semibold text-sm text-foreground">{user.fullName}</p>
          <p className="text-xs text-gray-500">@{user.username}</p>
          <p className="text-xs text-gray-400 mt-0.5">{user.role}</p>
        </div>

        <ConnectionButton
          user={user}
          actionLoadingIds={actionLoadingIds}
          onConnect={onConnect}
          onWithdraw={onWithdraw}
        />
      </CardContent>
    </Card>
  )
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4 flex flex-col items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function PersonGrid({
  users,
  actionLoadingIds,
  onConnect,
  onWithdraw,
  emptyMessage,
}: {
  users: DirectoryUser[]
  actionLoadingIds: number[]
  onConnect: (id: number) => void
  onWithdraw: (connectionId: number) => void
  emptyMessage: string
}) {
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
        <Users className="h-8 w-8" />
        <p className="text-sm">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {users.map(user => (
        <PersonCard
          key={user.id}
          user={user}
          actionLoadingIds={actionLoadingIds}
          onConnect={onConnect}
          onWithdraw={onWithdraw}
        />
      ))}
    </div>
  )
}

function PendingRow({
  request,
  type,
  actionLoadingIds,
  onAccept,
  onIgnore,
  onWithdraw,
}: {
  request: PendingRequest
  type: 'incoming' | 'sent'
  actionLoadingIds: number[]
  onAccept: (id: number) => void
  onIgnore: (id: number) => void
  onWithdraw: (id: number) => void
}) {
  const isLoading = actionLoadingIds.includes(request.id)
  const person = type === 'incoming' ? request.sender : request.receiver

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
      <UserAvatar fullName={person.fullName} profilePicture={person.profilePicture} />

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-foreground">{person.fullName}</p>
        <p className="text-xs text-gray-500">@{person.username} · {person.role}</p>
      </div>

      {type === 'incoming' ? (
        <div className="flex gap-2 shrink-0">
          <Button size="sm" variant="outline" disabled={isLoading} onClick={() => onIgnore(request.id)}>
            Ignore
          </Button>
          <Button size="sm" disabled={isLoading} onClick={() => onAccept(request.id)}>
            {isLoading ? 'Accepting...' : 'Accept'}
          </Button>
        </div>
      ) : (
        <Button size="sm" variant="outline" disabled={isLoading} onClick={() => onWithdraw(request.id)}>
          {isLoading ? 'Withdrawing...' : 'Withdraw'}
        </Button>
      )}
    </div>
  )
}

function PendingTab({
  incoming,
  sent,
  actionLoadingIds,
  onAccept,
  onIgnore,
  onWithdraw,
}: {
  incoming: PendingRequest[]
  sent: PendingRequest[]
  actionLoadingIds: number[]
  onAccept: (id: number) => void
  onIgnore: (id: number) => void
  onWithdraw: (id: number) => void
}) {
  if (incoming.length === 0 && sent.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
        <Clock className="h-8 w-8" />
        <p className="text-sm">No pending requests</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {incoming.length > 0 && (
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Incoming</p>
          {incoming.map(req => (
            <PendingRow key={req.id} request={req} type="incoming"
              actionLoadingIds={actionLoadingIds}
              onAccept={onAccept} onIgnore={onIgnore} onWithdraw={onWithdraw} />
          ))}
        </div>
      )}
      {sent.length > 0 && (
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Sent</p>
          {sent.map(req => (
            <PendingRow key={req.id} request={req} type="sent"
              actionLoadingIds={actionLoadingIds}
              onAccept={onAccept} onIgnore={onIgnore} onWithdraw={onWithdraw} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function NetworkPage() {
  const dispatch = useAppDispatch()
  const {
    directory = [],
    myConnections = [],
    pendingIncoming = [],
    pendingSent = [],
    directoryLoading,
    connectionsLoading,
    pendingLoading,
    actionLoadingIds = [],
    error,
  } = useAppSelector(state => state.connections)

  const [search, setSearch] = useState('')

  const { jobs = [], loading: jobsLoading } = useAppSelector(state => state.jobs)

  useEffect(() => {
    dispatch(fetchDirectory())
    dispatch(fetchMyConnections())
    dispatch(fetchPendingRequests())
    dispatch(fetchJobs())
  }, [dispatch])

  const handleConnect  = (userId: number)       => dispatch(sendConnectionRequest({ receiverId: userId }))
  const handleWithdraw = (connectionId: number)  => dispatch(withdrawConnectionRequest({ connectionId }))
  const handleAccept   = (connectionId: number)  => dispatch(respondToConnection({ connectionId, action: 'accept' }))
  const handleIgnore   = (connectionId: number)  => dispatch(respondToConnection({ connectionId, action: 'reject' }))

  const filterBySearch = (users: DirectoryUser[]) => {
    if (!users) return []
    if (!search.trim()) return users
    const q = search.toLowerCase()
    return users.filter(u =>
      u.fullName?.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    )
  }

  const filterRequestsBySearch = (requests: PendingRequest[], type: 'incoming' | 'sent') => {
    if (!requests) return []
    if (!search.trim()) return requests
    const q = search.toLowerCase()
    return requests.filter(req => {
      const person = type === 'incoming' ? req.sender : req.receiver
      if (!person) return false
      return (
        person.fullName?.toLowerCase().includes(q) ||
        person.username?.toLowerCase().includes(q) ||
        person.role?.toLowerCase().includes(q)
      )
    })
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-foreground">My Network</h1>
          <p className="text-sm text-gray-500 mt-1">Grow and manage your professional connections</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="directory">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <TabsList>
              <TabsTrigger value="directory">User Directory</TabsTrigger>
              <TabsTrigger value="myConnections">My Connections</TabsTrigger>
              <TabsTrigger value="pending" className="gap-1.5">
                Pending
                {(pendingIncoming?.length ?? 0) > 0 && (
                  <Badge className="h-5 px-1.5 text-xs">{pendingIncoming.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="jobs" className="gap-1.5">
                <Briefcase className="h-3.5 w-3.5" />
                Jobs
              </TabsTrigger>
            </TabsList>

            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input className="pl-9" placeholder="Search by name, username or role..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          <TabsContent value="directory" className="mt-6">
            {directoryLoading ? <GridSkeleton /> : (
              <PersonGrid users={filterBySearch(directory)} actionLoadingIds={actionLoadingIds}
                onConnect={handleConnect} onWithdraw={handleWithdraw} emptyMessage="No users found" />
            )}
          </TabsContent>

          <TabsContent value="myConnections" className="mt-6">
            {connectionsLoading ? <GridSkeleton /> : (
              <PersonGrid users={filterBySearch(myConnections)} actionLoadingIds={actionLoadingIds}
                onConnect={handleConnect} onWithdraw={handleWithdraw} emptyMessage="No connections yet" />
            )}
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            {pendingLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 py-3">
                    <Skeleton className="h-11 w-11 rounded-full" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
              </div>
            ) : (
              <PendingTab 
                incoming={filterRequestsBySearch(pendingIncoming, 'incoming')} 
                sent={filterRequestsBySearch(pendingSent, 'sent')}
                actionLoadingIds={actionLoadingIds}
                onAccept={handleAccept} onIgnore={handleIgnore} onWithdraw={handleWithdraw} />
            )}
          </TabsContent>
          <TabsContent value="jobs" className="mt-6">
            {jobsLoading ? <GridSkeleton /> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobs.length === 0 ? (
                   <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
                    <Briefcase className="h-8 w-8" />
                    <p className="text-sm">No jobs available right now</p>
                  </div>
                ) : jobs.map(job => (
                  <Card key={job.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/job')}>
                    <CardContent className="p-4 flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                          <Briefcase className="h-6 w-6" />
                        </div>
                        <Badge variant="secondary" className="text-[10px]">
                          {job.salary || 'Competitive'}
                        </Badge>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-foreground truncate">{job.title}</h4>
                        <p className="text-xs text-gray-500 truncate">{job.companyName || 'Unknown Company'}</p>
                        <p className="text-xs text-gray-400 mt-1">{job.location}</p>
                      </div>
                      <Button size="sm" className="w-full mt-2">View Details</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}