import { redirect } from "next/navigation"

export default function SignupPage() {
  redirect("http://localhost:9005/signup?returnTo=http://localhost:3000/auth-dispatch")
}