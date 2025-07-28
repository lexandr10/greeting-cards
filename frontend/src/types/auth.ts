export interface UserType {
  id: number;
  email: string;
  fullName?: string;
  role: string;
  dateOfBirth?: string
}

export interface SignUpResponse {
	accessToken: string
	user: UserType
}

export interface AccessTokenResponse {
	accessToken: string
}

export interface SignUpInput {
  email: string;
  password: string;
  fullName?: string; 
  dateOfBirth?: string; 
}
