import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart } from "lucide-react";

export default function DonationsPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Make a Donation</CardTitle>
                    <CardDescription>Support someone's journey to wellness. Your contribution makes a real difference.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[25, 50, 100, 250].map(amount => (
                            <Button key={amount} variant="outline" className="h-16 text-lg">${amount}</Button>
                        ))}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="amount">Or enter a custom amount</Label>
                        <Input id="amount" type="number" placeholder="$50.00" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="recipient">Recipient</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose a recipient (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="any">Help anyone in need</SelectItem>
                                <SelectItem value="jane-doe">Jane Doe</SelectItem>
                                <SelectItem value="john-smith">John Smith</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button>Donate Now</Button>
                </CardContent>
            </Card>
        </div>
        <div>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Heart className="h-5 w-5 text-primary" /> Your Impact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">Total Donated</p>
                        <p className="text-4xl font-bold">$150.00</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">Sessions Funded</p>
                        <p className="text-4xl font-bold">3</p>
                    </div>
                     <div className="text-center">
                        <p className="text-sm text-muted-foreground">Lives Touched</p>
                        <p className="text-4xl font-bold">2</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
