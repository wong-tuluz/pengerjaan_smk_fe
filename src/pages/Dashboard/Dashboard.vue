<template>
  <main class="p-4">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <p class="mt-4 text-sm text-muted-foreground">Memuat data...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="rounded-lg border border-destructive/50 bg-destructive/10 p-6 mb-8">
      <div class="flex items-center gap-2 text-destructive mb-2">
        <AlertCircleIcon class="h-5 w-5" />
        <h3 class="font-semibold text-lg">Terjadi Kesalahan</h3>
      </div>
      <p class="text-sm text-muted-foreground mb-4">{{ error }}</p>
      <button 
        @click="fetchData"
        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
      >
        Coba Lagi
      </button>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Profil Siswa -->
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm mb-8 overflow-hidden">
        <div class="h-2 bg-gradient-to-r from-primary to-primary/60"></div>
        <div class="p-6">
          <div class="flex flex-col md:flex-row md:items-center gap-6">
            <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <UserIcon class="w-8 h-8 text-primary" />
            </div>
            <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p class="text-sm text-muted-foreground mb-1">Nama Lengkap</p>
                <p class="font-semibold text-lg">{{ student.name }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                  <IdCardIcon class="w-3 h-3" /> NIS
                </p>
                <p class="font-semibold text-lg">{{ student.nis }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                  <CalendarIcon class="w-3 h-3" /> Jumlah Event
                </p>
                <p class="font-semibold text-lg">{{ student.examCount }} Ujian</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Judul Daftar Ujian -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold mb-2">Daftar Ujian</h2>
        <p class="text-sm text-muted-foreground">Pilih ujian yang ingin Anda kerjakan</p>
      </div>

      <!-- Grid Daftar Ujian -->
      <div v-if="exams.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="exam in exams" 
          :key="exam.id"
          class="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30"
        >
          <!-- Status Bar - DINAMIS BERDASARKAN STATUS -->
          <div class="h-2" :class="getStatusBarColor(exam.status)"></div>
          
          <!-- Header Kartu -->
          <div class="flex flex-col space-y-1.5 p-6">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <h3 class="font-semibold text-xl mb-2">{{ exam.title }}</h3>
                <p class="text-sm text-muted-foreground">{{ exam.description }}</p>
              </div>
              <div 
                class="rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 flex items-center gap-1 whitespace-nowrap"
                :class="getBadgeClasses(exam.status)"
              >
                <CirclePlayIcon v-if="exam.status === 'ongoing'" class="w-3 h-3" />
                <CircleCheckIcon v-else class="w-3 h-3" />
                {{ getStatusText(exam.status) }}
              </div>
            </div>
          </div>

          <!-- Konten Kartu -->
          <div class="p-6 pt-0">
            <!-- Detail Ujian -->
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 text-sm">
              <div class="flex items-center gap-2 text-muted-foreground">
                <FileTextIcon class="w-4 h-4" />
                <span>{{ exam.questionCount }} Soal</span>
              </div>
              <div class="flex items-center gap-2 text-muted-foreground">
                <ClockIcon class="w-4 h-4" />
                <span>{{ exam.duration }} Menit</span>
              </div>
              <div class="flex items-center gap-2 text-muted-foreground col-span-2 md:col-span-1">
                <CalendarIcon class="w-4 h-4" />
                <span class="truncate">{{ exam.date }} pukul {{ exam.time }}</span>
              </div>
            </div>

            <!-- Tombol Aksi - DINAMIS BERDASARKAN STATUS -->
            <button
              @click="startExam(exam)"
              :disabled="isExamDisabled(exam.status) || startingExam === exam.id"
              class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 w-full gap-2"
              :class="getButtonClasses(exam.status)"
            >
              <template v-if="startingExam === exam.id">
                <div class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current"></div>
                <span class="text-sm">Memproses...</span>
              </template>
              <template v-else>
                <CirclePlayIcon v-if="exam.status === 'ongoing'" class="w-4 h-4" />
                <CircleCheckIcon v-else class="w-4 h-4" />
                <span class="text-sm">{{ getButtonText(exam.status) }}</span>
              </template>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12 border rounded-lg">
        <div class="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <FileTextIcon class="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 class="font-semibold text-lg mb-2">Tidak Ada Ujian</h3>
        <p class="text-sm text-muted-foreground">Tidak ada ujian yang tersedia untuk saat ini.</p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  UserIcon, 
  IdCardIcon, 
  CalendarIcon, 
  CirclePlayIcon, 
  CircleCheckIcon, 
  FileTextIcon, 
  ClockIcon,
  AlertCircleIcon
} from 'lucide-vue-next'
import type { Exam, Student } from '@/types/Icommon'
import { examService } from '@/services/eventService'

const router = useRouter()

// Reactive state - HANYA DATA DASAR DARI API
const student = ref<Student>({
  name: 'Ahmad Rizki Pratama',
  nis: '2024001',
  examCount: 3
})

// Data exams dari API - TANPA PROPERTIES STYLING
const exams = ref<Exam[]>([
  {
    id: 1,
    title: 'UAS Semester Ganjil 2024',
    description: 'Ujian Akhir Semester Ganjil Tahun Ajaran 2024/2025 - Mata Pelajaran Informatika',
    status: 'ongoing',
    questionCount: 10,
    duration: 90,
    date: '1 Desember 2024',
    time: '08.00',
  },
  {
    id: 2,
    title: 'Try Out UTBK 2025',
    description: 'Simulasi Ujian Tulis Berbasis Komputer untuk persiapan SNBT 2025',
    status: 'ongoing',
    questionCount: 10,
    duration: 120,
    date: '15 Desember 2024',
    time: '08.00',
  },
  {
    id: 3,
    title: 'UTS Semester Genap 2025',
    description: 'Ujian Tengah Semester Genap - Akan dimulai bulan Maret 2025',
    status: 'completed',
    questionCount: 0,
    duration: 60,
    date: '1 Maret 2025',
    time: '08.00',
  }
])

const loading = ref(false)
const error = ref<string | null>(null)
const startingExam = ref<number | null>(null)

// ========== FUNGSI HELPER BERDASARKAN STATUS ==========

// 1. Warna status bar
const getStatusBarColor = (status: string) => {
  return status === 'ongoing' 
    ? 'bg-gradient-to-r from-primary to-primary/60' 
    : 'bg-gradient-to-r from-gray-400 to-gray-300'
}

// 2. Text untuk badge
const getStatusText = (status: string) => {
  return status === 'ongoing' ? 'Sedang Berlangsung' : 'Selesai'
}

// 3. Classes untuk badge
const getBadgeClasses = (status: string) => {
  return status === 'ongoing'
    ? 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80'
    : 'text-foreground'
}

// 4. Text untuk button
const getButtonText = (status: string) => {
  return status === 'ongoing' ? 'Mulai Ujian' : 'Ujian Telah Berakhir'
}

// 5. Classes untuk button
const getButtonClasses = (status: string) => {
  return status === 'ongoing'
    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
    : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
}

// 6. Apakah button disabled
const isExamDisabled = (status: string) => {
  return status !== 'ongoing' // Hanya ongoing yang bisa diklik
}

// ========== LOGIKA FETCH DATA ==========

// Fetch data function
const fetchData = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Fetch student data
    const studentResponse = await examService.getStudentData()
    if (studentResponse.success) {
      student.value = studentResponse.data
    }

    // Fetch exams data
    const examsResponse = await examService.getExams()
    if (examsResponse.success) {
      // Hanya ambil data dasar, styling di-handle di frontend
      exams.value = examsResponse.data.map(exam => ({
        id: exam.id,
        title: exam.title,
        description: exam.description,
        status: exam.status,
        questionCount: exam.questionCount,
        duration: exam.duration,
        date: exam.date,
        time: exam.time,
      }))
    }
  } catch (err) {
    error.value = 'Gagal memuat data. Silakan coba lagi.'
    console.error('Error fetching data:', err)
  } finally {
    loading.value = false
  }
}

// Start exam function
const startExam = async (exam: Exam) => {
  if (exam.status !== 'ongoing') return
  
  startingExam.value = exam.id
  
  try {
    const result = await examService.startExam(exam.id)
    
    if (result.success) {
      if (result.redirectUrl) {
        router.push(result.redirectUrl)
      } else {
        alert(`Ujian "${exam.title}" dimulai!`)
      }
    } else {
      alert(`Gagal memulai ujian: ${result.message}`)
    }
  } catch (err) {
    alert('Terjadi kesalahan saat memulai ujian.')
    console.error('Error starting exam:', err)
  } finally {
    startingExam.value = null
  }
}

onMounted(() => {
  fetchData()
})
</script>