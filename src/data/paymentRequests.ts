export interface PaymentRequest {
  id: number;
  name: string;
  email: string;
  phone: string;
  amount: number;
  paymentDate: string;
  imageUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

// Mock data for payment requests - this will be replaced with actual data from the upload page
export const mockPaymentRequests: PaymentRequest[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "08012345678",
    amount: 50000,
    paymentDate: "2026-04-30",
    imageUrl: "/placeholder-payment-1.jpg", // This will be replaced with actual uploaded image URLs
    status: "pending",
    submittedAt: "2026-04-30 10:30:00"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "08123456789",
    amount: 25000,
    paymentDate: "2026-04-29",
    imageUrl: "/placeholder-payment-2.jpg",
    status: "pending",
    submittedAt: "2026-04-29 15:45:00"
  }
];
