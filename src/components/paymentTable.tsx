import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Payment } from "@/types/user";
import { Skeleton } from "./ui/skeleton";

export default function PaymentTable({ payments }: { payments: Payment[] }) {
  return (
    <Table>
      <TableCaption>Powered by Razorpay</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-2">Status</TableHead>
          <TableHead>Product</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow
            className={
              payment.status === "paid"
                ? "bg-green-900/20 hover:bg-green-900/30"
                : "bg-red-900/20 hover:bg-red-900/30"
            }
            key={payment._id}
          >
            <TableCell>{payment.status === "paid" ? "🟢" : "🔴"}</TableCell>
            <TableCell>
              {payment.source === "ppc" ? "Pay per chat" : "Subscription"}
            </TableCell>

            <TableCell className="text-right">
              {payment.payload.payment.entity.currency +
                " " +
                payment.amount / 100 +
                " (" +
                payment.payload.payment.entity.method +
                ")"}
            </TableCell>
          </TableRow>

          //   <div key={payment._id}>hi</div>
        ))}
      </TableBody>
    </Table>
  );
}

export function PaymentTableLoader() {
  return (
    <Table>
      <TableCaption>Powered by Razorpay</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-2">Status</TableHead>
          <TableHead>Product</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[1, 2].map((payment) => (
          <TableRow className="" key={payment}>
            <TableCell>🟠</TableCell>
            <TableCell>
              <Skeleton className="w-30 h-5" />
            </TableCell>

            <TableCell className="flex justify-end ">
              <Skeleton className="w-20 h-5" />
            </TableCell>
          </TableRow>

          //   <div key={payment._id}>hi</div>
        ))}
      </TableBody>
    </Table>
  );
}
