import { Search, Filter, MoreVertical, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function CustomersPage() {
  // Mock customers data
  const customers = [
    {
      id: "CUST-001",
      name: "Amit Kumar",
      phone: "9876543210",
      email: "amit@example.com",
      orders: 5,
      totalSpent: 12450,
      lastOrder: "2023-05-10",
      status: "active",
    },
    {
      id: "CUST-002",
      name: "Priya Sharma",
      phone: "9876543211",
      email: "priya@example.com",
      orders: 3,
      totalSpent: 7890,
      lastOrder: "2023-05-08",
      status: "active",
    },
    {
      id: "CUST-003",
      name: "Rajesh Patel",
      phone: "9876543212",
      email: "rajesh@example.com",
      orders: 2,
      totalSpent: 4500,
      lastOrder: "2023-05-05",
      status: "inactive",
    },
    {
      id: "CUST-004",
      name: "Sneha Gupta",
      phone: "9876543213",
      email: "sneha@example.com",
      orders: 7,
      totalSpent: 18750,
      lastOrder: "2023-05-12",
      status: "active",
    },
    {
      id: "CUST-005",
      name: "Vikram Singh",
      phone: "9876543214",
      email: "vikram@example.com",
      orders: 1,
      totalSpent: 2399,
      lastOrder: "2023-04-28",
      status: "inactive",
    },
    {
      id: "CUST-006",
      name: "Meera Joshi",
      phone: "9876543215",
      email: "meera@example.com",
      orders: 4,
      totalSpent: 9870,
      lastOrder: "2023-05-11",
      status: "active",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Customers</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Customer Management</CardTitle>
              <CardDescription>View and manage your customer database</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search customers..."
                  className="w-full rounded-md pl-8 sm:w-[300px]"
                />
              </div>
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="inactive">Inactive</TabsTrigger>
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
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Orders</th>
                  <th className="px-4 py-3">Total Spent</th>
                  <th className="px-4 py-3">Last Order</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b text-sm">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                          <span className="text-xs font-medium text-emerald-600">{customer.name.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-xs text-gray-500">{customer.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div>{customer.phone}</div>
                        <div className="text-xs text-gray-500">{customer.email}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">{customer.orders}</td>
                    <td className="px-4 py-3 font-medium">₹{customer.totalSpent}</td>
                    <td className="px-4 py-3 text-gray-500">{customer.lastOrder}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          customer.status === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {customer.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
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
                          <DropdownMenuItem>Edit Customer</DropdownMenuItem>
                          <DropdownMenuItem>View Orders</DropdownMenuItem>
                          <DropdownMenuItem>Send Message</DropdownMenuItem>
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
