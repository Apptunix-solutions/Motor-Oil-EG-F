<script setup lang="ts">
import {
  Bell,
  ChevronRight,
  Heart,
  LogOut,
  Package,
  Settings,
  ShieldCheck,
  UserRound,
} from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { formatPrice } from '@/lib/utils'
import { useOrdersStore } from '@/stores/orders'
import { useUserStore } from '@/stores/user'
import { useVehicleStore } from '@/stores/vehicle'
import { useWishlistStore } from '@/stores/wishlist'

const user = useUserStore()
const vehicle = useVehicleStore()
const orders = useOrdersStore()
const wishlist = useWishlistStore()
const menu = [
  { label: 'Orders & tracking', icon: Package },
  { label: 'Saved products', icon: Heart },
  { label: 'Notifications', icon: Bell },
  { label: 'Settings', icon: Settings },
]
</script>

<template>
  <div class="pb-12 pt-10 sm:pt-14">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-[#F5A710]">Your garage</p>
        <h1 class="display-font mt-2 text-4xl font-bold tracking-[-0.06em] text-white">
          Hey, {{ user.preferences.name.trim().split(/\s+/)[0] || 'there'
          }}<span class="text-[#F5A710]">.</span>
        </h1>
      </div>
      <div class="grid h-12 w-12 place-items-center rounded-2xl bg-[#F5A710] text-[#0B0D10]">
        <UserRound :size="21" />
      </div>
    </div>
    <div class="mt-8 grid gap-5 lg:grid-cols-[1fr_1fr]">
      <div class="rounded-[24px] border border-[#58D5E6]/20 bg-[#58D5E6]/[0.06] p-6">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-[#58D5E6]">
              Your vehicle
            </p>
            <h2 v-if="vehicle.vehicle" class="display-font mt-2 text-2xl font-bold text-white">
              {{ vehicle.vehicle.make }} {{ vehicle.vehicle.model }}
            </h2>
            <h2 v-else class="display-font mt-2 text-2xl font-bold text-white">
              Build your garage
            </h2>
            <p v-if="vehicle.vehicle" class="mt-1 text-xs text-[#8E96A3]">
              {{ vehicle.vehicle.year }} · {{ vehicle.vehicle.engine }}
            </p>
            <p v-else class="mt-2 text-sm text-[#8E96A3]">
              Get recommendations made for your engine.
            </p>
          </div>
          <div class="grid h-10 w-10 place-items-center rounded-xl bg-[#58D5E6]/10 text-[#58D5E6]">
            <ShieldCheck :size="20" />
          </div>
        </div>
        <RouterLink
          to="/garage/add"
          class="mt-6 flex items-center gap-1 text-xs font-bold text-white hover:text-[#58D5E6]"
          >{{ vehicle.vehicle ? 'Edit vehicle' : 'Add your vehicle' }} <ChevronRight :size="14"
        /></RouterLink>
      </div>
      <div class="rounded-[24px] border border-white/[0.08] bg-[#14171C] p-6">
        <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8E96A3]">
          Account snapshot
        </p>
        <div class="mt-5 flex items-end justify-between">
          <div>
            <p class="display-font text-4xl font-bold text-white">{{ orders.orders.length }}</p>
            <p class="mt-1 text-xs text-[#8E96A3]">orders this year</p>
          </div>
          <div class="text-right">
            <p class="display-font text-4xl font-bold text-white">{{ wishlist.count }}</p>
            <p class="mt-1 text-xs text-[#8E96A3]">saved products</p>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="orders.orders.length"
      class="mt-8 rounded-[24px] border border-white/[0.08] bg-[#14171C] p-5"
    >
      <div class="flex items-center justify-between">
        <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8E96A3]">Latest order</p>
        <span class="rounded-full bg-[#F5A710]/10 px-2 py-1 text-[10px] font-bold text-[#F5A710]">{{
          orders.orders[0].status
        }}</span>
      </div>
      <div class="mt-4 flex items-center justify-between">
        <div>
          <p class="text-sm font-semibold text-white">{{ orders.orders[0].id }}</p>
          <p class="mt-1 text-xs text-[#8E96A3]">
            {{ orders.orders[0].itemCount }} items ·
            {{ new Date(orders.orders[0].createdAt).toLocaleDateString() }}
          </p>
        </div>
        <strong class="text-sm text-white">{{ formatPrice(orders.orders[0].total) }}</strong>
      </div>
    </div>
    <div class="mt-8 overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#14171C]">
      <button
        v-for="item in menu"
        :key="item.label"
        class="flex w-full items-center gap-4 border-b border-white/[0.07] px-5 py-4 text-left last:border-0 hover:bg-white/[0.03]"
      >
        <span class="grid h-9 w-9 place-items-center rounded-lg bg-white/[0.05] text-[#A8AFBA]"
          ><component :is="item.icon" :size="17" /></span
        ><span class="flex-1 text-sm font-semibold text-white">{{ item.label }}</span
        ><ChevronRight :size="16" class="text-[#68707D]" />
      </button>
    </div>
    <button
      class="mt-6 flex items-center gap-2 text-xs font-semibold text-[#8E96A3] hover:text-white"
    >
      <LogOut :size="15" /> Sign out
    </button>
  </div>
</template>
