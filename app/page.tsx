import { Header } from "@/components/header";
import { CatalogueGrid } from "@/components/catalogue-grid";

export default function CataloguePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b bg-gradient-to-b from-secondary/50 to-background">
          <div className="container mx-auto px-4 py-12 md:py-16 md:px-6">
            <div className="max-w-2xl">
              <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl text-balance">
                Our Chair Collection
              </h1>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Discover seating that combines exceptional comfort with timeless design. 
                From dining to lounging, find the perfect chair for every space.
              </p>
            </div>
          </div>
        </section>
        <section className="container mx-auto px-4 py-8 md:py-12 md:px-6">
          <CatalogueGrid />
        </section>
      </main>
      <footer className="border-t bg-card py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              Comfort Corner - Where comfort meets design
            </p>
            <p className="text-sm text-muted-foreground">
              Premium seating since 2024
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
