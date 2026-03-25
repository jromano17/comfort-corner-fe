"use client";

import { useState } from "react";
import useSWR from "swr";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { createShipment, fetchOrderById, updateShipmentStatus } from "@/lib/admin-api";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { OrderStatusPicker } from "@/components/order-status-picker";  

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
import { Header } from "@/components/header";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { token } = useAuth();

  const { data: order, error, isLoading, mutate } = useSWR(
    token && params.id ? ["user-order", params.id, token] : null,
    ([_, id, tkn]) => fetchOrderById(id)
  );

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
    <div className="min-h-screen flex flex-col">
            <Header />

    <div className="space-y-6 max-w-7xl w-full mx-auto px-6 pb-10 pt-6 flex-1">
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
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipment Status:</span>
                <span className="font-medium">{order.shipment.status}</span>
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
          <Card>
            <CardHeader><CardTitle>Shipment Details</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground">No shipment data available yet.</p></CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1 text-muted-foreground">
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
    </div>
  );
}