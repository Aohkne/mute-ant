export interface UserAddress {
  street: string;
  city: string;
  country: string;
}

export interface User {
  _id?: string;
  username: string;
  email: string;
  password: string;
  full_name: string;
  age: number;
  created_at: string;
  is_active: boolean;
  roles: string[];
  address: UserAddress;
}