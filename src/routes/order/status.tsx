import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/order/status')({
  component: RouteComponent,
})

function RouteComponent() {
  return <OrderStatus />
}
import { createSignal, onMount, For } from "solid-js";


const steps = [
  {
    icon: "fa-check",
    label: "Order Confirmed",
    date: "Jun 28, 2:15 PM",
    status: "completed",
  },
  {
    icon: "fa-box-open",
    label: "Processing",
    date: "Jun 28, 3:30 PM",
    status: "completed",
  },
  {
    icon: "fa-truck",
    label: "Shipped",
    date: "Estimated: Jun 30",
    status: "active",
  },
  {
    icon: "fa-home",
    label: "Delivered",
    date: "Estimated: Jul 2",
    status: "pending",
  },
];

 function OrderStatus() {
  const [progress, setProgress] = createSignal(0);

  onMount(() => {
    let current = 0;  
    const interval = setInterval(() => {
      current += 0.5;
      if (current >= 65) clearInterval(interval);
      setProgress(current);
    }, 16);
  });

  return (
    <div class="container mx-auto px-4 py-8 max-w-4xl">
        {/* <!-- Header --> */}
        <div class="text-center mb-10">
            <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Order Status</h1>
            <p class="text-gray-500">Track your order in real-time</p>
        </div>

        {/* <!-- Order Info Card --> */}
        <div class="bg-white rounded-xl shadow-md p-6 mb-8 status-card transition duration-300">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h2 class="text-xl font-semibold text-gray-800">Order #OD-2023-78945</h2>
                    <div class="flex items-center mt-1 text-sm text-gray-500">
                        <i class="fas fa-calendar-alt mr-2"></i>
                        <span>Placed on June 28, 2023 at 2:15 PM</span>
                    </div>
                </div>
                <div class="mt-4 md:mt-0">
                    <span class="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        Processing
                    </span>
                </div>
            </div>
        </div>

        {/* <!-- Progress Tracker --> */}
        <div class="bg-white rounded-xl shadow-md p-6 mb-8">
            {/* <!-- Progress Bar --> */}
            <div class="progress-bar h-2 rounded-full mb-8" style="--progress:65%"></div>
            
            {/* <!-- Steps --> */}
            <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
                {/* <!-- Step 1 - Completed --> */}
                <div class="status-step">
                    <div class="relative mb-8">
                        <div class="w-12 h-12 bg-blue-600 rounded-full mx-auto flex items-center justify-center text-white z-10 relative">
                            <i class="fas fa-check"></i>
                        </div>
                        <div class="absolute top-6 left-1/2 h-1 bg-blue-600 w-full -z-10"></div>
                    </div>
                    <p class="font-medium text-blue-600">Order Confirmed</p>
                    <p class="text-xs text-gray-500">Jun 28, 2:15 PM</p>
                </div>

                {/* <!-- Step 2 - Completed --> */}
                <div class="status-step">
                    <div class="relative mb-8">
                        <div class="w-12 h-12 bg-blue-600 rounded-full mx-auto flex items-center justify-center text-white z-10 relative">
                            <i class="fas fa-box-open"></i>
                        </div>
                        <div class="absolute top-6 left-1/2 h-1 bg-blue-600 w-full -z-10"></div>
                    </div>
                    <p class="font-medium text-blue-600">Processing</p>
                    <p class="text-xs text-gray-50500">Jun 28, 3:30 PM</p>
                </div>

                {/* <!-- Step 3 - Active --> */}
                <div class="status-step">
                    <div class="relative mb-8">
                        <div class="w-12 h-12 bg-blue-600 rounded-full mx-auto flex items-center justify-center text-white z-10 relative animate-pulse">
                            <i class="fas fa-truck"></i>
                        </div>
                        <div class="absolute top-6 left-1/2 h-1 bg-gray-200 w-full -z-10"></div>
                    </div>
                    <p class="font-medium text-blue-600">Shipped</p>
                    <p class="text-xs text-gray-500">Estimated: Jun 30</p>
                </div>

                {/* <!-- Step 4 - Pending --> */}
                <div class="status-step">
                    <div class="relative mb-8">
                        <div class="w-12 h-12 bg-gray-200 rounded-full mx-auto flex items-center justify-center text-gray-400 z-10 relative">
                            <i class="fas fa-home"></i>
                        </div>
                    </div>
                    <p class="font-medium text-gray-500">Delivered</p>
                    <p class="text-xs text-gray-400">Estimated: Jul 2</p>
                </div>
            </div>
        </div>

        {/* <!-- Timeline --> */}
        <div class="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 class="text-xl font-semibold text-gray-800 mb-6">Order Timeline</h2>
            
            <div class="space-y-6">
                {/* <!-- Timeline Item 1 --> */}
                <div class="flex relative">
                    <div class="w-4 h-4 bg-blue-600 rounded-full mt-1"></div>
                    <div class="ml-6 pb-6">
                        <div class="flex items-center">
                            <h3 class="font-medium text-gray-800 mr-2">Order Shipped</h3>
                            <span class="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Just now</span>
                        </div>
                        <p class="text-sm text-gray-500 mt-1">Your order has left our warehouse and is on its way to you.</p>
                        <p class="text-xs text-gray-400 mt-2">
                            <i class="fas fa-truck mr-1"></i> Carrier: FastExpress (Tracking #FE789456123)
                        </p>
                        <button class="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center">
                            <i class="fas fa-external-link-alt mr-1"></i> Track Shipment
                        </button>
                    </div>
                </div>
                
                {/* <!-- Timeline Item 2 --> */}
                <div class="flex relative">
                    <div class="w-4 h-4 bg-blue-600 rounded-full mt-1"></div>
                    <div class="ml-6 pb-6">
                        <h3 class="font-medium text-gray-800">Payment Processed</h3>
                        <p class="text-sm text-gray-500 mt-1">Your payment of $147.65 was successfully processed.</p>
                        <p class="text-xs text-gray-400 mt-2">
                            <i class="far fa-credit-card mr-1"></i> Visa ending in 4242
                        </p>
                        <p class="text-xs text-gray-400 mt-1">Jun 28, 2023 at 2:45 PM</p>
                    </div>
                </div>
                
                {/* <!-- Timeline Item 3 --> */}
                <div class="flex relative">
                    <div class="w-4 h-4 bg-blue-600 rounded-full mt-1"></div>
                    <div class="ml-6">
                        <h3 class="font-medium text-gray-800">Order Confirmed</h3>
                        <p class="text-sm text-gray-500 mt-1">We've received your order and are preparing it for shipment.</p>
                        <p class="text-xs text-gray-400 mt-2">Jun 28, 2023 at 2:15 PM</p>
                    </div>
                </div>
            </div>
        </div>

        {/* <!-- Package Details --> */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* <!-- Shipping Address --> */}
            <div class="bg-white rounded-xl shadow-md p-6">
                <h2 class="text-xl font-semibold text-gray-800 mb-4">Shipping Address</h2>
                <div class="space-y-2">
                    <p class="text-gray-600"><i class="fas fa-user mr-2 text-blue-600"></i> Sarah Johnson</p>
                    <p class="text-gray-600"><i class="fas fa-map-marker-alt mr-2 text-blue-600"></i> 456 Oak Avenue, Apt 12</p>
                    <p class="text-gray-600"><i class="fas fa-city mr-2 text-blue-600"></i> Portland, OR 97205</p>
                    <p class="text-gray-600"><i class="fas fa-phone mr-2 text-blue-600"></i> (503) 555-7890</p>
                </div>
                <button class="mt-4 text-sm text-blue-600 hover:text-blue-800 flex items-center">
                    <i class="fas fa-pen mr-1"></i> Update Address
                </button>
            </div>

            {/* <!-- Order Summary --> */}
            <div class="bg-white rounded-xl shadow-md p-6">
                <h2 class="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
                <div class="space-y-3 mb-4">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Subtotal (2 items)</span>
                        <span>$137.00</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Shipping</span>
                        <span class="text-green-600">Free</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Tax</span>
                        <span>$10.65</span>
                    </div>
                    <div class="flex justify-between font-bold pt-2 mt-2 border-t border-gray-200">
                        <span>Total</span>
                        <span>$147.65</span>
                    </div>
                </div>
                <button class="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                    <i class="fas fa-print mr-2"></i> Print Receipt
                </button>
            </div>
        </div>

        {/* <!-- Order Items --> */}
        <div class="bg-white rounded-xl shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Order Items</h2>
            <div class="divide-y divide-gray-200">
                {/* <!-- Item 1 --> */}
                <div class="py-4 flex items-start">
                    <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center mr-4">
                        <img src="https://m.media-amazon.com/images/I/61O9tWR6WDS._AC_UF1000,1000_QL80_.jpg" alt="Wireless Earbuds" class="w-full h-full object-contain"/>
                    </div>
                    <div class="flex-1">
                        <h3 class="font-medium text-gray-800">Wireless Earbuds Pro</h3>
                        <p class="text-sm text-gray-500">Color: White | Qty: 1</p>
                        <p class="text-blue-600 font-medium mt-1">$79.99</p>
                    </div>
                    <button class="text-blue-600 hover:text-blue-800">
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                </div>
                
                {/* <!-- Item 2 --> */}
                <div class="py-4 flex items-start">
                    <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center mr-4">
                        <img src="https://m.media-amazon.com/images/I/71t5rUZHmAL._AC_UF1000,1000_QL80_.jpg" alt="Smart Watch" class="w-full h-full object-contain"/>
                    </div>
                    <div class="flex-1">
                        <h3 class="font-medium text-gray-800">Smart Watch Series 5</h3>
                        <p class="text-sm text-gray-500">Size: 42mm | Qty: 1</p>
                        <p class="text-blue-600 font-medium mt-1">$57.01</p>
                    </div>
                    <button class="text-blue-600 hover:text-blue-800">
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                </div>
            </div>
            
            <div class="mt-6 flex flex-wrap gap-3">
                <button class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                    <i class="fas fa-undo-alt mr-2 text-blue-600"></i>
                    <span>Return Item</span>
                </button>
                <button class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                    <i class="fas fa-exchange-alt mr-2 text-blue-600"></i>
                    <span>Exchange Item</span>
                </button>
                <button class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                    <i class="fas fa-question-circle mr-2 text-blue-600"></i>
                    <span>Get Help</span>
                </button>
            </div>
        </div>
    </div>

  );
}