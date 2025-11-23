import Image from "next/image"
import { LoginForm } from "@/components/login-form"
import SiteFooter from "@/components/layout/site-footer"

export default function LoginPage() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-950 dark:to-slate-900">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <a href="/" className="flex items-center gap-3 self-center font-semibold text-foreground">
                    <Image src="/eka_logo.png" alt="EKA" width={36} height={36} className="rounded-md" />
                    <span>EKA Account</span>
                </a>
                <LoginForm />
            </div>
            <SiteFooter />
        </div>
    )
}
