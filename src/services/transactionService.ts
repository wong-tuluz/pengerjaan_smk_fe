// src/services/transactionService.ts

import type { 
  Student, 
  FeeComponent, 
  SubsidiSource, 
  Transaction, 
  TransactionForm,
  StudentBalance 
} from '@/types/ITransaction';
import { 
  students, 
  feeComponents, 
  subsidiSources, 
  academicYears,
  paymentTypes,
  paymentPurposes 
} from '@/services/data';
import { useTransaction } from '@/composables/useTransaction';

const { generateId, calculateTotalFee } = useTransaction();

export class TransactionService {
  private transactions: Transaction[] = [];
  private studentBalances: StudentBalance[] = [];

  constructor() {
    this.loadFromLocalStorage();
    this.initializeBalances();
  }

  // Student methods
  getAllStudents(): Student[] {
    return students;
  }

  searchStudents(query: string): Student[] {
    const searchLower = query.toLowerCase();
    return students.filter(student => 
      student.name.toLowerCase().includes(searchLower) ||
      student.nis.includes(searchLower) ||
      student.major.toLowerCase().includes(searchLower)
    );
  }

  getStudentById(id: string): Student | undefined {
    return students.find(student => student.id === id);
  }

  // Fee components methods
  getFeeComponentsByClassLevel(classLevel: string): FeeComponent[] {
    return feeComponents.filter(fee => fee.classLevel === classLevel);
  }

  getAllFeeComponents(): FeeComponent[] {
    return feeComponents;
  }

  calculateBalance(fee: FeeComponent, studentId: string): number {
    const balance = this.studentBalances.find(
      b => b.studentId === studentId && b.feeId === fee.id
    );
    
    if (balance) return balance.balance;
    
    // Calculate default balance
    const totalAmount = calculateTotalFee(fee);
    
    // Find existing payments for this fee
    const paidAmount = this.transactions
      .filter(t => t.studentId === studentId)
      .flatMap(t => t.payments)
      .filter(p => p.feeId === fee.id)
      .reduce((sum, p) => sum + p.amount, 0);
    
    return Math.max(0, totalAmount - paidAmount);
  }

  // Transaction methods
  createTransaction(form: TransactionForm): Transaction {
    const totalAmount = form.payments.reduce((sum, p) => sum + p.amount, 0);
    const totalSubsidy = Object.values(form.subsidies).reduce((sum, amount) => sum + amount, 0);
    
    const newTransaction: Transaction = {
      ...form,
      id: generateId(),
      createdAt: new Date().toISOString(),
      totalAmount,
      totalSubsidy,
      netAmount: totalAmount - totalSubsidy
    };
    
    this.transactions.push(newTransaction);
    this.updateStudentBalances(newTransaction);
    this.saveToLocalStorage();
    
    return newTransaction;
  }

  getAllTransactions(): Transaction[] {
    return this.transactions;
  }

  getTransactionById(id: string): Transaction | undefined {
    return this.transactions.find(t => t.id === id);
  }

  deleteTransaction(id: string): boolean {
    const index = this.transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      this.transactions.splice(index, 1);
      this.saveToLocalStorage();
      return true;
    }
    return false;
  }

  // Helper methods
  private initializeBalances(): void {
    students.forEach(student => {
      feeComponents.forEach(fee => {
        const balance = this.calculateBalance(fee, student.id);
        this.studentBalances.push({
          studentId: student.id,
          feeId: fee.id,
          balance
        });
      });
    });
  }

 private updateStudentBalances(transaction: Transaction): void {
  transaction.payments.forEach(payment => {
    // Cari record balance yang sesuai
    const balanceRecord = this.studentBalances.find(
      b => b.studentId === transaction.studentId && b.feeId === payment.feeId
    );
    
    if (balanceRecord) {
      // Update balance yang ada
      balanceRecord.balance = Math.max(0, balanceRecord.balance - payment.amount);
    } else {
      // Jika tidak ada, buat record baru
      const initialBalance = this.calculateBalanceForPayment(transaction.studentId, payment.feeId);
      this.studentBalances.push({
        studentId: transaction.studentId,
        feeId: payment.feeId,
        balance: Math.max(0, initialBalance - payment.amount)
      });
    }
  });
  
  // Update student total paid
  const student = students.find(s => s.id === transaction.studentId);
  if (student) {
    student.totalPaid += transaction.totalAmount;
  }
}

private calculateBalanceForPayment(studentId: string, feeId: string): number {
  const fee = feeComponents.find(f => f.id === feeId);
  if (!fee) return 0;
  
  return this.calculateBalance(fee, studentId);
}

  // Local storage methods
  private saveToLocalStorage(): void {
    localStorage.setItem('transactions', JSON.stringify(this.transactions));
    localStorage.setItem('studentBalances', JSON.stringify(this.studentBalances));
  }

  private loadFromLocalStorage(): void {
    const storedTransactions = localStorage.getItem('transactions');
    const storedBalances = localStorage.getItem('studentBalances');
    
    if (storedTransactions) {
      this.transactions = JSON.parse(storedTransactions);
    }
    
    if (storedBalances) {
      this.studentBalances = JSON.parse(storedBalances);
    }
  }

  // Get reference data
  getAcademicYears(): string[] {
    return academicYears;
  }

  getPaymentTypes() {
    return paymentTypes;
  }

  getPaymentPurposes() {
    return paymentPurposes;
  }

  getSubsidiSources(): SubsidiSource[] {
    return subsidiSources.map(source => ({
      ...source,
      amount: 0 // Reset for new transaction
    }));
  }
}

export const transactionService = new TransactionService();