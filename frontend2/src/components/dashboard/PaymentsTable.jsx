"use client";

export function PaymentsTable() {
  const payments = [
    {
      order: "#12345",
      customer: "John Doe",
      method: "Credit Card",
      amount: 45.0,
      status: "Completed",
      time: "10 mins ago",
    },
    {
      order: "#12346",
      customer: "Jane Smith",
      method: "Cash",
      amount: 32.5,
      status: "Pending",
      time: "15 mins ago",
    },
    {
      order: "#12347",
      customer: "Robert Johnson",
      method: "Mobile Pay",
      amount: 67.8,
      status: "Completed",
      time: "20 mins ago",
    },
    {
      order: "#12348",
      customer: "Emily Davis",
      method: "Credit Card",
      amount: 23.0,
      status: "Failed",
      time: "25 mins ago",
    },
  ];

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Payments</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 text-sm font-medium text-muted-foreground">Order</th>
              <th className="text-left py-3 text-sm font-medium text-muted-foreground">Customer</th>
              <th className="text-left py-3 text-sm font-medium text-muted-foreground">Method</th>
              <th className="text-left py-3 text-sm font-medium text-muted-foreground">Amount</th>
              <th className="text-left py-3 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left py-3 text-sm font-medium text-muted-foreground">Time</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr key={index} className="border-b last:border-b-0 hover:bg-secondary/50 transition-colors">
                <td className="py-3 text-sm">{payment.order}</td>
                <td className="py-3 text-sm">{payment.customer}</td>
                <td className="py-3 text-sm">{payment.method}</td>
                <td className="py-3 text-sm font-medium">${payment.amount.toFixed(2)}</td>
                <td className="py-3 text-sm">
                  <span
                    className={`badge ${
                      payment.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : payment.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>
                <td className="py-3 text-sm text-muted-foreground">{payment.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}