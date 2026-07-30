<script setup lang="ts">
import type { ContentNavigationItem } from "@nuxt/content";
import { mapContentNavigation } from "@nuxt/ui/utils/content";

const route = useRoute();

const navigation = inject<Ref<ContentNavigationItem[]>>("navigation");

const items = computed(() =>
  mapContentNavigation(
    navigation?.value.map((item) => ({ ...item, children: undefined })) ?? [],
  )?.map((item) => ({
    ...item,
    active: route.path.startsWith(item.to as string),
  })),
);
</script>

<template>
  <nav
    class="border-default/70 bg-default/88 sticky top-[var(--ui-header-height)] z-40 hidden h-12 border-b backdrop-blur-xl lg:block"
    aria-label="Primary navigation"
  >
    <UContainer class="flex h-full items-center justify-center">
      <UNavigationMenu
        :items="items"
        color="neutral"
        variant="link"
        highlight
        highlight-color="primary"
        :ui="{
          root: 'h-full items-center',
          list: 'h-full gap-0',
          item: 'h-full py-0',
          link: 'h-full rounded-none px-5 text-[0.8125rem] font-medium text-muted transition-colors duration-150 hover:text-highlighted data-[active=true]:text-highlighted active:bg-elevated/50 motion-reduce:transition-none',
          linkLeadingIcon: 'size-3.5',
          linkTrailingIcon: 'size-3.5',
          indicator: 'h-px rounded-none',
        }"
      />
    </UContainer>
  </nav>
</template>
