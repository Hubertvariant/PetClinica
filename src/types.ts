export interface Vaccine {
  id: string;
  name: string;
  dateAdministered: string;
  status: 'completed' | 'pending';
  batch: string;
  veterinarian: string;
  nextDoseDate?: string;
}

export interface MedicalRecord {
  id: string;
  date: string;
  diagnosis: string;
  treatment: string;
  veterinarian: string;
  notes: string;
}

export interface Pet {
  id: string;
  name: string;
  type: 'dog' | 'cat';
  breed: string;
  age: string;
  ownerName: string;
  weight: number;
  avatar: string;
  medicalHistory: MedicalRecord[];
  vaccinationHistory: Vaccine[];
}

export interface Appointment {
  id: string;
  petId: string;
  petName: string;
  petType: 'dog' | 'cat';
  date: string;
  timeSlot: string;
  status: 'scheduled' | 'cancelled' | 'completed' | 'pending_payment';
  paymentStatus: 'paid' | 'pending';
  type: 'consultation' | 'vaccination' | 'checkup' | 'emergency';
  cost: number;
  paymentMethod?: 'pix' | 'credit';
  transactionId?: string;
}

export interface Feedback {
  id: string;
  author: string;
  petName: string;
  petType: 'dog' | 'cat';
  rating: number;
  text: string;
  date: string;
  avatar?: string;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
}

export interface PetGramPost {
  id: string;
  petName: string;
  petType: 'dog' | 'cat';
  imageUrl: string;
  caption: string;
  likes: number;
  comments: Comment[];
  date: string;
  tag?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export interface FinancialStats {
  totalRevenue: number;
  paidCount: number;
  pendingCount: number;
  monthlyTarget: number;
}
