import { createFileRoute } from "@tanstack/solid-router";
import createEmblaCarousel from "embla-carousel-solid";
import { onMount } from "solid-js";

export const Route = createFileRoute("/contact")({
  component: RouteComponent,
});

function RouteComponent() {
  const [emblaRef, emblaApi] = createEmblaCarousel(() => ({
    loop: true,
    axis: "x",
  }));

  onMount(() => {
    const api = emblaApi();
    if (api) {
      console.log(api.slideNodes()); // Access API
    }
  });
  const [emblaRef1] = createEmblaCarousel();
  return (
    <>
      <div class="embla h-20 mx-auto mt-12 max-w-lg border" ref={emblaRef}>
        <div class="embla__container   height: 200px; h-full">
          <div class="embla__slide_2 flex items-center justify-center">
            Slide 1
          </div>
          <div class="embla__slide_2 flex items-center justify-center">
            Slide 2
          </div>
          <div class="embla__slide_2 flex items-center justify-center">
            Slide 3
          </div>
          <div class="embla__slide_2 flex items-center justify-center">
            Slide 4
          </div>
          <div class="embla__slide_2 flex items-center justify-center">
            Slide 5
          </div>
          <div class="embla__slide_2 flex items-center justify-center">
            Slide 6
          </div>
        </div>
      </div>
      <div class="embla h-20 mx-auto mt-12 max-w-lg border" ref={emblaRef1}>
        <div class="embla__container h-full">
          <div class="embla__slide_2 flex items-center justify-center">
            Slide 1
          </div>
          <div class="embla__slide_2 flex items-center justify-center">
            Slide 2
          </div>
          <div class="embla__slide_2 flex items-center justify-center">
            Slide 3
          </div>
        </div>
      </div>
    </>
  );
}
