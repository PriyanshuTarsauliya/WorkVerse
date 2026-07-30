export function useDocsPageUi() {
  return {
    header: {
      root: "border-b border-default/70 py-12 sm:py-16",
      container: "space-y-6",
      wrapper: "flex flex-col gap-6 md:flex-row md:items-start md:justify-between",
      headline: "font-mono text-[0.65rem] font-medium tracking-[0.24em] text-primary uppercase",
      title:
        "max-w-3xl text-4xl font-medium leading-[0.98] tracking-tight text-highlighted sm:text-6xl",
      description: "max-w-2xl text-base leading-7 text-muted sm:text-[1.0625rem]",
      links: "flex flex-wrap items-center gap-px",
    },
    bodyClass: "mt-12 space-y-16 pb-24 sm:mt-16",
    badge: {
      base: "rounded-none border border-default/70 bg-elevated/35 px-2.5 py-1 font-mono text-[0.62rem] font-medium tracking-[0.16em] uppercase",
    },
    headerLinkButton:
      "rounded-none border border-default/70 px-3 transition-[background-color,color] duration-150 hover:bg-elevated/60 motion-reduce:transition-none",
    footerActions:
      "flex items-center gap-px border border-default/70 bg-elevated/25 p-1 text-sm text-muted",
    footerButton: {
      leadingIcon: "size-3.5",
    },
    surround: {
      root: "grid grid-cols-1 gap-px border border-default/70 bg-default sm:grid-cols-2",
      link: "group rounded-none bg-default px-5 py-6 transition-colors duration-200 hover:bg-elevated/55 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/50 motion-reduce:transition-none",
      linkLeading:
        "mb-5 inline-flex size-8 items-center justify-center border border-default/70 bg-elevated/40 transition-colors duration-200 group-hover:border-primary/50 group-hover:bg-primary/10 motion-reduce:transition-none",
      linkLeadingIcon:
        "size-3.5 text-muted transition-[color,translate] duration-200 group-hover:translate-x-0.5 group-hover:text-primary motion-reduce:transition-none",
      linkTitle: "text-sm font-semibold text-highlighted",
      linkDescription: "mt-1.5 line-clamp-2 text-sm leading-6 text-muted",
    },
    toc: {
      root: "bg-transparent lg:bg-transparent",
      trigger: "font-mono text-[0.65rem] font-medium tracking-[0.18em] uppercase",
      list: "space-y-px",
      listWithChildren: "ms-2 border-s border-default/70 ps-2",
      link: "rounded-none border-s border-transparent px-2.5 py-1.5 text-[0.8125rem] transition-[border-color,background-color,color] duration-150 hover:border-default hover:bg-elevated/40 motion-reduce:transition-none",
      indicator: "w-px rounded-none bg-primary",
      bottom: "hidden border-t border-default/70 pt-6 lg:flex lg:flex-col lg:gap-0",
    },
  } as const;
}
