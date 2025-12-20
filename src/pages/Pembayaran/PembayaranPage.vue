<template>
  <main>
    <header class="mb-8">
      <h1 class="text-2xl font-bold text-foreground">Transaksi Pembayaran SPP</h1>
      <p class="text-muted-foreground mt-1">Proses pembayaran uang sekolah siswa</p>
    </header>

    <div class="animate-fade-in">
      <!-- Student Data Section -->
      <div class="bg-card rounded-xl border border-border p-4 mb-4">
        <div class="text-xs font-semibold text-muted-foreground mb-3 border-b border-border pb-2">
          Data SISWA
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <!-- Reference Number -->
          <div class="space-y-1">
            <label class="font-medium text-xs">NO Referensi</label>
            <input
              class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm h-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              v-model="formData.referenceNo"
            />
          </div>

          <!-- Payment Date -->
          <div class="space-y-1">
            <label class="font-medium text-xs">Tgl Bayar</label>
            <input
              type="date"
              class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm h-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              v-model="formData.paymentDate"
            />
          </div>

          <!-- Student Search Component -->
          <StudentSearch
            :selected-student="selectedStudent"
            @update:selected-student="handleStudentSelect"
          />

          <!-- Jurusan (Readonly) -->
          <div class="space-y-1">
            <label class="font-medium text-xs">Jurusan</label>
            <input
              class="flex w-full rounded-md border border-input bg-muted px-3 py-2 text-sm h-8"
              readonly
              :value="selectedStudent?.major || ''"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-3 pt-3 border-t border-border">
          <!-- ID SPP Siswa -->
          <div class="space-y-1">
            <label class="font-medium text-xs">ID SPP SISWA</label>
            <input
              class="flex w-full rounded-md border border-input bg-muted px-3 py-2 text-sm h-8 font-mono"
              readonly
              :value="selectedStudent?.idSppSiswa || ''"
            />
          </div>

          <!-- Kode Parameter -->
          <div class="space-y-1">
            <label class="font-medium text-xs">Kode Parameter</label>
            <input
              class="flex w-full rounded-md border border-input bg-muted px-3 py-2 text-sm h-8 font-mono"
              readonly
              :value="selectedStudent?.kodeParameter || ''"
            />
          </div>

          <!-- Kelas -->
          <div class="space-y-1">
            <label class="font-medium text-xs">Kelas</label>
            <input
              class="flex w-full rounded-md border border-input bg-muted px-3 py-2 text-sm h-8"
              readonly
              :value="selectedStudent ? `KELAS ${selectedStudent.class}` : ''"
            />
          </div>

          <!-- Periode -->
          <div class="space-y-1">
            <label class="font-medium text-xs">Periode</label>
            <select
              class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm h-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              v-model="formData.academicYear"
            >
              <option value="">Pilih Periode</option>
              <option v-for="year in academicYears" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>

          <!-- Jenis Bayar -->
          <div class="space-y-1">
            <label class="font-medium text-xs">Jenis Bayar</label>
            <select
              class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm h-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              v-model="formData.paymentType"
            >
              <option value="">Pilih Jenis Bayar</option>
              <option v-for="type in paymentTypes" :key="type.id" :value="type.id">
                {{ type.name }}
              </option>
            </select>
          </div>

          <!-- Guna Bayar -->
          <div class="space-y-1">
            <label class="font-medium text-xs">Guna Bayar</label>
            <select
              class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm h-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              v-model="formData.paymentPurpose"
            >
              <option value="">Pilih Guna Bayar</option>
              <option v-for="purpose in paymentPurposes" :key="purpose.id" :value="purpose.id">
                {{ purpose.code }} - {{ purpose.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Payment Grid and Summary -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <!-- Fee Payment Grid -->
        <div class="lg:col-span-3 bg-card rounded-xl border border-border overflow-hidden">
          <div class="px-4 py-2 border-b border-border bg-amber-100 dark:bg-amber-900/30">
            <h3 class="font-semibold text-sm">TRANSAKSI PEMBAYARAN</h3>
          </div>
          
          <FeePaymentGrid
            v-if="selectedStudent && feeComponents.length > 0"
            :student="selectedStudent"
            :fee-components="feeComponents"
            :payments="payments"
            @update:payments="handlePaymentUpdate"
          />
          <div v-else class="p-8 text-center text-muted-foreground">
            Pilih siswa terlebih dahulu untuk menampilkan komponen pembayaran
          </div>
        </div>

        <!-- Payment Summary -->
        <div class="lg:col-span-1">
          <div class="bg-card rounded-xl border border-border shadow-sm">
            <div class="px-3 py-2 border-b border-border bg-amber-100 dark:bg-amber-900/30">
              <h3 class="font-semibold text-sm">Pembayaran</h3>
            </div>
            
            <div class="p-3 space-y-2">
              <!-- Total Due -->
              <div class="text-right">
                <p class="text-xs text-muted-foreground">SALDO TAGIHAN SPP</p>
                <p class="text-lg font-bold text-primary">
                  {{ formatCurrency(selectedStudent?.totalDue || 0) }}
                </p>
              </div>

              <!-- Total Transaction -->
              <div class="text-right border-t border-border pt-2">
                <p class="text-xs text-muted-foreground">TOTAL TRANSAKSI</p>
                <p class="text-lg font-bold text-success">
                  {{ formatCurrency(totalPayments) }}
                </p>
              </div>

              <!-- Subsidies -->
              <SubsidyInput
                :subsidies="formData.subsidies"
                @update:subsidies="handleSubsidyUpdate"
              />

              <!-- Total to Pay -->
              <div class="border-t border-border pt-3 text-right">
                <p class="text-xs font-semibold text-muted-foreground">TOTAL BAYAR</p>
                <p class="text-xl font-bold text-primary">
                  {{ formatCurrency(totalToPay) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-2 mt-4 p-4 bg-card rounded-xl border border-border">
        <button
          class="inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none"
          @click="handleSave"
          :disabled="!canSave"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
            <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path>
            <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path>
            <path d="M7 3v4a1 1 0 0 0 1 1h7"></path>
          </svg>
          Simpan
        </button>

        <button
          class="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-sm font-medium transition-colors"
          @click="handlePrint"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"></path>
            <rect x="6" y="14" width="12" height="8" rx="1"></rect>
          </svg>
          Print
        </button>

        <button
          class="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-sm font-medium transition-colors"
          @click="handleSettings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
            <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"></path>
            <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
            <path d="M12 17.5v-11"></path>
          </svg>
          Setting
        </button>

        <button
          class="inline-flex items-center justify-center gap-2 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2 text-sm font-medium transition-colors"
          @click="handleClear"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            <line x1="10" x2="10" y1="11" y2="17"></line>
            <line x1="14" x2="14" y1="11" y2="17"></line>
          </svg>
          Clear
        </button>

        <div class="flex-1"></div>

        <button
          class="inline-flex items-center justify-center gap-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none"
          @click="handleFullPayment"
          :disabled="!selectedStudent"
        >
          Pelunasan
        </button>

        <button
          class="inline-flex items-center justify-center gap-2 rounded-md hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-sm font-medium transition-colors"
          @click="handleExit"
        >
          Keluar
        </button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import StudentSearch from '@/components/features/pembayaran/StudentSearch.vue';
import FeePaymentGrid from '@/components/features/pembayaran/FeePaymentGrid.vue';
import SubsidyInput from '@/components/features/pembayaran/SubsidyInput.vue';
import type { Student, TransactionForm } from '@/types/ITransaction';
import { 
  feeComponents,
  academicYears,
  paymentTypes,
  paymentPurposes 
} from '@/services/data';
import { useCurrency } from '@/composables/useCurrency';
import { useTransaction } from '@/composables/useTransaction';
import { useDate } from '@/composables/useDate';

const { formatCurrency } = useCurrency();
const { generateReferenceNo, calculateTotalFee } = useTransaction();
const { getCurrentDate } = useDate();

const selectedStudent = ref<Student | null>(null);
const payments = ref<Record<string, number>>({});

const formData = ref<TransactionForm>({
  referenceNo: generateReferenceNo(),
  paymentDate: getCurrentDate(),
  studentId: '',
  academicYear: '',
  paymentType: '',
  paymentPurpose: '',
  payments: [],
  subsidies: {},
});

// Initialize payment amounts
feeComponents.forEach(fee => {
  payments.value[fee.id] = 0;
});

const totalPayments = computed(() => {
  return Object.values(payments.value).reduce((sum, amount) => sum + amount, 0);
});

const totalSubsidies = computed(() => {
  return Object.values(formData.value.subsidies).reduce((sum, amount) => sum + amount, 0);
});

const totalToPay = computed(() => {
  return totalPayments.value - totalSubsidies.value;
});

const canSave = computed(() => {
  return selectedStudent.value !== null && totalPayments.value > 0;
});

const handleStudentSelect = (student: Student) => {
  selectedStudent.value = student;
  formData.value.studentId = student.id;
  formData.value.academicYear = '2024/2025';
  
  // Initialize payments with default amounts
  feeComponents.forEach(fee => {
    payments.value[fee.id] = fee.defaultAmount;
  });
};

const handlePaymentUpdate = (newPayments: Record<string, number>) => {
  payments.value = newPayments;
};

const handleSubsidyUpdate = (newSubsidies: Record<string, number>) => {
  formData.value.subsidies = newSubsidies;
};

const handleSave = () => {
  if (!selectedStudent.value) {
    alert('Pilih siswa terlebih dahulu!');
    return;
  }

  if (totalPayments.value === 0) {
    alert('Masukkan jumlah pembayaran!');
    return;
  }

  console.log('Transaction saved:', {
    ...formData.value,
    payments: payments.value,
    total: totalToPay.value
  });

  alert('Transaksi berhasil disimpan!');
  handleClear();
};

const handleClear = () => {
  if (!confirm('Apakah Anda yakin ingin menghapus semua data?')) return;
  
  selectedStudent.value = null;
  formData.value = {
    referenceNo: generateReferenceNo(),
    paymentDate: getCurrentDate(),
    studentId: '',
    academicYear: '',
    paymentType: '',
    paymentPurpose: '',
    payments: [],
    subsidies: {},
  };
  payments.value = {};
  feeComponents.forEach(fee => {
    payments.value[fee.id] = 0;
  });
};

const handleFullPayment = () => {
  if (!selectedStudent.value) return;

  feeComponents.forEach(fee => {
    const totalFee = calculateTotalFee(fee);
    payments.value[fee.id] = totalFee;
  });
};

const handlePrint = () => {
  if (!selectedStudent.value || totalPayments.value === 0) {
    alert('Tidak ada transaksi untuk dicetak!');
    return;
  }
  window.print();
};

const handleSettings = () => {
  console.log('Open settings');
};

const handleExit = () => {
  if (confirm('Apakah Anda yakin ingin keluar?')) {
    window.location.href = '/';
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>