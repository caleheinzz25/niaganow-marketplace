import { createFileRoute } from "@tanstack/solid-router";
import createEmblaCarousel from "embla-carousel-solid";
import { createSignal, For, onCleanup, onMount } from "solid-js";

export const Route = createFileRoute("/observer")({
  component: RouteComponent,
});

function useInView(ref: () => HTMLElement | undefined, callback: () => void) {
  let observer: IntersectionObserver;

  onMount(() => {
    if (ref()) {
      observer = new IntersectionObserver(
        ([entry]) => entry.isIntersecting && callback(),
        { rootMargin: "0px", threshold: 0 }
      );
      observer.observe(ref()!);
    }
  });

  onCleanup(() => observer?.disconnect());
}

function RouteComponent() {
  let loaderRef: HTMLDivElement | undefined;
  const [items, setItems] = createSignal<string[]>(["One", "Two", "Three","","","","","",""]);

  useInView(
    () => loaderRef,
    () => {
      setItems((prev) => [...prev, `Item ${prev.length + 1}`]);
    }
  );

  return (
    <>
      <For each={items()}>
        {(item) => <div class="p-80">{item}</div>}
      </For>
      <div ref={loaderRef} style="height:1px"></div>
    </>
  );
}
