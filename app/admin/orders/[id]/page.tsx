"use client";

import { useState } from "react";
import useSWR from "swr";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { createShipment, fetchOrderById, updateShipmentStatus } from "@/lib/admin-api";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { OrderStatusPicker } from "@/components/order-status-picker";  
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft } from "lucide-react"; 
import { ShipmentFormData, ShipmentStatus } from "@/lib/types";
import { ShipmentStatusPicker } from "@/components/shipment-status-picker";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { token } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>(ShipmentStatus.PROCESSING); 
  const [isUpdating, setIsUpdating] = useState(false);


  const { data: order, error, isLoading, mutate } = useSWR(
    token && params.id ? ["admin-order", params.id, token] : null,
    ([_, id, tkn]) => fetchOrderById(id)
  );
    const [formData, setFormData] = useState<ShipmentFormData>({
    orderId : order?.id,
    trackingNumber : "",
    status : "",
    estimatedDeliveryDate : undefined,
  });
  const handleInstantUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await updateShipmentStatus(order?.shipment.id, newStatus);
      mutate(); 
    } catch (error) {
      alert("Failed to update shipment status");
    } finally {
      setIsUpdating(false);
    }
  };

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
      orderId: order?.id,
      trackingNumber: formData.trackingNumber,
      status: selectedStatus,
      estimatedDeliveryDate: formData.estimatedDeliveryDate 
        ? format(formData.estimatedDeliveryDate, "yyyy-MM-dd'T'00:00:00") 
        : null
    };
console.log(formData);
      await createShipment(payload);
      mutate();
      setIsDialogOpen(false);
      setFormData({ orderId : 0, trackingNumber : "", status : "", estimatedDeliveryDate : undefined });
    } catch (err) {
      console.error("Failed to create shipment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-20 text-destructive">
        Failed to load order details. It might not exist.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="font-serif text-3xl font-bold">Order #{order.orderNumber}</h1>
          <p className="text-muted-foreground">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        
      </div>

     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CUSTOMER & STATUS CARD */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4"> {/* Increased spacing slightly */}
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Status:</span>
              <OrderStatusPicker 
                orderId={order.id} 
                currentStatus={order.currentStatus} 
                onSuccess={() => mutate()} 
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Price:</span>
              <span className="font-bold text-lg">${order.totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">User ID:</span>
              <span className="font-medium">{order.userId}</span>
            </div>
          </CardContent>
        </Card>

        {/* SHIPMENT CARD */}
        {order.shipment ? (
          <Card>
            <CardHeader>
              <CardTitle>Shipment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">Tracking Number:</span>
                <span className="font-medium font-mono">{order.shipment.trackingNumber || "N/A"}</span>
              </div>

              {/* ovo je bio prije dodavanja tog pikera dolje
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipment Status:</span>
                <span className="font-medium">{order.shipment.status}</span>
              </div>
*/}
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Shipment Status:</span>
                <ShipmentStatusPicker 
                  value={order.shipment.status} 
                  onChange={handleInstantUpdate} 
                  disabled={isUpdating}
                />
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Est. Delivery:</span>
                <span className="font-medium">
                  {order.shipment.estimatedDeliveryDate 
                    ? new Date(order.shipment.estimatedDeliveryDate).toLocaleDateString() 
                    : "Pending"}
                </span>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div>
          <Card>
            <CardHeader><CardTitle>Shipment Details</CardTitle></CardHeader>
            <CardContent>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Shipment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Add Shipment To This Order</DialogTitle>
                <DialogDescription>
                  Add shipment information for this order.
                </DialogDescription>
              </DialogHeader>
              <FieldGroup className="py-4">
                <Field>
                  <FieldLabel>Tracking number</FieldLabel>
                  <Input
                    value={formData.trackingNumber}
                    onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
                    placeholder="e.g., #123456789"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel>Status</FieldLabel>
                    <ShipmentStatusPicker 
                      value={selectedStatus} 
                      onChange={setSelectedStatus} 
                    />
                </Field>

                <Field className="flex flex-col gap-2">
                  <FieldLabel>Estimated Delivery Date</FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.estimatedDeliveryDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.estimatedDeliveryDate ? (
                          format(formData.estimatedDeliveryDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.estimatedDeliveryDate}
                        onSelect={(date) => setFormData({ ...formData, estimatedDeliveryDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </Field>
                {/* ------------------------------- */}

              </FieldGroup>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Spinner className="mr-2 h-4 w-4" />}
                  Add Shipment
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
            <p className="text-muted-foreground">No shipment data available yet.</p></CardContent>
          </Card>
          </div>
        )}

        {/* ADDRESSES */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1 text-muted-foreground">
            {/* Adjust these fields based on your actual Address interface */}
            <p className="font-medium text-foreground">{order.shippingAddress?.fullName}</p>
            <p>{order.shippingAddress?.street}</p>
            <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
            <p>{order.shippingAddress?.country}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Billing Address</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1 text-muted-foreground">
            <p className="font-medium text-foreground">{order.billingAddress?.fullName}</p>
            <p>{order.billingAddress?.street}</p>
            <p>{order.billingAddress?.city}, {order.billingAddress?.postalCode}</p>
            <p>{order.billingAddress?.country}</p>
          </CardContent>
        </Card>
      </div>

      {/* ITEMS TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Variant name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price (At Purchase)</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-sm">{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>${item.priceAtPurchase.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-medium">
                    ${(item.quantity * item.priceAtPurchase).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}