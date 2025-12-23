<template>
  <div v-if="!examStore.session" class="min-h-screen bg-background flex items-center justify-center">
    <div class="text-center">
      <p class="text-muted-foreground">Memuat ujian...</p>
    </div>
  </div>

  <div v-else class="min-h-screen bg-background exam-mode">
    <!-- Header -->
    <header class="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div class="container mx-auto px-4 py-3">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <!-- Info Ujian -->
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileTextIcon class="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 class="font-bold text-lg truncate max-w-xs md:max-w-md text-card-foreground">
                {{ examStore.session?.title }}
              </h1>
              <div class="flex items-center gap-2 text-sm text-muted-foreground">
                <UserIcon class="w-4 h-4" />
                <span>{{ examStore.session?.studentName }}</span>
                <span class="text-border">|</span>
                <span>NIS: {{ examStore.session?.studentNis }}</span>
              </div>
            </div>
          </div>

          <!-- Status & Timer -->
          <div class="flex items-center gap-4">
            <!-- Auto Save Status -->
            <div 
              class="flex items-center gap-1.5 text-xs px-2 py-1 rounded-full transition-colors"
              :class="examStore.session?.isAutoSaving 
                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' 
                : 'bg-success/10 text-success'"
              :title="examStore.session?.isAutoSaving ? 'Menyimpan...' : 'Semua jawaban tersimpan'"
            >
              <CloudIcon class="w-3 h-3" />
              <span class="hidden sm:inline">
                {{ examStore.session?.isAutoSaving ? 'Menyimpan...' : 'Tersimpan' }}
              </span>
            </div>

            <!-- Answered Count -->
            <div class="text-sm text-muted-foreground">
              <span class="font-semibold text-card-foreground">{{ examStore.totalAnswered }}</span>
              <span> / {{ examStore.session?.totalQuestions }} soal terjawab</span>
            </div>

            <!-- Timer -->
            <div class="flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-semibold transition-colors bg-primary/10 text-primary">
              <ClockIcon class="w-5 h-5" />
              <span>{{ examStore.formattedTime }}</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Question Area -->
        <div class="lg:col-span-3 space-y-6">
          <!-- Question Card -->
          <div v-if="examStore.currentQuestion" class="bg-card rounded-xl p-6 shadow-sm border border-border animate-fade-in">
            <div class="flex items-start gap-4 mb-6">
              <span class="flex-shrink-0 w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                {{ examStore.currentQuestion.number }}
              </span>
              <div class="flex-1">
                <p class="text-lg font-medium leading-relaxed text-card-foreground">
                  {{ examStore.currentQuestion.text }}
                </p>
              </div>
            </div>

            <!-- Options -->
            <div class="space-y-3">
              <button
                v-for="option in examStore.currentQuestion.options"
                :key="option.id"
                @click="selectAnswer(option.id)"
                class="w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all duration-200 text-left"
                :class="getOptionClasses(option.id)"
              >
                <span class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-colors"
                  :class="getOptionLabelClasses(option.id)">
                  {{ option.id }}
                </span>
                <span class="flex-1 text-card-foreground">{{ option.text }}</span>
                <div class="text-primary">
                  <!-- Single Choice: Radio Icon -->
                  <template v-if="examStore.currentQuestion.type === 'single'">
                    <CircleIcon 
                      v-if="!isSelected(option.id)" 
                      class="w-5 h-5 text-muted-foreground/30" 
                    />
                    <CircleDotIcon 
                      v-else 
                      class="w-5 h-5 text-primary" 
                    />
                  </template>
                  
                  <!-- Multiple Choice: Checkbox Icon -->
                  <template v-else>
                    <SquareIcon 
                      v-if="!isSelected(option.id)" 
                      class="w-5 h-5 text-muted-foreground/30" 
                    />
                    <CheckSquareIcon 
                      v-else 
                      class="w-5 h-5 text-primary" 
                    />
                  </template>
                </div>
              </button>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="flex items-center justify-between gap-4">
            <!-- Previous Button -->
            <Button
              variant="outline"
              :disabled="examStore.currentQuestionIndex === 0"
              @click="examStore.goToPreviousQuestion()"
              class="gap-2"
            >
              <ChevronLeftIcon class="w-4 h-4" />
              Sebelumnya
            </Button>

            <!-- Submit Button (Desktop) -->
            <div class="hidden md:flex items-center gap-2">
              <Dialog>
                <DialogTrigger as-child>
                  <Button class="gap-2">
                    <SendIcon class="w-4 h-4" />
                    Selesai & Kumpulkan
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Kumpulkan Ujian?</DialogTitle>
                    <DialogDescription>
                      Apakah Anda yakin ingin mengumpulkan ujian? Pastikan semua jawaban sudah diperiksa.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter class="gap-2">
                    <DialogClose as-child>
                      <Button variant="outline">Batal</Button>
                    </DialogClose>
                    <DialogClose as-child>
                      <Button @click="handleSubmitExam" variant="destructive">Ya, Kumpulkan</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <!-- Next Button -->
            <Button
              variant="outline"
              :disabled="examStore.currentQuestionIndex >= (examStore.session?.totalQuestions || 1) - 1"
              @click="examStore.goToNextQuestion()"
              class="gap-2"
            >
              Selanjutnya
              <ChevronRightIcon class="w-4 h-4" />
            </Button>
          </div>
        </div>

        <!-- Sidebar Navigation -->
        <div class="lg:col-span-1 space-y-4">
          <!-- Question Navigation -->
          <div class="bg-card rounded-xl p-4 shadow-sm border border-border">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-semibold text-muted-foreground">Navigasi Soal</h3>
            </div>
            <div class="grid grid-cols-5 gap-2">
              <button
                v-for="question in examStore.session?.questions || []"
                :key="question.id"
                @click="examStore.goToQuestion(question.number - 1)"
                class="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200"
                :class="getQuestionNavClasses(question)"
              >
                {{ question.number }}
              </button>
            </div>
            <div class="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 rounded bg-success"></div>
                <span>Terjawab</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 rounded bg-muted"></div>
                <span>Belum dijawab</span>
              </div>
            </div>
          </div>

          <!-- Submit Button (Mobile) -->
          <div class="md:hidden">
            <Dialog>
              <DialogTrigger as-child>
                <Button class="w-full gap-2">
                  <SendIcon class="w-4 h-4" />
                  Selesai & Kumpulkan
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Kumpulkan Ujian?</DialogTitle>
                  <DialogDescription>
                    Apakah Anda yakin ingin mengumpulkan ujian? Pastikan semua jawaban sudah diperiksa.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter class="gap-2">
                  <DialogClose as-child>
                    <Button variant="outline">Batal</Button>
                  </DialogClose>
                  <DialogClose as-child>
                    <Button @click="handleSubmitExam" variant="destructive">Ya, Kumpulkan</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  FileTextIcon, 
  UserIcon, 
  CloudIcon, 
  ClockIcon,
  CircleIcon,
  CircleDotIcon,
  SquareIcon,
  CheckSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SendIcon
} from 'lucide-vue-next'
import { useExamStore } from '@/stores/examStore'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'

