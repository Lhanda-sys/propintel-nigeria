import type { Conversation } from '../types'

export const conversations: Conversation[] = [
  {
    id: 'c1',
    participantName: 'Adeyemi Land Ventures',
    participantType: 'Seller',
    propertyTitle: '5-Acre Commercial Land — Lekki Phase 2',
    lastMessage: 'Yes, the land is still available and the Deed of Assignment is in progress.',
    updatedAt: '2026-09-02T16:40:00',
    unread: 2,
    online: true,
    messages: [
      { id: 'm1', senderId: 'me', content: 'Good afternoon, is the 5-acre land in Lekki Phase 2 still available?', createdAt: '2026-09-02T15:10:00', read: true },
      { id: 'm2', senderId: 'them', content: 'Good afternoon! Yes, it is still available.', createdAt: '2026-09-02T15:22:00', read: true },
      { id: 'm3', senderId: 'me', content: 'Great. I noticed the Deed of Assignment shows pending — what stage is that at?', createdAt: '2026-09-02T15:40:00', read: true },
      { id: 'm4', senderId: 'them', content: 'It was submitted to the Ministry on the 20th of August, we are expecting it within the next two weeks.', createdAt: '2026-09-02T16:05:00', read: true },
      { id: 'm5', senderId: 'them', content: 'Yes, the land is still available and the Deed of Assignment is in progress.', createdAt: '2026-09-02T16:40:00', read: false },
    ],
  },
  {
    id: 'c2',
    participantName: 'Emeka Igwe',
    participantType: 'Professional',
    lastMessage: 'I can carry out the boundary survey next Tuesday if that works for you.',
    updatedAt: '2026-09-02T11:05:00',
    unread: 0,
    online: false,
    messages: [
      { id: 'm1', senderId: 'me', content: 'Hi Mr Igwe, I need a boundary survey for a plot in Ojoo, Ibadan.', createdAt: '2026-09-01T09:00:00', read: true },
      { id: 'm2', senderId: 'them', content: 'No problem, please share the survey plan number and I\u2019ll check the coordinate history.', createdAt: '2026-09-01T09:40:00', read: true },
      { id: 'm3', senderId: 'them', content: 'I can carry out the boundary survey next Tuesday if that works for you.', createdAt: '2026-09-02T11:05:00', read: true },
    ],
  },
  {
    id: 'c3',
    participantName: 'Chidinma Okafor',
    participantType: 'Seller',
    propertyTitle: '4 Bedroom Detached Duplex — Lekki Phase 1',
    lastMessage: 'You are welcome to schedule an inspection this weekend.',
    updatedAt: '2026-08-30T18:22:00',
    unread: 0,
    online: true,
    messages: [
      { id: 'm1', senderId: 'me', content: 'Hello, I\u2019m interested in the duplex on Chevron Drive. Is an inspection possible this week?', createdAt: '2026-08-30T17:50:00', read: true },
      { id: 'm2', senderId: 'them', content: 'Hello! Yes, of course.', createdAt: '2026-08-30T18:02:00', read: true },
      { id: 'm3', senderId: 'them', content: 'You are welcome to schedule an inspection this weekend.', createdAt: '2026-08-30T18:22:00', read: true },
    ],
  },
]

export const getConversationById = (id: string) => conversations.find((c) => c.id === id)
