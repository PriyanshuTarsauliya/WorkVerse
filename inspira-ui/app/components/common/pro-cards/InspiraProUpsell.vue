<template>
  <div class="py-5">
    <NuxtLink
      to="https://pro.inspira-ui.com"
      target="_blank"
      rel="noreferrer"
      aria-label="Explore Inspira UI Pro templates and sections"
      class="group border-info/40 bg-info/5 hover:bg-info/8 relative block overflow-hidden rounded-none border transition-colors duration-200 motion-reduce:transition-none"
    >
      <span class="bg-info pointer-events-none absolute inset-x-0 top-0 h-px opacity-80" />

      <div class="relative p-4">
        <div class="flex items-center justify-between gap-3">
          <div
            class="border-info/35 bg-info/10 text-info rounded-none border px-2 py-1 font-mono text-[0.6rem] font-bold tracking-[0.16em] uppercase"
          >
            Pro
          </div>
        </div>

        <div class="text-highlighted mt-4 text-lg leading-6 font-semibold tracking-[-0.03em]">
          Get Inspira UI Pro
        </div>
        <p class="text-muted mt-2 text-sm leading-5">
          Ship faster with ready-to-use Vue and Nuxt templates, sections, and page blocks.
        </p>

        <div
          class="bg-info mt-5 flex h-9 items-center justify-between px-3 text-sm font-semibold text-white"
        >
          <span>Explore Pro</span>
          <span
            class="flex size-6 items-center justify-center transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
          >
            <UIcon
              name="i-lucide-arrow-up-right"
              class="size-3.5"
            />
          </span>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>
