import type { Metadata } from "next";
import { AIChatView } from "@/components/ai/chat-view";

export const metadata: Metadata = {
  title: "AI Assistant – EKA",
  description: "Your personal AI wellness companion",
};

export default function AIInsightsPage() {
  return (
    <div className="container mx-auto max-w-5xl px-0 py-4 sm:px-4">
      <AIChatView />
    </div>
  );
}
