
import MainLayout from "@/components/MainLayout";

export default function MarketingLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <MainLayout>{children}</MainLayout>;
}
