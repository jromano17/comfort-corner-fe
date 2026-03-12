import { Header } from "@/components/header";
import { ChairDetail } from "@/components/chair-detail";

interface ChairPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChairPage({ params }: ChairPageProps) {
  const { id } = await params;
  const chairId = parseInt(id, 10);

  if (isNaN(chairId)) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12 md:px-6">
          <p className="text-center text-destructive">Invalid chair ID</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 md:px-6">
        <ChairDetail chairId={chairId} />
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
