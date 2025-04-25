import { MessageCircle, Search, Filter, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function OrdersPage() {
  // Mock orders data
  const orders = [
    {
      id: "ORD-001",
      customer: "Amit Kumar",
      phone: "9876543210",
      date: "2023-05-15",
      items: [
        { name: "Cotton Saree", price: 1999, quantity: 1 },
        { name: "Silk Saree", price: 2499, quantity: 1 },
      ],
      total: 4498,
      status: "pending",
      paymentMethod: "Cash on Delivery",
    },
    {
      id: "ORD-002",
      customer: "Priya Sharma",
      phone: "9876543211",
      date: "2023-05-14",
      items: [{ name: "Designer Kurti", price: 1299, quantity: 2 }],
      total: 2598,
      status: "confirmed",
      paymentMethod: "Razorpay",
    },
    {
      id: "ORD-003",
      customer: "Rajesh Patel",
      phone: "9876543212",
      date: "2023-05-13",
      items: [{ name: "Men's Shirt", price: 899, quantity: 3 }],
      total: 2697,
      status: "shipped",
      paymentMethod: "Cash on Delivery",
    },
    {
      id: "ORD-004",
      customer: "Sneha Gupta",
      phone: "9876543213",
      date: "2023-05-12",
      items: [
        { name: "Lehenga", price: 3999, quantity: 1 },
        { name: "Jewelry Set", price: 1499, quantity: 1 },
      ],
      total: 5498,
      status: "delivered",
      paymentMethod: "Razorpay",
    },
    {
      id: "ORD-005",
      customer: "Vikram Singh",
      phone: "9876543214",
      date: "2023-05-11",
      items: [{ name: "Traditional Dhoti", price: 1199, quantity: 2 }],
      total: 2398,
      status: "cancelled",
      paymentMethod: "Cash on Delivery",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">
            Pending
          </Badge>
        )
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
            Confirmed
          </Badge>
        )
      case "shipped":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50">
            Shipped
          </Badge>
        )
      case "delivered":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
            Delivered
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
            <MessageCircle className="mr-2 h-4 w-4" />
            Send Broadcast
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Order Management</CardTitle>
              <CardDescription>View and manage your WhatsApp orders</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input type="search" placeholder="Search orders..." className="w-full rounded-md pl-8 sm:w-[300px]" />
              </div>
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                  <TabsTrigger value="delivered">Delivered</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50 text-left text-sm font-medium text-gray-500">
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b text-sm">
                    <td className="px-4 py-3 font-medium">{order.id}</td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium">{order.customer}</div>
                        <div className="text-gray-500">{order.phone}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{order.date}</td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="text-xs">
                            {item.quantity}x {item.name}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">₹{order.total}</td>
                    <td className="px-4 py-3">{getStatusBadge(order.status)}</td>
                    <td className="px-4 py-3 text-gray-500">{order.paymentMethod}</td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Update Status</DropdownMenuItem>
                          <DropdownMenuItem>Message Customer</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Cancel Order</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
