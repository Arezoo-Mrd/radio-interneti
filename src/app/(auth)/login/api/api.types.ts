export type LoginRequest = {
 email: string;
 password: string;
};

export type LoginResponse = {
 access: {
  token_type: string;
  token: string;
  token_life: string;
  token_life_timestamp: number;
 };
 user: {
  id: number;
  name: string;
  email: string;
 };
};
