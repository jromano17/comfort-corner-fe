"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ShoppingBag, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner"; 
import { Header } from "@/components/header";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");

  return (
    <Card className="w-full max-w-lg border-none shadow-none text-center bg-transparent">
      <CardHeader>
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
          <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-500" />
        </div>
        <CardTitle className="font-serif text-4xl font-bold">Order Confirmed!</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <p className="text-muted-foreground text-lg">
          Thank you for shopping with Comfort Corner. Your order has been successfully placed and is now being processed.
        </p>
        
        {orderNumber ? (
          <div className="rounded-lg bg-secondary/50 p-6 border">
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2 font-semibold">
              Order Number
            </p>
            <p className="font-mono text-2xl font-bold text-foreground">
              {orderNumber}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            You can always check your order's status.
          </p>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-4 pt-8">
        <Button asChild className="w-full" size="lg">
          <Link href="/my-orders">
            <Package className="mr-2 h-5 w-5" />
            View Your Orders
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full" size="lg">
          <Link href="/">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Continue Shopping
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function CheckoutSuccessPage() {
  return (
  <div className="min-h-screen flex flex-col">
    <Header />
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-12">
      <Suspense fallback={
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-8 w-8 text-primary" />
          <p className="text-muted-foreground">Loading your order details...</p>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  </div>
  );
}