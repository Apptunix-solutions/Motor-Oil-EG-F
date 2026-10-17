<script setup lang="ts">
import {
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
} from 'reka-ui'
import { ChevronDown } from 'lucide-vue-next'

defineProps<{ items: Array<{ value: string; title: string; content: string }> }>()
</script>

<template>
  <AccordionRoot type="single" collapsible class="space-y-2">
    <AccordionItem
      v-for="item in items"
      :key="item.value"
      :value="item.value"
      class="overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--panel)]"
    >
      <AccordionHeader
        ><AccordionTrigger
          class="group flex w-full items-center justify-between px-4 py-4 text-start text-sm font-semibold text-[var(--text)] outline-none transition hover:text-[#E8A020] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#E8A020]/50"
          ><span>{{ item.title }}</span
          ><ChevronDown
            :size="16"
            class="text-[#E8A020] transition-transform duration-200 group-data-[state=open]:rotate-180" /></AccordionTrigger
      ></AccordionHeader>
      <AccordionContent
        class="border-t border-[var(--line)] px-4 py-4 text-xs leading-relaxed text-[var(--muted)]"
        >{{ item.content }}</AccordionContent
      >
    </AccordionItem>
  </AccordionRoot>
</template>
