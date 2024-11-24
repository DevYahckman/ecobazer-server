export interface IUser {
  image: string;
  fullname: string;
  phone: number;
  username: string;
  email: string;
  address: string;
  password: string;
  isAdmin: boolean;
  generateAuthToken: () => string;
  createdAt:Date
}
