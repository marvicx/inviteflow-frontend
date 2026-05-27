export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  bio?: string | null;
  createdAt?: string;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  thumbnailUrl: string;
  previewUrl?: string | null;
  isPremium: boolean;
  tags: string[];
  colorPalette?: Record<string, string> | null;
  fontPair?: { heading: string; body: string } | null;
  htmlStructure: Record<string, unknown>;
  sortOrder: number;
}

export type InvitationStatus = "DRAFT" | "PUBLISHED" | "CLOSED";
export type RsvpStatus = "PENDING" | "YES" | "NO" | "MAYBE";
export type QuestionType = "TEXT" | "MULTIPLE_CHOICE" | "CHECKBOX";

export interface Invitation {
  id: string;
  userId: string;
  templateId?: string | null;
  slug: string;
  title: string;
  description?: string | null;
  eventDate?: string | null;
  eventTime?: string | null;
  location?: string | null;
  locationUrl?: string | null;
  coverImageUrl?: string | null;
  carouselImages?: string[];
  gallery?: string[];
  customColors?: Record<string, string> | null;
  customFonts?: Record<string, string> | null;
  status: InvitationStatus;
  rsvpDeadline?: string | null;
  maxGuests?: number | null;
  allowPlusOnes: boolean;
  showGuestCount: boolean;
  thankYouMsg?: string | null;
  createdAt: string;
  updatedAt: string;
  template?: Template | null;
  guests?: Guest[];
  questions?: SurveyQuestion[];
  faqs?: InvitationFaq[];
  _count?: { guests: number };
}

export interface InvitationFaq {
  id: string;
  invitationId: string;
  question: string;
  answer: string;
  sortOrder: number;
  createdAt: string;
}

export interface Guest {
  id: string;
  invitationId: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  rsvpStatus: RsvpStatus;
  message?: string | null;
  plusOnes: number;
  respondedAt?: string | null;
  createdAt: string;
  responses?: SurveyResponse[];
}

export interface SurveyQuestion {
  id: string;
  invitationId: string;
  question: string;
  type: QuestionType;
  options?: string[] | null;
  required: boolean;
  sortOrder: number;
}

export interface SurveyResponse {
  id: string;
  guestId: string;
  questionId: string;
  answer: unknown;
  question?: SurveyQuestion;
}

export interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  cta: string;
}
