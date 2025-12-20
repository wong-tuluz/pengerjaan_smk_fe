// src/services/data.ts

import type { FeeComponent, Student, SubsidiSource, PaymentType, PaymentPurpose } from "@/types/ITransaction";

export const students: Student[] = [
  { id: '1', nis: '20240001', name: 'Ahmad Rizki Pratama', class: 'X', major: 'TKR', status: 'active', totalDue: 7400000, totalPaid: 3500000, idSppSiswa: '2410-0001', kodeParameter: '2410' },
  { id: '2', nis: '20240002', name: 'Siti Nurhaliza', class: 'X', major: 'TKJ', status: 'active', totalDue: 7400000, totalPaid: 7400000, idSppSiswa: '2410-0002', kodeParameter: '2410' },
  { id: '3', nis: '20240003', name: 'Muhammad Faisal', class: 'XI', major: 'TKR', status: 'active', totalDue: 7400000, totalPaid: 2000000, idSppSiswa: '2310-0003', kodeParameter: '2310' },
  { id: '4', nis: '20240004', name: 'Dewi Anggraini', class: 'XI', major: 'RPL', status: 'active', totalDue: 7400000, totalPaid: 7400000, idSppSiswa: '2310-0004', kodeParameter: '2310' },
  { id: '5', nis: '20240005', name: 'Agit Wahyu', class: 'X', major: 'TKR', status: 'active', totalDue: 7400000, totalPaid: 4100000, idSppSiswa: '2310-8761', kodeParameter: '2310' },
  { id: '6', nis: '20240006', name: 'Rina Wulandari', class: 'XII', major: 'TKJ', status: 'active', totalDue: 7400000, totalPaid: 0, idSppSiswa: '2210-0006', kodeParameter: '2210' },
  { id: '7', nis: '20230015', name: 'Agus Setiawan', class: 'X', major: 'RPL', status: 'inactive', totalDue: 7400000, totalPaid: 1500000, idSppSiswa: '2310-0007', kodeParameter: '2310' },
  { id: '8', nis: '20240008', name: 'Lisa Permata', class: 'XI', major: 'TKJ', status: 'active', totalDue: 7400000, totalPaid: 3000000, idSppSiswa: '2310-0008', kodeParameter: '2310' },
];

