type UserPayment = {
  _id?: string;
  email?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  paymentType?: string | null;
  isValid?: boolean;
}