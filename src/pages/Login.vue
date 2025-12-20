<template>
  <div class="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
    <div class="w-full max-w-sm">
      <div class="flex flex-col gap-6">
        <!-- Form -->
        <form @submit.prevent="handleLogin" class="flex flex-col gap-6">
          <Card>
            <CardContent class="py-6">
                <!-- Logo & Title -->
                <div class="flex flex-col items-center gap-2 text-center pb-2">
                    <a href="#" class="flex flex-col items-center gap-2 font-medium">
                        <img src="../assets/vue.svg" alt="Jurnal App" class="h-20" />
                        <span class="sr-only">SMK PAKEM</span>
                    </a>
                </div>
              <div class="text-destructive text-center">Hello Gais</div>
              <div class="grid gap-6">
                <!-- Username -->
                <div class="grid gap-2">
                  <Label for="username">Username</Label>
                  <Input
                    id="username"
                    v-model="formData.username"
                    type="text"
                    placeholder="Masukkan username"
                    :class="{ 'border-destructive': errors.username }"
                    :disabled="submitting"
                    autocomplete="username"
                    required
                  />
                  <p v-if="errors.username" class="text-sm text-destructive">
                    {{ errors.username }}
                  </p>
                </div>

                <!-- Password -->
                <div class="grid gap-2">
                  <div class="flex items-center">
                    <Label for="password">Password</Label>
                    <!-- <a
                      href="#"
                      class="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Lupa password?
                    </a> -->
                  </div>
                  <div class="relative">
                    <Input
                      id="password"
                      v-model="formData.password"
                      :type="showPassword ? 'text' : 'password'"
                      placeholder="Masukkan password"
                      :class="{ 'border-destructive': errors.password }"
                      :disabled="submitting"
                      autocomplete="current-password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      class="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      @click="showPassword = !showPassword"
                      :disabled="submitting"
                      tabindex="-1"
                    >
                      <Eye v-if="!showPassword" class="h-4 w-4 text-muted-foreground" />
                      <EyeOff v-else class="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                  <p v-if="errors.password" class="text-sm text-destructive">
                    {{ errors.password }}
                  </p>
                </div>

                <!-- Submit Button -->
                <Button type="submit" class="w-full bg-blue-600 hover:bg-blue-700" :disabled="submitting">
                  <div
                    v-if="submitting"
                    class="h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin"
                  ></div>
                  {{ submitting ? 'Masuk...' : 'Masuk' }}
                </Button>
              </div>
            </CardContent>
          </Card>

          <!-- Footer Text -->
          <div class="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
            Belum Punya Akun ? <a href="#" class="font-bold">Hubungi Bagian Pusat</a>.
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { router } from '@/router'

const { toast } = useToast()

const submitting = ref(false)
const showPassword = ref(false)

const formData = reactive({
  username: '',
  password: ''
})

const errors = reactive({
  username: '',
  password: ''
})

function validateForm(): boolean {
  let isValid = true

  // Reset errors
  errors.username = ''
  errors.password = ''

  // Validate username
  if (!formData.username.trim()) {
    errors.username = 'Username wajib diisi'
    isValid = false
  } else if (formData.username.length < 4) {
    errors.username = 'Username minimal 4 karakter'
    isValid = false
  }

  // Validate password
  if (!formData.password.trim()) {
    errors.password = 'Password wajib diisi'
    isValid = false
  } else if (formData.password.length < 6) {
    errors.password = 'Password minimal 6 karakter'
    isValid = false
  }

  return isValid
}

async function handleLogin() {
  if (!validateForm()) {
    return
  }

  submitting.value = true

  try {
    // TODO: Replace with actual API call
    // const response = await login(formData.username, formData.password)
    // localStorage.setItem('token', response.token)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Dummy validation
    if (formData.username === 'admin' && formData.password === '123456') {
      toast({
        title: 'Login Berhasil',
        description: 'Selamat datang kembali!'
      })
      
      // Redirect to dashboard
      router.push('/dashboard')
    } else {
      toast({
        title: 'Login Gagal',
        description: 'Username atau password salah',
        variant: 'destructive'
      })
    }
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Terjadi kesalahan saat login',
      variant: 'destructive'
    })
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
/* Optional: Add custom styles if needed */
</style>