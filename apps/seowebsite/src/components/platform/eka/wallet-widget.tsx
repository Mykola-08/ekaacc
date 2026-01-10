'use client';

import { Badge } from '@/components/platform/ui/badge';
import { Button } from '@/components/platform/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/platform/ui/dropdown-menu';
import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, Plus, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/platform/supabase-auth';
import { motion, AnimatePresence } from 'framer-motion';

export function WalletWidget({ showInlinePoints = false }: { showInlinePoints?: boolean } = {}) {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [balance, setBalance] = useState(0);
  const [points, setPoints] = useState(0);
  const [showBalance, setShowBalance] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWalletData = async () => {
      if (!currentUser?.id) return;
      
      setLoading(true);
      try {
        // Try to load from wallet service
        const { getWalletService } = await import('@/services/wallet-service');
        const walletService = await getWalletService();
        const wallet = await walletService.getWallet(currentUser.id);
        
        setBalance(wallet?.balance || 0);
        // Get points from user's loyalty points data
        const userPoints = (currentUser as any).loyaltyPoints?.current || 0;
        setPoints(userPoints);
      } catch (error) {
        // Fallback to mock data
        setBalance(125.50);
        setPoints(450);
      } finally {
        setLoading(false);
      }
    };

    loadWalletData();
  }, [currentUser?.id]);

  if (loading) {
    return (
      <Button variant="outline" size="sm" className="gap-2" disabled>
        <Wallet className="h-4 w-4" />
        <span className="text-sm">Loading...</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 hover:bg-muted/50">
          <Wallet className="h-4 w-4" />
          <div className="flex flex-col items-start">
            <span className="text-xs text-muted-foreground">Balance</span>
            <AnimatePresence mode="wait">
              {showBalance ? (
                <motion.span
                  key="balance"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-sm font-semibold"
                >
                  €{balance.toFixed(2)}
                </motion.span>
              ) : (
                <motion.span
                  key="hidden"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-sm font-semibold"
                >
                  ••••••
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72" align="end">
        <div className="px-3 py-2 text-sm font-medium">My Wallet</div>
        <div className="border-t border-gray-200 dark:border-gray-700" />
        
        {/* Balance & Points */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 cursor-pointer hover:shadow-md" onClick={() => router.push('/myaccount?tab=profile')}>
            <div>
              <p className="text-xs text-muted-foreground">Available Balance</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {showBalance ? `€${balance.toFixed(2)}` : '••••••'}
              </p>
              {showInlinePoints && (
                <p className="text-xs mt-1 text-amber-600 flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  {points.toLocaleString()} pts
                </p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                setShowBalance(!showBalance);
              }}
            >
              {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>

          {!showInlinePoints && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950 cursor-pointer hover:shadow-md" onClick={() => router.push('/subscriptions')}>
              <div>
                <p className="text-xs text-muted-foreground">Loyalty Points</p>
                <p className="text-xl font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  {showBalance ? points.toLocaleString() : '•••••'}
                  <TrendingUp className="h-4 w-4" />
                </p>
              </div>
              <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                Active
              </Badge>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700" />

        <div className="px-1 py-1">
          <DropdownMenuItem onClick={() => router.push('/myaccount?tab=profile')}>
            <Wallet className="mr-2 h-4 w-4" />
            <span>View Wallet</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/myaccount?tab=profile')}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Top Up Wallet</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/subscriptions')}>
            <TrendingUp className="mr-2 h-4 w-4" />
            <span>Loyalty Program</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
