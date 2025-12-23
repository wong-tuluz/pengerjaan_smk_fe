import type { ExamSession, Question, SubmitExamPayload } from '@/types/IExam'

// Mock data dengan berbagai tipe soal
const mockExams: Record<number, ExamSession> = {
  1: {
    id: 1,
    title: 'UAS Semester Ganjil 2024',
    totalQuestions: 15,
    answeredCount: 0,
    timeRemaining: 0,
    studentName: '',
    studentNis: '',
    isAutoSaving: false,
    submitted: false,
    questions: [
      // Soal Pilihan Ganda (Single Choice)
      {
        id: 1,
        number: 1,
        type: 'single',
        text: 'Ibukota Indonesia adalah?',
        options: [
          { id: 'A', text: 'Jakarta' },
          { id: 'B', text: 'Bandung' },
          { id: 'C', text: 'Surabaya' },
          { id: 'D', text: 'Medan' }
        ],
        isAnswered: false
      },
      {
        id: 2,
        number: 2,
        type: 'single',
        text: 'Siapa presiden pertama Indonesia?',
        options: [
          { id: 'A', text: 'Soekarno' },
          { id: 'B', text: 'Soeharto' },
          { id: 'C', text: 'B.J. Habibie' },
          { id: 'D', text: 'Abdurrahman Wahid' }
        ],
        isAnswered: false
      },
      {
        id: 3,
        number: 3,
        type: 'single',
        text: 'Pancasila terdiri dari berapa sila?',
        options: [
          { id: 'A', text: '3' },
          { id: 'B', text: '4' },
          { id: 'C', text: '5' },
          { id: 'D', text: '6' }
        ],
        isAnswered: false
      },
      
      // Soal Multiple Choice (Checkbox)
      {
        id: 4,
        number: 4,
        type: 'multiple',
        text: 'Pilih provinsi yang berada di Pulau Jawa! (Pilih semua yang benar)',
        options: [
          { id: 'A', text: 'DKI Jakarta' },
          { id: 'B', text: 'Bali' },
          { id: 'C', text: 'Jawa Barat' },
          { id: 'D', text: 'Jawa Tengah' },
          { id: 'E', text: 'Sumatera Utara' }
        ],
        isAnswered: false
      },
      {
        id: 5,
        number: 5,
        type: 'multiple',
        text: 'Manakah yang termasuk bahasa pemrograman? (Pilih semua yang benar)',
        options: [
          { id: 'A', text: 'Python' },
          { id: 'B', text: 'HTML' },
          { id: 'C', text: 'JavaScript' },
          { id: 'D', text: 'CSS' },
          { id: 'E', text: 'TypeScript' }
        ],
        isAnswered: false
      },
      {
        id: 6,
        number: 6,
        type: 'single',
        text: '2 + 2 = ?',
        options: [
          { id: 'A', text: '3' },
          { id: 'B', text: '4' },
          { id: 'C', text: '5' },
          { id: 'D', text: '6' }
        ],
        isAnswered: false
      },
      {
        id: 7,
        number: 7,
        type: 'multiple',
        text: 'Pilih bilangan prima berikut! (Pilih semua yang benar)',
        options: [
          { id: 'A', text: '2' },
          { id: 'B', text: '4' },
          { id: 'C', text: '5' },
          { id: 'D', text: '7' },
          { id: 'E', text: '9' }
        ],
        isAnswered: false
      },
      {
        id: 8,
        number: 8,
        type: 'single',
        text: 'Siapa penemu lampu pijar?',
        options: [
          { id: 'A', text: 'Thomas Edison' },
          { id: 'B', text: 'Nikola Tesla' },
          { id: 'C', text: 'Albert Einstein' },
          { id: 'D', text: 'Isaac Newton' }
        ],
        isAnswered: false
      },
      {
        id: 9,
        number: 9,
        type: 'multiple',
        text: 'Manakah yang merupakan negara ASEAN? (Pilih semua yang benar)',
        options: [
          { id: 'A', text: 'Indonesia' },
          { id: 'B', text: 'Malaysia' },
          { id: 'C', text: 'China' },
          { id: 'D', text: 'Thailand' },
          { id: 'E', text: 'India' }
        ],
        isAnswered: false
      },
      {
        id: 10,
        number: 10,
        type: 'single',
        text: 'Berapa jumlah provinsi di Indonesia saat ini?',
        options: [
          { id: 'A', text: '32' },
          { id: 'B', text: '34' },
          { id: 'C', text: '36' },
          { id: 'D', text: '38' }
        ],
        isAnswered: false
      },
      {
        id: 11,
        number: 11,
        type: 'multiple',
        text: 'Pilih planet dalam sistem tata surya! (Pilih semua yang benar)',
        options: [
          { id: 'A', text: 'Mars' },
          { id: 'B', text: 'Pluto' },
          { id: 'C', text: 'Venus' },
          { id: 'D', text: 'Jupiter' },
          { id: 'E', text: 'Bulan' }
        ],
        isAnswered: false
      },
      {
        id: 12,
        number: 12,
        type: 'single',
        text: 'Apa kepanjangan dari HTML?',
        options: [
          { id: 'A', text: 'Hyper Text Markup Language' },
          { id: 'B', text: 'High Tech Modern Language' },
          { id: 'C', text: 'Home Tool Markup Language' },
          { id: 'D', text: 'Hyperlinks and Text Markup Language' }
        ],
        isAnswered: false
      },
      {
        id: 13,
        number: 13,
        type: 'multiple',
        text: 'Manakah yang termasuk framework JavaScript? (Pilih semua yang benar)',
        options: [
          { id: 'A', text: 'React' },
          { id: 'B', text: 'Django' },
          { id: 'C', text: 'Vue' },
          { id: 'D', text: 'Angular' },
          { id: 'E', text: 'Laravel' }
        ],
        isAnswered: false
      },
      {
        id: 14,
        number: 14,
        type: 'single',
        text: 'Berapa hasil dari 10 x 5?',
        options: [
          { id: 'A', text: '40' },
          { id: 'B', text: '45' },
          { id: 'C', text: '50' },
          { id: 'D', text: '55' }
        ],
        isAnswered: false
      },
      {
        id: 15,
        number: 15,
        type: 'multiple',
        text: 'Pilih warna primer! (Pilih semua yang benar)',
        options: [
          { id: 'A', text: 'Merah' },
          { id: 'B', text: 'Hijau' },
          { id: 'C', text: 'Kuning' },
          { id: 'D', text: 'Biru' },
          { id: 'E', text: 'Ungu' }
        ],
        isAnswered: false
      }
    ]
  },
  2: {
    id: 2,
    title: 'Try Out UTBK 2025',
    totalQuestions: 5,
    answeredCount: 0,
    timeRemaining: 0,
    studentName: '',
    studentNis: '',
    isAutoSaving: false,
    submitted: false,
    questions: [
      {
        id: 1,
        number: 1,
        type: 'single',
        text: '1 + 1 = ?',
        options: [
          { id: 'A', text: '1' },
          { id: 'B', text: '2' },
          { id: 'C', text: '3' },
          { id: 'D', text: '4' }
        ],
        isAnswered: false
      },
      {
        id: 2,
        number: 2,
        type: 'multiple',
        text: 'Pilih bilangan genap! (Pilih semua yang benar)',
        options: [
          { id: 'A', text: '2' },
          { id: 'B', text: '3' },
          { id: 'C', text: '4' },
          { id: 'D', text: '5' },
          { id: 'E', text: '6' }
        ],
        isAnswered: false
      },
      {
        id: 3,
        number: 3,
        type: 'single',
        text: 'Apa ibu kota Jepang?',
        options: [
          { id: 'A', text: 'Seoul' },
          { id: 'B', text: 'Tokyo' },
          { id: 'C', text: 'Beijing' },
          { id: 'D', text: 'Bangkok' }
        ],
        isAnswered: false
      },
      {
        id: 4,
        number: 4,
        type: 'multiple',
        text: 'Manakah yang termasuk buah? (Pilih semua yang benar)',
        options: [
          { id: 'A', text: 'Apel' },
          { id: 'B', text: 'Wortel' },
          { id: 'C', text: 'Pisang' },
          { id: 'D', text: 'Tomat' },
          { id: 'E', text: 'Kentang' }
        ],
        isAnswered: false
      },
      {
        id: 5,
        number: 5,
        type: 'single',
        text: 'Berapa hari dalam 1 minggu?',
        options: [
          { id: 'A', text: '5' },
          { id: 'B', text: '6' },
          { id: 'C', text: '7' },
          { id: 'D', text: '8' }
        ],
        isAnswered: false
      }
    ]
  }
}

export const examService = {
  // Get exam data by ID
  async getExamById(examId: number): Promise<Omit<ExamSession, 'submitted' | 'answeredCount' | 'timeRemaining' | 'isAutoSaving'>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const exam = mockExams[examId]
        if (!exam) {
          reject(new Error('Exam not found'))
          return
        }
        
        resolve({
          id: exam.id,
          title: exam.title,
          totalQuestions: exam.totalQuestions,
          questions: exam.questions,
          studentName: 'Ahmad Rizki Pratama',
          studentNis: '2024001'
        })
      }, 300)
    })
  },

  // Submit exam answers
  async submitExam(payload: SubmitExamPayload): Promise<{ success: boolean; score?: number }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Exam submitted:', payload)
        
        // Simulasi scoring (dummy logic)
        const score = Math.floor(Math.random() * 100)
        
        resolve({
          success: true,
          score
        })
      }, 1000)
    })
  },

  // Get exam results
  async getExamResults(examId: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          examId,
          score: 85,
          totalQuestions: 10,
          correctAnswers: 8,
          timeSpent: '01:25:30',
          submittedAt: new Date().toISOString()
        })
      }, 500)
    })
  }
}