type User = {
  _id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string[];
  createdAt?: string;
  updatedAt?: string;
  lastPayment?: UserPayment;
  isValid?: boolean;
}