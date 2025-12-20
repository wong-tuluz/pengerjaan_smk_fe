// src/types/ITransaction.ts

export interface Student {
  id: string;
  nis: string;
  name: string;
  class: string;
  major: string;
  status: 'active' | 'inactive' | 'graduated';
  totalDue: number;
  totalPaid: number;
  idSppSiswa?: string;
  kodeParameter?: string;
}

export interface FeeComponent {
  id: string;
  name: string;
  defaultAmount: number;
  academicYear: string;
  classLevel: string;
  monthlyMultiplier?: number;
}

export interface SubsidiSource {
  id: string;
  name: string;
  amount: number;
}

export interface PaymentItem {
  feeId: string;
  feeName: string;
  amount: number;
  balance: number;
}

export interface TransactionForm {
  referenceNo: string;
  paymentDate: string;
  studentId: string;
  academicYear: string;
  paymentType: string;
  paymentPurpose: string;
  payments: PaymentItem[];
  subsidies: Record<string, number>;
}

export interface Transaction extends TransactionForm {
  id: string;
  createdAt: string;
  totalAmount: number;
  totalSubsidy: number;
  netAmount: number;
}

export interface StudentBalance {
  studentId: string;
  feeId: string;
  balance: number;
}

export interface PaymentPurpose {
  id: string;
  name: string;
  code: string;
}

export interface PaymentType {
  id: string;
  name: string;
}