import { getPendingVerifications } from '@/server/finance/actions'
import { FinanceVerifications } from "@/components/admin/finance/FinanceVerifications"

export default async function AdminFinancePage() {
 const items = await getPendingVerifications()

 return <FinanceVerifications items={items} />
}
