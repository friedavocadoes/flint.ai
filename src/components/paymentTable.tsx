import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Payment } from "@/types/user";
import { Skeleton } from "./ui/skeleton";

const labels = { prepareAI: "PrepareAI generation", resumeAI: "ResumeAI analysis", linkedin: "LinkedIn analysis", premium: "Flint Premium · 1 year" };

export default function PaymentTable({ payments }: { payments: Payment[] }) {
  return (
    <Table>
      <TableCaption>Payments processed securely by Cashfree</TableCaption>
      <TableHeader><TableRow><TableHead>Status</TableHead><TableHead>Product</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
      <TableBody>{payments.map((payment) => <TableRow key={payment._id} className={payment.status === "paid" ? "bg-green-900/10" : payment.status === "failed" ? "bg-red-900/10" : "bg-muted/20"}><TableCell>{payment.status === "paid" ? "🟢 Paid" : payment.status === "failed" ? "🔴 Failed" : "🟠 Pending"}</TableCell><TableCell className="font-medium">{labels[payment.product] || payment.product}</TableCell><TableCell className="text-muted-foreground">{payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString("en-IN") : "—"}</TableCell><TableCell className="text-right font-semibold">{payment.currency} {payment.amount.toFixed(2)}</TableCell></TableRow>)}</TableBody>
    </Table>
  );
}

export function PaymentTableLoader() {
  return <Table><TableCaption>Loading payment history</TableCaption><TableHeader><TableRow><TableHead>Status</TableHead><TableHead>Product</TableHead><TableHead>Date</TableHead><TableHead>Amount</TableHead></TableRow></TableHeader><TableBody>{[1, 2].map((payment) => <TableRow key={payment}><TableCell><Skeleton className="h-5 w-16" /></TableCell><TableCell><Skeleton className="h-5 w-32" /></TableCell><TableCell><Skeleton className="h-5 w-20" /></TableCell><TableCell><Skeleton className="ml-auto h-5 w-16" /></TableCell></TableRow>)}</TableBody></Table>;
}
