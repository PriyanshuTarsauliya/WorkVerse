<template>
  <div class="hidden w-full max-w-xl lg:block">
    <UContentSearchButton
      :collapsed="false"
      label="Search documentation"
      variant="subtle"
      size="sm"
      class="group border-default/70 bg-elevated/25 hover:bg-elevated/50 h-10 w-full justify-start rounded-none border px-4 text-sm transition-[transform,background-color,border-color] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.99] motion-reduce:transition-none"
      :ui="{
        leadingIcon:
          'size-4 text-muted transition-colors duration-300 group-hover:text-highlighted',
        label: 'text-muted font-normal',
        trailing: 'ms-auto hidden items-center lg:flex',
      }"
    >
      <template #trailing>
        <span
          class="border-default/70 text-dimmed border-l py-0.5 pl-3 font-mono text-[0.65rem] font-medium tracking-[0.08em]"
        >
          ⌘ K
        </span>
      </template>
    </UContentSearchButton>
  </div>
</template>
