export type CarStatus = 'active' | 'pending' | 'rejected' | 'sold';

export interface Car {
  id: string;
  showroomId?: string;
  userId?: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  city: string;
  phone?: string;
  whatsapp?: string;
  images: string[];
  description?: string;
  status: CarStatus;
  createdAt: string;
}

export interface Showroom {
  id: string;
  name: string;
  logo: string;
  description?: string;
  location: string;
  phone?: string;
  userId?: string;
  cars: Car[];
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  carId?: string;
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participant1: string;
  participant2: string;
  carId?: string;
  lastMessage: string;
  updatedAt: string;
  otherUserName: string;
  otherUserAvatar?: string;
  carTitle?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'user' | 'showroom_owner' | 'admin';
  avatar?: string;
  createdAt: string;
}
