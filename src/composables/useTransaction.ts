// src/composables/useTransaction.ts

import type { FeeComponent } from '@/types/ITransaction';
import { useDate } from './useDate';

export function useTransaction() {
  const { getTimestamp } = useDate();

  /**
   * Generate unique reference number
   * @returns Reference number string (e.g., "TRX/20241220/1234")
   */
  const generateReferenceNo = (): string => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    
    return `TRX/${year}${month}${day}/${random}`;
  };

  /**
   * Generate unique ID
   * @returns Unique ID string
   */
  const generateId = (): string => {
    return getTimestamp().toString(36) + Math.random().toString(36).substr(2);
  };

  /**
   * Calculate total fee (default amount * monthly multiplier)
   * @param fee - Fee component
   * @returns Total fee amount
   */
  const calculateTotalFee = (fee: FeeComponent): number => {
    return fee.defaultAmount * (fee.monthlyMultiplier || 1);
  };

  /**
   * Calculate balance (total fee - paid amount)
   * @param fee - Fee component
   * @param paidAmount - Amount already paid
   * @returns Balance amount
   */
  const calculateBalance = (fee: FeeComponent, paidAmount: number): number => {
    const totalFee = calculateTotalFee(fee);
    return Math.max(0, totalFee - paidAmount);
  };

  /**
   * Check if fee has balance
   * @param fee - Fee component
   * @returns Boolean indicating if fee has balance
   */
  const hasBalance = (fee: FeeComponent): boolean => {
    return calculateTotalFee(fee) > 0;
  };

  return {
    generateReferenceNo,
    generateId,
    calculateTotalFee,
    calculateBalance,
    hasBalance
  };
}