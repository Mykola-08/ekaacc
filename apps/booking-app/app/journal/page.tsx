import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function JournalPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
      <h1 className="text-4xl font-serif mb-4">Journal</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        Reflections on structural integration, somatic awareness, and the journey to balance.
      </p>
      <div className="p-12 border border-dashed rounded-xl bg-muted/20 w-full max-w-2xl">
          <p className="text-sm text-muted-foreground">Coming Soon</p>
      </div>
      <div className="mt-8">
          <Button variant="link" asChild>
              <Link href="/">Return Home</Link>
          </Button>
      </div>
    </div>
  );
}
