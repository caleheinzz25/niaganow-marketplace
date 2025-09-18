import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/test')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div class='bg-gray-400 w-10'>Hello "/test"!</div>
}
