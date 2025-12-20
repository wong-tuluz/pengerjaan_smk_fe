<template>
  <header
    class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
  >
    <div class="flex h-14 bg-sidebar items-center px-4">
      <!-- Sidebar toggle -->
      <SidebarTrigger class="mr-4" />

      <div class="flex-1"></div>

      <!-- User dropdown -->
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" class="relative h-8 gap-2">
            <Avatar class="h-7 w-7">
              <AvatarFallback class="bg-blue-600 text-white text-xs">
                {{ getUserInitials() }}
              </AvatarFallback>
            </Avatar>
            <span class="hidden sm:inline-block text-sm font-medium">
              {{ username }}
            </span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" class="w-56">
          <DropdownMenuLabel class="font-normal">
            <div class="flex flex-col space-y-1">
              <p class="text-sm font-medium leading-none">{{ username }}</p>
              <p class="text-xs leading-none text-muted-foreground">
                {{ email }}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            @click="handleLogout"
            class="text-red-600 cursor-pointer"
          >
            <LogOut class="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRouter } from "vue-router"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { LogOut } from "lucide-vue-next"
import { useToast } from "@/hooks/use-toast"

const router = useRouter()
const { toast } = useToast()

// sementara dummy user
const username = computed(() => "John Doe")
const email = computed(() => "user@example.com")

function getUserInitials(): string {
  const names:any = username.value.split(" ")
  if (names.length >= 2) {
    return (names[0][0] + names[1][0]).toUpperCase()
  }
  return username.value.substring(0, 2).toUpperCase()
}

function handleLogout() {
  localStorage.removeItem("token")
  router.push("/login")

  toast({
    title: "Logged out",
    description: "You’ve been logged out successfully.",
    variant: "destructive",
  })
}
</script>
