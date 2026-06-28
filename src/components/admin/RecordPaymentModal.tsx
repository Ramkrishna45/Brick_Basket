"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { recordProjectPaymentAction } from "@/lib/actions/payments";
import { IndianRupee } from "lucide-react";

interface RecordPaymentModalProps {
  projectId: string;
  maxAmount: number;
  onSuccess: () => void;
  trigger?: React.ReactNode;
}

export function RecordPaymentModal({ projectId, maxAmount, onSuccess, trigger }: RecordPaymentModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [amount, setAmount] = useState<string>("");
  const [method, setMethod] = useState<string>("upi");
  const [transactionId, setTransactionId] = useState("");
  const [notes, setNotes] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }
    if (numAmount > maxAmount) {
      toast.error(`Amount cannot exceed the remaining balance of ₹${maxAmount}`);
      return;
    }

    setLoading(true);
    const res = await recordProjectPaymentAction({
      projectId,
      amount: numAmount,
      method,
      transactionId,
      notes,
    });

    setLoading(false);

    if (res.success) {
      toast.success("Payment recorded successfully!");
      setOpen(false);
      // Reset form
      setAmount("");
      setMethod("upi");
      setTransactionId("");
      setNotes("");
      onSuccess();
    } else {
      toast.error(res.error || "Failed to record payment.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        render={
          (trigger as React.ReactElement) || (
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <IndianRupee className="w-4 h-4 mr-2" />
              Record Payment
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Enter the payment details. This will automatically distribute the amount across pending milestones.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder={`Max: ${maxAmount}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                max={maxAmount}
                className="col-span-3"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="method">Payment Method</Label>
              <Select value={method} onValueChange={(v) => v && setMethod(v)}>
                <SelectTrigger id="method">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer / NEFT / RTGS</SelectItem>
                  <SelectItem value="card">Credit / Debit Card</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="transactionId">Transaction / Reference ID</Label>
              <Input
                id="transactionId"
                placeholder="e.g. UPI Ref / Check No."
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                required={method !== 'cash'}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any additional details..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !amount || maxAmount <= 0} className="bg-emerald-600 hover:bg-emerald-700">
              {loading ? "Saving..." : "Save Payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
