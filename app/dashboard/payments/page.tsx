import { Search, Filter, Download, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function PaymentsPage() {
  // Mock payments data
  const payments = [
    {
      id: "PAY-001",
      orderId: "ORD-001",
      customer: "Amit Kumar",
      date: "2023-05-15",
      amount: 4498,
      method: "Razorpay",
      status: "completed",
    },
    {
      id: "PAY-002",
      orderId: "ORD-002",
      customer: "Priya Sharma",
      date: "2023-05-14",
      amount: 2598,
      method: "Razorpay",
      status: "completed",
    },
    {
      id: "PAY-003",
      orderId: "ORD-003",
      customer: "Rajesh Patel",
      date: "2023-05-13",
      amount: 2697,
      method: "Cash on Delivery",
      status: "pending",
    },
    {
      id: "PAY-004",
      orderId: "ORD-004",
      customer: "Sneha Gupta",
      date: "2023-05-12",
      amount: 5498,
      method: "Razorpay",
      status: "completed",
    },
    {
      id: "PAY-005",
      orderId: "ORD-005",
      customer: "Vikram Singh",
      date: "2023-05-11",
      amount: 2398,
      method: "Cash on Delivery",
      status: "failed",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
            Failed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Payments</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹17,689</div>
            <p className="text-xs text-green-600">+8.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Online Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹12,594</div>
            <p className="text-xs text-gray-500">71% of total revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Cash on Delivery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹5,095</div>
            <p className="text-xs text-gray-500">29% of total revenue</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>View and manage all payment transactions</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input type="search" placeholder="Search payments..." className="w-full rounded-md pl-8 sm:w-[300px]" />
              </div>
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
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
                  <th className="px-4 py-3">Payment ID</th>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b text-sm">
                    <td className="px-4 py-3 font-medium">{payment.id}</td>
                    <td className="px-4 py-3 text-gray-500">{payment.orderId}</td>
                    <td className="px-4 py-3">{payment.customer}</td>
                    <td className="px-4 py-3 text-gray-500">{payment.date}</td>
                    <td className="px-4 py-3 font-medium">₹{payment.amount}</td>
                    <td className="px-4 py-3">{payment.method}</td>
                    <td className="px-4 py-3">{getStatusBadge(payment.status)}</td>
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
                          <DropdownMenuItem>Download Receipt</DropdownMenuItem>
                          <DropdownMenuItem>Send to Customer</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Refund Payment</DropdownMenuItem>
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