export const feeComponents: FeeComponent[] = [
  { id: '1', name: 'Uang SPP', defaultAmount: 100000, academicYear: '2024/2025', classLevel: 'X', monthlyMultiplier: 12 },
  { id: '2', name: 'Uang ALAT', defaultAmount: 10000, academicYear: '2024/2025', classLevel: 'X', monthlyMultiplier: 12 },
  { id: '3', name: 'Uang PRAKTEK', defaultAmount: 20000, academicYear: '2024/2025', classLevel: 'X', monthlyMultiplier: 12 },
  { id: '4', name: 'Uang KOMPUTER', defaultAmount: 20000, academicYear: '2024/2025', classLevel: 'X', monthlyMultiplier: 12 },
  { id: '5', name: 'Uang PANGKAL', defaultAmount: 300000, academicYear: '2024/2025', classLevel: 'X' },
  { id: '6', name: 'Uang SERAGAM', defaultAmount: 500000, academicYear: '2024/2025', classLevel: 'X' },
  { id: '7', name: 'Uang ATRIBUT', defaultAmount: 0, academicYear: '2024/2025', classLevel: 'X' },
  { id: '8', name: 'Uang PHBI PHBN', defaultAmount: 20000, academicYear: '2024/2025', classLevel: 'X', monthlyMultiplier: 12 },
  { id: '9', name: 'Uang OSIS', defaultAmount: 8000, academicYear: '2024/2025', classLevel: 'X', monthlyMultiplier: 12 },
  { id: '10', name: 'Uang MABICA MOS', defaultAmount: 5000, academicYear: '2024/2025', classLevel: 'X', monthlyMultiplier: 12 },
  { id: '11', name: 'Uang PRAMUKA/HW', defaultAmount: 10000, academicYear: '2024/2025', classLevel: 'X', monthlyMultiplier: 12 },
  { id: '12', name: 'Uang KI', defaultAmount: 0, academicYear: '2024/2025', classLevel: 'X' },
  { id: '13', name: 'Uang PRAKERIN', defaultAmount: 0, academicYear: '2024/2025', classLevel: 'X' },
  { id: '14', name: 'Uang EXTRAKURIKULER', defaultAmount: 10000, academicYear: '2024/2025', classLevel: 'X', monthlyMultiplier: 12 },
  { id: '15', name: 'Uang UUB MID', defaultAmount: 20000, academicYear: '2024/2025', classLevel: 'X', monthlyMultiplier: 12 },
  { id: '16', name: 'Uang UKK', defaultAmount: 15000, academicYear: '2024/2025', classLevel: 'X', monthlyMultiplier: 12 },
  { id: '17', name: 'Uang PERSIAPAN UN/AKM', defaultAmount: 0, academicYear: '2024/2025', classLevel: 'X' },
  { id: '18', name: 'Uang BANTUAN YAYASAN', defaultAmount: 10000, academicYear: '2024/2025', classLevel: 'X', monthlyMultiplier: 12 },
  { id: '19', name: 'Uang SB. PENGEMBANGAN', defaultAmount: 3000000, academicYear: '2024/2025', classLevel: 'X' },
  { id: '20', name: 'Uang BP3', defaultAmount: 0, academicYear: '2024/2025', classLevel: 'X' },
  { id: '21', name: 'Uang BUKU ISMUBA', defaultAmount: 23000, academicYear: '2024/2025', classLevel: 'X', monthlyMultiplier: 12 },
  { id: '22', name: 'Uang BUKU LKS', defaultAmount: 0, academicYear: '2024/2025', classLevel: 'X' },
  { id: '23', name: 'Uang BUKU PAKET', defaultAmount: 15000, academicYear: '2024/2025', classLevel: 'X', monthlyMultiplier: 12 },
  { id: '24', name: 'Uang ASURANSI JIWA', defaultAmount: 7000, academicYear: '2024/2025', classLevel: 'X', monthlyMultiplier: 12 },
  { id: '25', name: 'Uang DSM', defaultAmount: 7000, academicYear: '2024/2025', classLevel: 'X', monthlyMultiplier: 12 },
  { id: '26', name: 'Uang BKK', defaultAmount: 0, academicYear: '2024/2025', classLevel: 'X' },
  { id: '27', name: 'Dana Lainnya', defaultAmount: 0, academicYear: '2024/2025', classLevel: 'X' },
];

export const subsidiSources: SubsidiSource[] = [
  { id: 'jppd', name: 'JPPD', amount: 0 },
  { id: 'bsm', name: 'BSM', amount: 0 },
  { id: 'bosda', name: 'BOSDA', amount: 0 },
  { id: 'bos', name: 'BOS', amount: 0 },
  { id: 'bosdakab', name: 'BOSDAKAB', amount: 0 },
  { id: 'pip', name: 'PIP', amount: 0 },
  { id: 'retrivel', name: 'RETRIVEL', amount: 0 },
  { id: 'csr', name: 'CSR', amount: 0 },
  { id: 'tabungan', name: 'TABUNGAN', amount: 0 },
];

export const academicYears = ['2024/2025', '2023/2024', '2022/2023'];

export const paymentTypes: PaymentType[] = [
  { id: 'cash', name: 'TUNAI' },
  { id: 'transfer', name: 'TRANSFER' },
  { id: 'qris', name: 'QRIS' },
  { id: 'edc', name: 'KARTU DEBIT' },
  { id: 'credit', name: 'KARTU KREDIT' },
];

export const paymentPurposes: PaymentPurpose[] = [
  { id: 'full', name: 'PELUNASAN', code: '0' },
  { id: 'partial', name: 'ANGSURAN', code: '1' },
  { id: 'specific', name: 'SPESIFIK', code: '2' },
  { id: 'registration', name: 'PENDAFTARAN', code: '3' },
];