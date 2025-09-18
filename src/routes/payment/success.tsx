import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/payment/success')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/payment/success"!</div>
}
