import { onCleanup, onMount } from "solid-js";


interface param{
  ref: () => HTMLElement | undefined,
  callback: () => void
  rootMargin?: string
  threshold?: number
}

export function useInView({ref, callback, rootMargin, threshold}: param) {
  let observer: IntersectionObserver;
  rootMargin = rootMargin || "0px";
  threshold = threshold || 0;

  onMount(() => {
    if (ref()) {
      observer = new IntersectionObserver(
        ([entry]) => entry.isIntersecting && callback(),
        { rootMargin, threshold }
      );
      observer.observe(ref()!);
    }
  });

  onCleanup(() => observer?.disconnect());
}
