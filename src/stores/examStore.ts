import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ExamState, ExamSession, Question, SubmitExamPayload, SavedExamState } from '@/types/IExam'
import { examService } from '@/services/examService'

export const useExamStore = defineStore('exam', () => {
  // State
  const session = ref<ExamSession | null>(null)
  const currentQuestionIndex = ref(0)
  const lastSavedAt = ref<string | null>(null)
  const timerInterval = ref<number | null>(null)
  
  // Timestamp untuk mencegah time drift
  const examStartTime = ref<number | null>(null)
  const examDuration = ref<number>(90 * 60) // 90 menit dalam detik

  // Getters
  const currentQuestion = computed(() => {
    if (!session.value) return null
    return session.value.questions[currentQuestionIndex.value]
  })

  const formattedTime = computed(() => {
    if (!session.value) return '00:00:00'
    
    const hours = Math.floor(session.value.timeRemaining / 3600)
    const minutes = Math.floor((session.value.timeRemaining % 3600) / 60)
    const seconds = session.value.timeRemaining % 60
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  })

  const totalAnswered = computed(() => {
    if (!session.value) return 0
    return session.value.questions.filter(q => q.isAnswered).length
  })

  // Helper: Calculate remaining time based on start timestamp
  const calculateTimeRemaining = (): number => {
    if (!examStartTime.value) return examDuration.value
    
    const now = Date.now()
    const elapsedSeconds = Math.floor((now - examStartTime.value) / 1000)
    const remaining = Math.max(0, examDuration.value - elapsedSeconds)
    
    return remaining
  }

  // Actions
  const initializeExam = async (examId: number) => {
    try {
      // Coba load saved session dulu (termasuk index dan timestamp)
      const savedState = loadSavedState(examId)
      if (savedState) {
        session.value = savedState.session
        currentQuestionIndex.value = savedState.currentQuestionIndex
        lastSavedAt.value = savedState.lastSavedAt
        examStartTime.value = savedState.examStartTime
        examDuration.value = savedState.examDuration
        
        // Recalculate time berdasarkan timestamp
        if (session.value) {
          session.value.timeRemaining = calculateTimeRemaining()
        }
        
        if (session.value && !session.value.submitted) {
          startTimer()
          return
        }
      }
      
      // Buat session baru
      const examData = await examService.getExamById(examId)
      
      // Set start time untuk session baru
      examStartTime.value = Date.now()
      examDuration.value = 90 * 60
      
      session.value = {
        ...examData,
        answeredCount: 0,
        timeRemaining: examDuration.value,
        isAutoSaving: false,
        submitted: false,
        studentName: examData.studentName || 'Ahmad Rizki Pratama',
        studentNis: examData.studentNis || '2024001'
      }
      
      currentQuestionIndex.value = 0
      saveToLocalStorage()
      startTimer()
      
    } catch (error) {
      console.error('Failed to initialize exam:', error)
      throw error
    }
  }

  // Method untuk save complete state (dengan timestamp)
  const saveToLocalStorage = () => {
    if (!session.value || !examStartTime.value) return
    
    const stateToSave: SavedExamState & { 
      examStartTime: number
      examDuration: number 
    } = {
      session: session.value,
      currentQuestionIndex: currentQuestionIndex.value,
      lastSavedAt: new Date().toISOString(),
      examStartTime: examStartTime.value,
      examDuration: examDuration.value
    }
    
    localStorage.setItem(`exam_state_${session.value.id}`, JSON.stringify(stateToSave))
  }

  // Method untuk load complete state (dengan timestamp)
  const loadSavedState = (examId: number): (SavedExamState & { 
    examStartTime: number
    examDuration: number 
  }) | null => {
    const saved = localStorage.getItem(`exam_state_${examId}`)
    if (!saved) return null
    
    try {
      const parsed = JSON.parse(saved) as SavedExamState & { 
        examStartTime: number
        examDuration: number 
      }
      
      // Validasi data
      if (!parsed.session || parsed.session.submitted) {
        return null
      }
      
      // Validasi timestamp ada
      if (!parsed.examStartTime || !parsed.examDuration) {
        console.warn('Missing timestamp data, clearing saved state')
        localStorage.removeItem(`exam_state_${examId}`)
        return null
      }
      
      // Validasi waktu belum expired
      const now = Date.now()
      const elapsedSeconds = Math.floor((now - parsed.examStartTime) / 1000)
      
      // Jika waktu ujian sudah habis
      if (elapsedSeconds >= parsed.examDuration) {
        console.warn('Exam time expired')
        localStorage.removeItem(`exam_state_${examId}`)
        return null
      }
      
      // Validasi last saved tidak lebih dari 24 jam
      const savedTime = new Date(parsed.lastSavedAt).getTime()
      const hoursDiff = (now - savedTime) / (1000 * 60 * 60)
      
      if (hoursDiff > 24) {
        localStorage.removeItem(`exam_state_${examId}`)
        return null
      }
      
      return parsed
    } catch (error) {
      console.error('Failed to parse saved state:', error)
      localStorage.removeItem(`exam_state_${examId}`)
      return null
    }
  }

  // Select answer method - UPDATED untuk handle single & multiple
  const selectAnswer = (optionId: string) => {
    if (!session.value || !currentQuestion.value) return
    
    const question = session.value.questions[currentQuestionIndex.value]
    if (!question) return // Type safety check
    
    if (question.type === 'single') {
      // Single choice - ganti jawaban
      question.selectedAnswer = optionId
      question.isAnswered = true
    } else if (question.type === 'multiple') {
      // Multiple choice - toggle checkbox
      if (!question.selectedAnswers) {
        question.selectedAnswers = []
      }
      
      const index = question.selectedAnswers.indexOf(optionId)
      if (index > -1) {
        // Sudah dipilih, hapus
        question.selectedAnswers.splice(index, 1)
      } else {
        // Belum dipilih, tambah
        question.selectedAnswers.push(optionId)
      }
      
      // Set isAnswered jika minimal 1 dipilih
      question.isAnswered = question.selectedAnswers.length > 0
    }
    
    // Update answered count
    session.value.answeredCount = session.value.questions.filter(q => q.isAnswered).length
    
    // Auto save
    autoSave()
  }

  // Helper: Check if option is selected
  const isOptionSelected = (optionId: string): boolean => {
    if (!currentQuestion.value) return false
    
    if (currentQuestion.value.type === 'single') {
      return currentQuestion.value.selectedAnswer === optionId
    } else {
      return currentQuestion.value.selectedAnswers?.includes(optionId) || false
    }
  }

  // Navigation methods
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex.value > 0) {
      currentQuestionIndex.value--
      saveToLocalStorage()
    }
  }

  const goToNextQuestion = () => {
    if (!session.value) return
    
    if (currentQuestionIndex.value < session.value.totalQuestions - 1) {
      currentQuestionIndex.value++
      saveToLocalStorage()
    }
  }

  const goToQuestion = (index: number) => {
    if (!session.value) return
    
    if (index >= 0 && index < session.value.totalQuestions) {
      currentQuestionIndex.value = index
      saveToLocalStorage()
    }
  }

  // Auto save
  const autoSave = async () => {
    if (!session.value) return
    
    session.value.isAutoSaving = true
    saveToLocalStorage()
    
    setTimeout(() => {
      if (session.value) {
        session.value.isAutoSaving = false
        lastSavedAt.value = new Date().toISOString()
      }
    }, 500)
  }

  // Timer - menggunakan timestamp untuk akurasi
  const startTimer = () => {
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
    }
    
    timerInterval.value = window.setInterval(() => {
      if (!session.value || !examStartTime.value) return
      
      // Recalculate time berdasarkan timestamp asli
      const remaining = calculateTimeRemaining()
      session.value.timeRemaining = remaining
      
      if (remaining > 0) {
        // Auto save setiap 30 detik
        if (remaining % 30 === 0) {
          saveToLocalStorage()
        }
      } else {
        // Waktu habis
        session.value.timeRemaining = 0
        clearInterval(timerInterval.value!)
        submitExam()
      }
    }, 1000)
  }

  // Submit exam - UPDATED untuk handle kedua tipe
  const submitExam = async () => {
    if (!session.value || session.value.submitted) return { success: false }
    
    // Hentikan timer
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
      timerInterval.value = null
    }
    
    try {
      // Calculate actual time spent
      const timeSpent = examStartTime.value 
        ? examDuration.value - calculateTimeRemaining()
        : examDuration.value - session.value.timeRemaining
      
      const payload: SubmitExamPayload = {
        examId: session.value.id,
        answers: session.value.questions
          .filter(q => q.isAnswered)
          .map(q => {
            if (q.type === 'single') {
              return {
                questionId: q.id,
                type: 'single',
                selectedAnswer: q.selectedAnswer!,
                answeredAt: new Date().toISOString()
              }
            } else {
              return {
                questionId: q.id,
                type: 'multiple',
                selectedAnswers: q.selectedAnswers!,
                answeredAt: new Date().toISOString()
              }
            }
          }),
        totalTimeSpent: timeSpent
      }
      
      // Kirim ke server
      await examService.submitExam(payload)
      
      // Update status
      session.value.submitted = true
      
      // Hapus dari localStorage
      localStorage.removeItem(`exam_state_${session.value.id}`)
      
      // Clear state
      resetExam()
      
      return { success: true }
      
    } catch (error) {
      console.error('Failed to submit exam:', error)
      return { success: false, error }
    }
  }

  // Load saved session (for backward compatibility)
  const loadSavedSession = (examId: number) => {
    const savedState = loadSavedState(examId)
    if (savedState) {
      session.value = savedState.session
      currentQuestionIndex.value = savedState.currentQuestionIndex
      lastSavedAt.value = savedState.lastSavedAt
      examStartTime.value = savedState.examStartTime
      examDuration.value = savedState.examDuration
      
      // Recalculate time berdasarkan timestamp
      if (session.value) {
        session.value.timeRemaining = calculateTimeRemaining()
      }
      
      startTimer()
      return true
    }
    return false
  }

  // Reset
  const resetExam = () => {
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
      timerInterval.value = null
    }
    
    session.value = null
    currentQuestionIndex.value = 0
    lastSavedAt.value = null
    examStartTime.value = null
    examDuration.value = 90 * 60
  }

  // Lifecycle
  const onUnmounted = () => {
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
    }
  }

  return {
    // State
    session,
    currentQuestionIndex,
    lastSavedAt,
    
    // Getters
    currentQuestion,
    formattedTime,
    totalAnswered,
    
    // Actions
    initializeExam,
    selectAnswer,
    isOptionSelected,
    goToPreviousQuestion,
    goToNextQuestion,
    goToQuestion,
    submitExam,
    resetExam,
    loadSavedSession,
    onUnmounted,
    autoSave
  }
})