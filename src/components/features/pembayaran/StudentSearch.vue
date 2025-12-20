<template>
  <div class="space-y-1 col-span-3">
    <label class="font-medium text-xs">Cari Siswa</label>
    <div class="relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.3-4.3"></path>
      </svg>
      <input
        type="text"
        class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm h-8 pl-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        placeholder="Nama/NIS..."
        :value="searchQuery"
        @input="handleSearch"
        @focus="handleFocus"
      />
    </div>

    <!-- Dropdown Search Results -->
    <div
      v-if="isDropdownOpen && searchResults.length > 0"
      class="absolute z-50 mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto w-full"
    >
      <div
        v-for="student in searchResults"
        :key="student.id"
        class="px-3 py-2 hover:bg-accent cursor-pointer text-sm"
        @click="selectStudent(student)"
      >
        <div class="font-medium">{{ student.name }}</div>
        <div class="text-xs text-muted-foreground">
          NIS: {{ student.nis }} | Kelas: {{ student.class }} {{ student.major }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Student } from '@/types/ITransaction';
import { transactionService } from '@/services/transactionService';

interface Props {
  selectedStudent?: Student | null;
}

interface Emits {
  (e: 'update:selectedStudent', student: Student): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const searchQuery = ref('');
const searchResults = ref<Student[]>([]);
const isDropdownOpen = ref(false);

const handleSearch = (event: Event) => {
  const target = event.target as HTMLInputElement;
  searchQuery.value = target.value;
  
  if (searchQuery.value.length > 1) {
    searchResults.value = transactionService.searchStudents(searchQuery.value);
    isDropdownOpen.value = true;
  } else {
    searchResults.value = [];
    isDropdownOpen.value = false;
  }
};

const handleFocus = () => {
  if (searchQuery.value.length > 1) {
    isDropdownOpen.value = true;
  }
};

const selectStudent = (student: Student) => {
  emit('update:selectedStudent', student);
  searchQuery.value = `${student.nis} - ${student.name}`;
  isDropdownOpen.value = false;
};

watch(() => props.selectedStudent, (newStudent) => {
  if (!newStudent) {
    searchQuery.value = '';
    searchResults.value = [];
  }
});
</script>