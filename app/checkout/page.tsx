"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart-context"; 
import { useAuth } from "@/lib/auth-context";
import { ArrowLeft, CheckCircle2, Package, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createOrder } from "@/lib/order-api";
import { Address, CreateOrderRequest } from "@/lib/types";
import { Header } from "@/components/header";


const initialAddress: Address = {
  fullName: "",
  street: "",
  city: "",
  postalCode: "",
  country: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, totalAmount, clearCart } = useCart(); 
  const { token } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useSameAddress, setUseSameAddress] = useState(true);
  
  const [shipping, setShipping] = useState<Address>(initialAddress);
  const [billing, setBilling] = useState<Address>(initialAddress);

  const [error, setError] = useState("");

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShipping((prev) => ({ ...prev, [name]: value }));
    if (useSameAddress) {
      setBilling((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBilling((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const orderDTO : CreateOrderRequest ={
      shippingAddress: shipping,
      billingAddress: useSameAddress ? shipping : billing,
      items: cartItems.map((item) => ({
        variantId: item.variant.id,       
        quantity: item.quantity,
        priceAtPurchase: item.variant.finalPrice, 
        name: item.chairName
      })),
      totalPrice : totalAmount,
    };

    try {
      const savedOrder = await createOrder(orderDTO, token || undefined);
      clearCart();
      router.push(`/checkout/success?orderNumber=${savedOrder.orderNumber}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create order");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <Package className="h-12 w-12 text-muted-foreground" />
        <h2 className="font-serif text-2xl font-bold">Your cart is empty</h2>
        <p className="text-muted-foreground">Add some comfort to your corner first.</p>
        <Button asChild>
          <Link href="/">Back to catalogue</Link>
        </Button>
      </div>
    </div>
    );
  }

  return (
  <div className="min-h-screen flex flex-col">
    <Header />
    <div className="max-w-6xl mx-auto pb-12">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/cart" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Link>
      </Button>

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <h1 className="font-serif text-3xl font-bold tracking-tight mb-8">Checkout</h1>

      <form onSubmit={handleSubmitOrder} className="grid gap-8 lg:grid-cols-12">
        
        {/* LEFT COLUMN: Addresses */}
        <div className="lg:col-span-7 space-y-8">
          {/* SHIPPING ADDRESS */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Shipping Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="s-fullName">Full Name</Label>
                <Input id="s-fullName" name="fullName" required value={shipping.fullName} onChange={handleShippingChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="s-street">Street Address</Label>
                <Input id="s-street" name="street" required value={shipping.street} onChange={handleShippingChange} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="s-city">City</Label>
                  <Input id="s-city" name="city" required value={shipping.city} onChange={handleShippingChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="s-postalCode">Postal Code</Label>
                  <Input id="s-postalCode" name="postalCode" required value={shipping.postalCode} onChange={handleShippingChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="s-country">Country</Label>
                <Input id="s-country" name="country" required value={shipping.country} onChange={handleShippingChange} />
              </div>
            </CardContent>
          </Card>

          {/* BILLING ADDRESS */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Billing Details
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox 
                  id="same-address" 
                  checked={useSameAddress} 
                  onCheckedChange={(checked) => setUseSameAddress(checked as boolean)} 
                />
                <label htmlFor="same-address" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Billing address is the same as shipping
                </label>
              </div>

              {!useSameAddress && (
                <div className="space-y-4 pt-4 border-t border-border/50">
                  <div className="space-y-2">
                    <Label htmlFor="b-fullName">Full Name</Label>
                    <Input id="b-fullName" name="fullName" required={!useSameAddress} value={billing.fullName} onChange={handleBillingChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="b-street">Street Address</Label>
                    <Input id="b-street" name="street" required={!useSameAddress} value={billing.street} onChange={handleBillingChange} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="b-city">City</Label>
                      <Input id="b-city" name="city" required={!useSameAddress} value={billing.city} onChange={handleBillingChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="b-postalCode">Postal Code</Label>
                      <Input id="b-postalCode" name="postalCode" required={!useSameAddress} value={billing.postalCode} onChange={handleBillingChange} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="b-country">Country</Label>
                    <Input id="b-country" name="country" required={!useSameAddress} value={billing.country} onChange={handleBillingChange} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Order Summary (Sticky) */}
        <div className="lg:col-span-5">
          <Card className="sticky top-24">
            <CardHeader className="bg-secondary/30 pb-4">
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[400px] overflow-y-auto p-6 space-y-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    {/* Placeholder for item image if you have it in context */}
                    <div className="h-16 w-16 bg-muted rounded-md flex-shrink-0 overflow-hidden">
                      <img src={item.variant.image} alt="chair" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-medium text-sm">{item.chairName}</h4>
                      <p className="text-xs text-muted-foreground">
                        {item.variant.material.name} • {item.variant.colorOption.name}
                      </p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-medium text-sm">
                      ${(item.variant.finalPrice * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-6 bg-secondary/10 border-t">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-serif font-semibold text-lg">Total</span>
                  <span className="font-serif font-bold text-2xl text-primary">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>
                
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Processing..."
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Place Order
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
    </div>
  );
}