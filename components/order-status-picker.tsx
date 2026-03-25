import { useEffect, useState } from "react";
import { changeOrderStatus, createIncomeRecord, fetchOrderById } from "@/lib/admin-api";
import { CreateIncomeRecord, OrderStatus } from "@/lib/types"; 
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import toast, { Toaster } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "./ui/textarea";

interface OrderStatusPickerProps {
  orderId: number;
  currentStatus: string; 
  onSuccess: () => void; 
}

export function OrderStatusPicker({ orderId, currentStatus, onSuccess }: OrderStatusPickerProps) {
  const [status, setStatus] = useState<string>(currentStatus);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isIncomeDialogOpen, setIsIncomeDialogOpen] = useState(false);
  const [isPolling, setIsPolling] = useState(false); 

  const [formData, setFormData] = useState<CreateIncomeRecord>({
    orderId: orderId,
    incomeAmount: 0,
    tax: 0,
    cost: 0
  });

  const handleUpdate = async (newStatus: string) => {
 setLoading(true);
    try {
      await changeOrderStatus(orderId, newStatus as OrderStatus, undefined);
      
      if (newStatus === OrderStatus.APPROVED) { 
        setIsPolling(true);
        toast.loading(`Processing Order #${orderId}...`, { id: `toast-${orderId}` });
      } else {
        setStatus(newStatus); 
        onSuccess(); 
        toast.success("Status updated successfully!");
        
        if (newStatus === OrderStatus.DELIVERED) {
          setIsIncomeDialogOpen(true);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status.");
      setStatus(currentStatus); 
    } finally {
      setLoading(false);
    }


/*ovako je bilo odmah poslije awaita changeorderstatus:
      setStatus(newStatus); 
      onSuccess(); 
      if (newStatus === OrderStatus.DELIVERED) {
        setIsIncomeDialogOpen(true);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update status.");
      setStatus(currentStatus); 
    } finally {
      setLoading(false);

    }
*/
  };

  useEffect(() => {
    let pollInterval: NodeJS.Timeout;

    if (isPolling) {
      pollInterval = setInterval(async () => {
        try {
          const updatedOrder = await fetchOrderById(orderId.toString()); 
          if (updatedOrder.currentStatus === "CREATED") {
            setIsPolling(false);
            setStatus(OrderStatus.CREATED);
            onSuccess(); 
            toast.success("Stock reduced! Order approved.", { id: `toast-${orderId}` });
          } 
          else if (updatedOrder.currentStatus === "CANCELLED") {
            setIsPolling(false);
            setStatus(OrderStatus.CANCELLED);
            onSuccess(); 
            toast.error("Failed: Insufficient stock.", { id: `toast-${orderId}` });
          }

        } catch (error) {
          console.error("Polling error", error);
        }
      }, 2000); 
    }

    return () => clearInterval(pollInterval);
  }, [isPolling, orderId, onSuccess]);

  
 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createIncomeRecord(formData);
      setIsIncomeDialogOpen(false);
      setFormData({ orderId: 0, incomeAmount: 0, tax: 0, cost:0 });
    } catch (err) {
      console.error("Failed to add income record:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <select 
        value={status} 
        disabled={loading}
        onChange={(e) => handleUpdate(e.target.value)}
        className="border border-input bg-background px-3 py-1 rounded-md text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        {Object.values(OrderStatus).map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
<Toaster />
      <Dialog open={isIncomeDialogOpen} onOpenChange={setIsIncomeDialogOpen}>
       <DialogContent>
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Add New Income Record</DialogTitle>
                  <DialogDescription>
                    Create a new income record for the successfully delivered order.
                  </DialogDescription>
                </DialogHeader>
                <FieldGroup className="py-4">
                  <Field>
                    <FieldLabel>Total payed amount (BAM)</FieldLabel>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.incomeAmount || ""}
                      onChange={(e) => setFormData({ ...formData, incomeAmount: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Tax (BAM)</FieldLabel>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.tax || ""}
                      onChange={(e) => setFormData({ ...formData, tax: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Cost (BAM)</FieldLabel>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.cost || ""}
                      onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </Field>
                </FieldGroup>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsIncomeDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Spinner className="mr-2 h-4 w-4" />}
                    Record Income
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </>
  );
}