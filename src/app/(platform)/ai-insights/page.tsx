import type { Metadata } from "next";
import { AIChatView } from "@/components/ai/chat-view";
import { AIWidgetsSidebar } from "./widgets-sidebar";

export const metadata: Metadata = {
  title: "AI Assistant – EKA",
  description: "Your personal AI wellness companion",
};

export default function AIInsightsPage() {
  return (
    <div className="container mx-auto max-w-7xl px-0 py-4 sm:px-4">
      <div className="flex gap-4">
        {/* Main chat */}
        <div className="min-w-0 flex-1">
          <AIChatView />
        </div>

        {/* Widgets sidebar – hidden on small screens */}
        <div className="hidden w-80 shrink-0 xl:block">
          <AIWidgetsSidebar />
        </div>
      </div>
    </div>
  );
}
