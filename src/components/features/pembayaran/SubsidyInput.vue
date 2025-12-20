<template>
  <div class="border-t border-border pt-2 space-y-1">
    <div
      v-for="source in subsidiSources"
      :key="source.id"
      class="flex items-center justify-between gap-2"
    >
      <label class="font-medium text-xs w-20">
        {{ source.name }}
      </label>
      <input
        type="text"
        class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-right font-mono h-6 flex-1 text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        :value="formatCurrency(subsidies[source.id] || 0)"
        @input="handleAmountChange(source.id, $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { subsidiSources } from '@/services/data';
import { useCurrency } from '@/composables/useCurrency';

interface Props {
  subsidies: Record<string, number>;
}

interface Emits {
  (e: 'update:subsidies', value: Record<string, number>): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { formatCurrency, parseCurrency } = useCurrency();

const handleAmountChange = (sourceId: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  const amount = parseCurrency(target.value);
  const newSubsidies = { ...props.subsidies, [sourceId]: amount };
  emit('update:subsidies', newSubsidies);
};
</script>