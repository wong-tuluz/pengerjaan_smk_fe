<template>
  <div class="grid grid-cols-2 divide-x divide-border">
    <!-- Left Column (1-14) -->
    <div>
      <div class="grid grid-cols-3 text-xs font-semibold bg-muted/50 border-b border-border">
        <div class="p-2"></div>
        <div class="p-2 text-center text-primary">BAYAR</div>
        <div class="p-2 text-center text-destructive">SALDO</div>
      </div>
      <div
        v-for="(fee, index) in firstHalf"
        :key="fee.id"
        :class="[
          'grid grid-cols-3 text-xs border-b border-border items-center',
          index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
        ]"
      >
        <div :class="['p-2 truncate', !hasBalance(fee) ? 'text-destructive' : '']">
          {{ index + 1 }}. {{ fee.name }}
        </div>
        <div class="p-1">
          <input
            type="text"
            class="flex w-full rounded-md border border-input bg-background py-2 text-xs text-right font-mono px-1 h-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            :value="formatCurrency(payments[fee.id] || 0)"
            @input="handleAmountChange(fee.id, $event)"
            :disabled="!hasBalance(fee)"
          />
        </div>
        <div :class="['p-2 text-right font-mono', hasBalance(fee) ? 'text-destructive' : 'text-muted-foreground']">
          {{ formatCurrency(getBalance(fee)) }}
        </div>
      </div>
    </div>

    <!-- Right Column (15-27) -->
    <div>
      <div class="grid grid-cols-3 text-xs font-semibold bg-muted/50 border-b border-border">
        <div class="p-2"></div>
        <div class="p-2 text-center text-primary">BAYAR</div>
        <div class="p-2 text-center text-destructive">SALDO</div>
      </div>
      <div
        v-for="(fee, index) in secondHalf"
        :key="fee.id"
        :class="[
          'grid grid-cols-3 text-xs border-b border-border items-center',
          index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
        ]"
      >
        <div :class="['p-2 truncate', !hasBalance(fee) ? 'text-destructive' : '']">
          {{ index + 15 }}. {{ fee.name }}
        </div>
        <div class="p-1">
          <input
            type="text"
            class="flex w-full rounded-md border border-input bg-background py-2 text-xs text-right font-mono px-1 h-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            :value="formatCurrency(payments[fee.id] || 0)"
            @input="handleAmountChange(fee.id, $event)"
            :disabled="!hasBalance(fee)"
          />
        </div>
        <div :class="['p-2 text-right font-mono', hasBalance(fee) ? 'text-destructive' : 'text-muted-foreground']">
          {{ formatCurrency(getBalance(fee)) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { FeeComponent, Student } from '@/types/ITransaction';
import { useCurrency } from '@/composables/useCurrency';
import { useTransaction } from '@/composables/useTransaction';

interface Props {
  student: Student;
  feeComponents: FeeComponent[];
  payments: Record<string, number>;
}

interface Emits {
  (e: 'update:payments', value: Record<string, number>): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { formatCurrency, parseCurrency } = useCurrency();
const { calculateBalance, hasBalance } = useTransaction();

const firstHalf = computed(() => props.feeComponents.slice(0, 14));
const secondHalf = computed(() => props.feeComponents.slice(14));

const getBalance = (fee: FeeComponent): number => {
  const paidAmount = props.payments[fee.id] || 0;
  return calculateBalance(fee, paidAmount);
};

const handleAmountChange = (feeId: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  const amount = parseCurrency(target.value);
  const newPayments = { ...props.payments, [feeId]: amount };
  emit('update:payments', newPayments);
};
</script>