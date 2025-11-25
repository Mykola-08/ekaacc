import { redirect } from "next/navigation"

export default function LoginPage() {
    redirect("http://localhost:9005/login?returnTo=http://localhost:3000/auth-dispatch")
}
