'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
 Form,
 FormControl,
 FormDescription,
 FormField,
 FormItem,
 FormLabel,
 FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useSimpleAuth } from '@/hooks/platform/auth/use-simple-auth';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const signUpSchema = z
 .object({
 fullName: z.string().min(2, 'Full name must be at least 2 characters').optional(),
 username: z
 .string()
 .min(3, 'Username must be at least 3 characters')
 .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
 .optional(),
 email: z.string().email('Please enter a valid email address'),
 password: z.string().min(6, 'Password must be at least 6 characters'),
 confirmPassword: z.string(),
 })
 .refine((data) => data.password === data.confirmPassword, {
 message: "Passwords don't match",
 path: ['confirmPassword'],
 });

type SignUpFormValues = z.infer<typeof signUpSchema>;

interface SignUpFormProps {
 onSuccess?: () => void;
 onError?: (error: string) => void;
 planId?: string;
}

export function SignUpForm({ onSuccess, onError, planId }: SignUpFormProps) {
 const { signUp, isLoading } = useSimpleAuth();

 const form = useForm<SignUpFormValues>({
 resolver: zodResolver(signUpSchema),
 defaultValues: {
 fullName: '',
 username: '',
 email: '',
 password: '',
 confirmPassword: '',
 },
 });

 async function onSubmit(values: SignUpFormValues) {
 const { error } = await signUp({
 email: values.email,
 password: values.password,
 fullName: values.fullName,
 username: values.username,
 planId: planId,
 });

 if (error) {
 onError?.(error.message);
 form.setError('root', {
 message: error.message,
 });
 } else {
 onSuccess?.();
 }
 }

 return (
 <motion.div
 initial={{ opacity: 0, y: 30 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
 className="mx-auto w-full max-w-[480px]"
 >
 <Card className="relative overflow-hidden rounded-[24px] border border-border/20 bg-card/70 shadow-xl backdrop-blur-2xl ">
 <CardContent className="relative p-8 md:p-10">
 {/* Header */}
 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
 className="mb-8 flex flex-col items-center gap-4 text-center"
 >
 <div className="relative mb-2">
 <div className="relative rounded-[18px] bg-card p-0 shadow-sm">
 <Image
 src="/eka_logo.png"
 alt="EKA"
 width={64}
 height={64}
 className="h-16 w-16 object-contain"
 />
 </div>
 </div>
 <div className="space-y-1">
 <h1 className="text-2xl font-semibold tracking-tight text-foreground">
 Create Account
 </h1>
 <p className="text-sm text-muted-foreground">
 Join EKA Balance today
 </p>
 </div>
 </motion.div>

 <Form {...form}>
 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
 {/* Full Name & Username */}
 <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
 <motion.div
 initial={{ opacity: 0, x: -10 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
 >
 <FormField
 control={form.control}
 name="fullName"
 render={({ field }) => (
 <FormItem className="space-y-1.5">
 <FormLabel className="text-sm font-medium text-foreground">
 Full Name
 </FormLabel>
 <FormControl>
 <Input
 placeholder="John Doe"
 autoComplete="name"
 className="h-11 rounded-[14px] border-input bg-muted/50 px-4 text-base transition-all focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10  "
 {...field}
 />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />
 </motion.div>

 <motion.div
 initial={{ opacity: 0, x: -10 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: 0.25, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
 >
 <FormField
 control={form.control}
 name="username"
 render={({ field }) => (
 <FormItem className="space-y-1.5">
 <FormLabel className="text-sm font-medium text-foreground">
 Username
 </FormLabel>
 <FormControl>
 <Input
 placeholder="johndoe"
 autoComplete="username"
 className="h-11 rounded-[14px] border-input bg-muted/50 px-4 text-base transition-all focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10  "
 {...field}
 />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />
 </motion.div>
 </div>

 <motion.div
 initial={{ opacity: 0, x: -10 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
 >
 <FormField
 control={form.control}
 name="email"
 render={({ field }) => (
 <FormItem className="space-y-1.5">
 <FormLabel className="text-sm font-medium text-foreground">
 Email Address
 </FormLabel>
 <FormControl>
 <Input
 type="email"
 placeholder="name@example.com"
 autoComplete="email"
 className="h-11 rounded-[14px] border-input bg-muted/50 px-4 text-base transition-all focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10  "
 {...field}
 />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />
 </motion.div>

 <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
 <motion.div
 initial={{ opacity: 0, x: -10 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: 0.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
 >
 <FormField
 control={form.control}
 name="password"
 render={({ field }) => (
 <FormItem className="space-y-1.5">
 <FormLabel className="text-sm font-medium text-foreground">
 Password
 </FormLabel>
 <FormControl>
 <Input
 type="password"
 placeholder="••••••••"
 autoComplete="new-password"
 className="h-11 rounded-[14px] border-input bg-muted/50 px-4 text-base transition-all focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10  "
 {...field}
 />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />
 </motion.div>

 <motion.div
 initial={{ opacity: 0, x: -10 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
 >
 <FormField
 control={form.control}
 name="confirmPassword"
 render={({ field }) => (
 <FormItem className="space-y-1.5">
 <FormLabel className="text-sm font-medium text-foreground">
 Confirm
 </FormLabel>
 <FormControl>
 <Input
 type="password"
 placeholder="••••••••"
 autoComplete="new-password"
 className="h-11 rounded-[14px] border-input bg-muted/50 px-4 text-base transition-all focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10  "
 {...field}
 />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />
 </motion.div>
 </div>

 <AnimatePresence mode="wait">
 {form.formState.errors.root && (
 <motion.div
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height: 'auto' }}
 exit={{ opacity: 0, height: 0 }}
 transition={{ duration: 0.2 }}
 >
 <FormMessage className="rounded-[14px] bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600 dark:bg-destructive/10 dark:text-destructive">
 {form.formState.errors.root.message}
 </FormMessage>
 </motion.div>
 )}
 </AnimatePresence>

 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.45, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
 className="pt-2"
 >
 <Button
 type="submit"
 className="h-12 w-full rounded-full bg-primary text-[15px] font-semibold text-white shadow-sm transition-all hover:bg-primary/90 hover:shadow active:scale-[0.98] disabled:opacity-70"
 disabled={isLoading}
 >
 {isLoading ? (
 <Loader2 className="h-5 w-5 animate-spin" />
 ) : (
 'Create Account'
 )}
 </Button>
 </motion.div>
 </form>
 </Form>

 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ delay: 0.5, duration: 0.5 }}
 className="mt-6 text-center"
 >
 <p className="text-sm text-muted-foreground">
 Already have an account?{' '}
 <Link
 href="/login"
 className="font-medium text-primary hover:underline"
 >
 Sign in
 </Link>
 </p>
 </motion.div>
 </CardContent>
 </Card>
 
 {/* Footer / Terms */}
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ delay: 0.6, duration: 0.5 }}
 className="mt-6 text-center"
 >
 <p className="text-xs text-muted-foreground">
 By creating an account, you agree to our{' '}
 <Link href="/terms" className="underline hover:text-foreground dark:hover:text-white">Terms of Service</Link>
 {' '}and{' '}
 <Link href="/privacy" className="underline hover:text-foreground dark:hover:text-white">Privacy Policy</Link>.
 </p>
 </motion.div>
 </motion.div>
 );
}
