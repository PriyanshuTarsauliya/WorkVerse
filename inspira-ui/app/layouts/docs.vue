<script lang="ts" setup>
import "dialkit/styles.css";

const route = useRoute();
const isRoot = isRootPage();
</script>

<template>
  <UMain class="bg-default relative -mt-16 pt-16">
    <ComponentStatusMarquee inline />
    <AppHeaderNav />
    <UContainer class="relative">
      <UPage :key="route.fullPath">
        <template #left>
          <UPageAside
            v-if="!isRoot"
            class="lg:top-[calc(var(--ui-header-height)+3rem)] lg:max-h-[calc(100vh-var(--ui-header-height)-3rem)]"
          >
            <DocsAsideLeftTop />
            <DocsAsideLeftBody />
          </UPageAside>
          <UPageAside
            v-else
            class="lg:top-[calc(var(--ui-header-height)+3rem)] lg:max-h-[calc(100vh-var(--ui-header-height)-3rem)]"
          >
            <DocsAsideLeftTop />
          </UPageAside>
        </template>
        <slot />
      </UPage>
    </UContainer>
  </UMain>
</template>
