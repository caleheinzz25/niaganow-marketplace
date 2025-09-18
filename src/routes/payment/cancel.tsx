import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/payment/cancel')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/payment/cancel"!</div>
}