const route = useRoute()
const router = useRouter()
const { toast } = useToast()
const examStore = useExamStore()

// Computed helpers
const isSelected = (optionId: string) => {
  return examStore.isOptionSelected(optionId)
}

const getOptionClasses = (optionId: string) => {
  if (isSelected(optionId)) {
    return 'border-primary bg-primary/5 hover:bg-primary/10'
  }
  return 'border-border hover:border-primary/50 hover:bg-muted/50'
}

const getOptionLabelClasses = (optionId: string) => {
  if (isSelected(optionId)) {
    return 'bg-primary text-primary-foreground'
  }
  return 'bg-muted text-muted-foreground'
}

const getQuestionNavClasses = (question: any) => {
  const classes = []
  
  if (question.number === examStore.currentQuestion?.number) {
    classes.push('bg-primary text-primary-foreground ring-2 ring-primary/20')
  } else if (question.isAnswered) {
    classes.push('bg-success/20 text-success hover:bg-success/30')
  } else {
    classes.push('bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground')
  }
  
  return classes.join(' ')
}

// Methods
const selectAnswer = (optionId: string) => {
  examStore.selectAnswer(optionId)
}

const handleSubmitExam = async () => {
  const result = await examStore.submitExam()
  
  if (result.success) {
    toast({
      title: 'Ujian dikumpulkan',
      description: 'Jawaban Anda telah berhasil dikumpulkan',
      variant: 'success'
    })
    
    // Redirect ke hasil
    setTimeout(() => {
      router.push('/exam-results')
    }, 1500)
  } else {
    toast({
      title: 'Gagal mengumpulkan',
      description: 'Terjadi kesalahan saat mengumpulkan ujian',
      variant: 'destructive'
    })
  }
}

// Lifecycle
onMounted(async () => {
  const examId = parseInt(route.params.id as string)
  
  if (!examId) {
    router.push('/')
    return
  }

  // Coba load saved session dulu
  const hasSavedSession = examStore.loadSavedSession(examId)
  
  if (!hasSavedSession) {
    try {
      await examStore.initializeExam(examId)
    } catch (error) {
      toast({
        title: 'Gagal memuat ujian',
        description: 'Terjadi kesalahan saat memuat ujian',
        variant: 'destructive'
      })
      router.push('/')
    }
  } else {
    // State sudah dimuat dari localStorage, termasuk currentQuestionIndex
    console.log('Session restored to question:', examStore.currentQuestionIndex + 1)
  }
})

onUnmounted(() => {
  examStore.onUnmounted()
})
</script>

<style scoped>
/* Custom animations */
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
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

/* Smooth transitions */
.question-nav-item {
  transition: all 0.2s ease;
}
</style>