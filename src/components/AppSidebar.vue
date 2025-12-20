<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <div class="flex items-center gap-4">
        <div class="w-10 h-10 rounded-lg flex items-center justify-center">
          <img src="../assets/vue.svg" alt="IO" />
        </div>
        <div class="flex flex-col">
          <span class="font-bold text-sm">TU-SMK App</span>
          <span class="text-xs text-muted-foreground">v1.0.0</span>
        </div>
      </div>
      <div class="w-full border-t"></div>
    </SidebarHeader>

    <SidebarContent class="gap-0">
      <SidebarMenu>
        <SidebarMenuItem
          v-for="item in navMain"
          :key="item.title"
          class="mb-1 last:mb-0"
        >
          <!-- Menu Items tanpa children -->
          <div v-if="!item.items?.length">
            <SidebarMenuButton
              as-child
              :is-active="isItemActive(item)"
              class="w-full"
            >
              <RouterLink
                :to="item.url"
                class="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
              >
                <component :is="item.icon" class="w-4 h-4 shrink-0" />
                <span class="truncate">{{ item.title }}</span>
              </RouterLink>
            </SidebarMenuButton>
          </div>

          <!-- Menu Items dengan children -->
          <div v-else>
            <Collapsible
              v-model:open="openStates[item.title]"
              class="w-full"
            >
              <SidebarMenuButton
                as-child
                :is-active="isParentActive(item)"
                class="w-full"
              >
                <CollapsibleTrigger
                  class="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground group/collapsible"
                >
                  <component :is="item.icon" class="w-4 h-4 shrink-0" />
                  <span class="truncate flex-1 text-left">{{ item.title }}</span>
                  <ChevronRight
                    class="w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                  />
                </CollapsibleTrigger>
              </SidebarMenuButton>

              <CollapsibleContent>
                <SidebarGroupContent class="mt-1 ml-2">
                  <SidebarMenu class="space-y-1">
                    <SidebarMenuItem
                      v-for="childItem in item.items"
                      :key="childItem.title"
                    >
                      <TooltipProvider :delay-duration="300">
                        <Tooltip>
                          <TooltipTrigger as-child>
                            <SidebarMenuButton
                              as-child
                              :is-active="isChildActive(childItem)"
                              class="pl-4 py-1.5 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                            >
                              <RouterLink
                                :to="childItem.url"
                                class="flex items-center gap-2 w-full"
                              >
                                <component
                                  v-if="childItem.icon"
                                  :is="childItem.icon"
                                  class="w-3.5 h-3.5"
                                />
                                <span class="truncate">{{ childItem.title }}</span>
                              </RouterLink>
                            </SidebarMenuButton>
                          </TooltipTrigger>
                          <TooltipContent side="right" :side-offset="10">
                            <p class="text-sm font-medium">{{ childItem.title }}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarContent>

    <SidebarRail />
  </Sidebar>
</template>

<script setup lang="ts">
import type { SidebarProps } from "@/components/ui/sidebar"
import { ChevronRight, LayoutDashboard, Database, BookOpen, FileText } from "lucide-vue-next"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useRoute } from "vue-router"
import { computed, ref, watch } from "vue"

const props = defineProps<SidebarProps>()
const route = useRoute()

interface NavItem {
  title: string
  url: string
  icon: any
  items?: NavItem[]
}

const openStates = ref<Record<string, boolean>>({})

const navMain = computed<NavItem[]>(() => [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Pembayaran",
    url: "/pembayaran",
    icon: LayoutDashboard,
  },
  {
    title: "Data Master",
    url: "#",
    icon: Database,
    items: [
      { title: "Data User", url: "/#", icon: FileText },
      { title: "Data Unit Kantor", url: "/#", icon: FileText }
    ],
  },
  {
    title: "Accounting",
    url: "#",
    icon: BookOpen,
    items: [
      { title: "Data Kode Jurnal", url: "/#", icon: FileText },
      { title: "Data Perkiraan", url: "/#", icon: FileText }
    ],
  },
  {
    title: "Lap Accounting",
    url: "#",
    icon: FileText,
    items: [
      { title: "Lap Jurnal Transaksi", url: "/#", icon: FileText },
      { title: "Lap Buku Besar", url: "/#", icon: FileText },
      { title: "Lap Neraca (Skontro)", url: "#", icon: FileText },
    ],
  },
])

const isChildActive = (childItem: NavItem) => {
  return route.path === childItem.url
}

const isParentActive = (item: NavItem) => {
  return item.items?.some(child => isChildActive(child)) || false
}

const isItemActive = (item: NavItem) => {
  return route.path === item.url
}

watch(
  () => route.path,
  (currentPath) => {
    navMain.value.forEach(item => {
      if (item.items?.some(child => {
        return currentPath === child.url
      })) {
        openStates.value[item.title] = true
      }
    })
  },
  { immediate: true }
)

watch(
  () => route.path,
  (path) => {
    console.log('Current path:', path)
    console.log('Open states:', openStates.value)
  }
)
</script>