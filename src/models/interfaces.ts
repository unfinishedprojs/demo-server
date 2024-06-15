export interface User {
  id: number;
  name: string;
  email: string;
}

export interface SuggestionResponse {
  discordId: string;
}

export interface ApiResponse {
  status: number;
  response: LoginRes | object;
}

export interface LoginRes {
  discordId: string;
  discordSlug: string;
  discordUser: string;
  discordPfpUrl: string;
  admin?: boolean;
}

export interface EventRes {
  eventId: string;
  discordId: string;
  ended?: boolean;
  createdAt: Date;
  endsAt: Date;
  duration: number;
}
