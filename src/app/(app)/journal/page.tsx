"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/lib/supabase-auth';
import { useAppStore } from '@/store/app-store';
import { Plus, BookOpen, Smile, Meh, Frown, X, Search, Tag, Heart, Sparkles, Edit3, Save, TrendingUp } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import type { JournalEntry } from '@/lib/types';
import { SettingsShell } from '@/components/eka/settings/settings-shell';
import { SettingsHeader } from '@/components/eka/settings/settings-header';
import { TagInput } from '@/components/eka/forms/tag-input';
import type { ReactElement } from 'react';

const moodIcons: { [key: number]: ReactElement } = {
	1: <Frown className="h-5 w-5 text-red-500" />,
	2: <Frown className="h-5 w-5 text-orange-500" />,
	3: <Meh className="h-5 w-5 text-yellow-500" />,
	4: <Smile className="h-5 w-5 text-lime-500" />,
	5: <Smile className="h-5 w-5 text-green-500" />,
};

const moodDescriptions: { [key: number]: string } = {
	1: 'Very Poor',
	2: 'Poor',
	3: 'Neutral',
	4: 'Good',
	5: 'Very Good',
};

function calculateStreak(entries: JournalEntry[]): number {
	if (entries.length === 0) return 0;
	
	const today = new Date();
	const sortedEntries = entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	
	let streak = 0;
	let currentDate = new Date(today);
	
	for (const entry of sortedEntries) {
		const entryDate = new Date(entry.date);
		const daysDiff = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
		
		if (daysDiff === streak) {
			streak++;
			currentDate.setDate(currentDate.getDate() - 1);
		} else if (daysDiff > streak) {
			break;
		}
	}
	
	return streak;
}

export default function JournalPage() {
	const { toast } = useToast();
	const { user: currentUser, user } = useAuth();
	const dataService = useAppStore((state) => state.dataService);

	const [entries, setEntries] = useState<JournalEntry[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [isCreating, setIsCreating] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedTag, setSelectedTag] = useState<string | null>(null);

	const fetchEntries = useCallback(async () => {
		if (dataService && user?.id) {
			setIsLoading(true);
			const userEntries = await dataService.getJournalEntries(user.id);
			setEntries(userEntries || []);
			setIsLoading(false);
		}
	}, [dataService, user]);

	useEffect(() => {
		fetchEntries();
	}, [fetchEntries]);

	const entriesForSelectedDate = useMemo(
		() => entries.filter((entry) => isSameDay(new Date(entry.date), selectedDate)),
		[entries, selectedDate]
	);

	const filteredEntries = useMemo(() => {
		return entriesForSelectedDate
			.filter((entry) => {
				if (!searchTerm) return true;
				return entry.notes?.toLowerCase().includes(searchTerm.toLowerCase());
			})
			.filter((entry) => {
				if (!selectedTag) return true;
				return entry.tags?.includes(selectedTag);
			});
	}, [entriesForSelectedDate, searchTerm, selectedTag]);

	const allTags = useMemo(() => {
		const tags = new Set<string>();
		entries.forEach(entry => {
			entry.tags?.forEach(tag => tags.add(tag));
		});
		return Array.from(tags);
	}, [entries]);

	const handleSaveEntry = (newEntry: JournalEntry) => {
		setEntries([newEntry, ...entries]);
		setIsCreating(false);
		toast({
			title: 'Entry saved',
			description: 'Your wellness journal entry has been saved.',
		});
	};

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.2
			}
		}
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: "spring",
				stiffness: 100,
				damping: 12
			}
		}
	};

	const moodStats = {
		average: entries.length > 0 ? (entries.reduce((sum, entry) => sum + entry.mood, 0) / entries.length).toFixed(1) : '0',
		entries: entries.length,
		streak: calculateStreak(entries),
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Premium Header */}
				<motion.div 
					className="mb-8"
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: "easeOut" }}
				>
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
						<div>
							<h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-purple-700 bg-clip-text text-transparent mb-2">
								My Wellness Journal
							</h1>
							<p className="text-lg text-slate-600 max-w-2xl">
								Track your mood, symptoms, and progress on your journey to better mental health
							</p>
						</div>
						{!isCreating && (
							<Button 
								onClick={() => setIsCreating(true)} 
								className="premium-button-primary group"
							>
								<Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
								New Entry
							</Button>
						)}
					</div>
				</motion.div>

				{/* Wellness Stats */}
				<motion.div 
					className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
					variants={containerVariants}
					initial="hidden"
					animate="visible"
				>
					<motion.div variants={itemVariants}>
						<Card className="premium-card border-purple-100 bg-gradient-to-br from-purple-50/50 to-white hover:shadow-lg transition-all duration-300">
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-purple-600 mb-1">Total Entries</p>
										<p className="text-3xl font-bold text-slate-900">{moodStats.entries}</p>
									</div>
									<div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
										<BookOpen className="w-6 h-6 text-purple-600" />
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					<motion.div variants={itemVariants}>
						<Card className="premium-card border-green-100 bg-gradient-to-br from-green-50/50 to-white hover:shadow-lg transition-all duration-300">
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-green-600 mb-1">Average Mood</p>
										<p className="text-3xl font-bold text-slate-900">{moodStats.average}/5</p>
									</div>
									<div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
										<Smile className="w-6 h-6 text-green-600" />
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					<motion.div variants={itemVariants}>
						<Card className="premium-card border-blue-100 bg-gradient-to-br from-blue-50/50 to-white hover:shadow-lg transition-all duration-300">
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-blue-600 mb-1">Current Streak</p>
										<p className="text-3xl font-bold text-slate-900">{moodStats.streak} days</p>
									</div>
									<div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
										<TrendingUp className="w-6 h-6 text-blue-600" />
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</motion.div>

				{/* Search and Filter */}
				<motion.div 
					className="mb-8"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3, duration: 0.5 }}
				>
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
							<Input
								placeholder="Search your journal entries..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10 premium-input"
							/>
						</div>
						<Select onValueChange={(value) => setSelectedTag(value === 'all' ? null : value)} value={selectedTag || 'all'}>
							<SelectTrigger className="w-[200px] premium-select">
								<SelectValue placeholder="Filter by tag" />
							</SelectTrigger>
							<SelectContent className="premium-dropdown">
								<SelectItem value="all" className="premium-dropdown-item">All Tags</SelectItem>
								{allTags.map(tag => (
									<SelectItem key={tag} value={tag} className="premium-dropdown-item">{tag}</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</motion.div>

				{/* Main Content Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Journal Entries */}
					<div className="lg:col-span-2 space-y-6">
						<AnimatePresence>
							{isCreating && (
								<motion.div
									initial={{ opacity: 0, scale: 0.95 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.95 }}
									transition={{ duration: 0.3, ease: "easeOut" }}
								>
									<NewEntryCard
										selectedDate={selectedDate}
										onSave={handleSaveEntry}
										onCancel={() => setIsCreating(false)}
									/>
								</motion.div>
							)}
						</AnimatePresence>

						{isLoading ? (
							<JournalSkeleton />
						) : filteredEntries.length > 0 ? (
							filteredEntries.map((entry) => (
								<motion.div
									key={entry.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, ease: "easeOut" }}
								>
									<JournalEntryCard entry={entry} />
								</motion.div>
							))
						) : (
							!isCreating && (
								<motion.div
									initial={{ opacity: 0, scale: 0.95 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ duration: 0.5, ease: "easeOut" }}
								>
									<Card className="premium-card border-dashed border-slate-300 bg-gradient-to-br from-slate-50/50 to-white">
										<CardContent className="p-12 text-center">
											<div className="max-w-md mx-auto">
												<div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
													<BookOpen className="w-8 h-8 text-slate-400" />
												</div>
												<h3 className="text-xl font-semibold text-slate-900 mb-3">
													No entries for this day
												</h3>
												<p className="text-slate-600 mb-6">
														Start your wellness journey by creating your first journal entry. Track your mood, symptoms, and progress over time.
												</p>
												<Button 
													onClick={() => setIsCreating(true)} 
													className="premium-button-primary"
												>
													<Plus className="w-5 h-5 mr-2" />
													Create Your First Entry
												</Button>
											</div>
										</CardContent>
									</Card>
								</motion.div>
							)
						)}
					</div>

					{/* Calendar Sidebar */}
					<div className="space-y-6">
						<Card className="premium-card">
							<CardContent className="p-6">
								<h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
									<Calendar className="w-5 h-5 text-blue-600" />
									Journal Calendar
								</h3>
								<DatePicker
									selected={selectedDate}
									onChange={(date) => date && setSelectedDate(date)}
									className="rounded-lg"
								/>
							</CardContent>
						</Card>

						{/* Wellness Tips */}
						<Card className="premium-card">
							<CardContent className="p-6">
								<h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
									<Sparkles className="w-5 h-5 text-purple-600" />
									Wellness Tips
								</h3>
								<div className="space-y-3">
									<div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
										<p className="text-sm text-slate-700">
											💡 <strong>Pro tip:</strong> Write in your journal at the same time each day to build a consistent habit.
										</p>
									</div>
									<div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100">
										<p className="text-sm text-slate-700">
											🌱 <strong>Remember:</strong> Small daily improvements lead to significant long-term changes.
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}

function NewEntryCard({
	selectedDate,
	onSave,
	onCancel,
}: {
	selectedDate: Date;
	onSave: (entry: JournalEntry) => void;
	onCancel: () => void;
}) {
	const { toast } = useToast();
	const { user: currentUser } = useAuth();
	const dataService = useAppStore((state) => state.dataService);

	const [mood, setMood] = useState(3);
	const [painLevel, setPainLevel] = useState(5);
	const [energyLevel, setEnergyLevel] = useState(5);
	const [notes, setNotes] = useState('');
	const [tags, setTags] = useState<string[]>([]);
	const [isSaving, setIsSaving] = useState(false);

	const handleSave = async () => {
		if (!dataService || !currentUser) return;
		setIsSaving(true);

		const newEntryData: Omit<JournalEntry, 'id'> = {
			date: selectedDate.toISOString(),
			mood,
			painLevel,
			energyLevel,
			notes,
			tags,
			userId: currentUser.id,
		};

		try {
			const savedEntry = await dataService.createJournalEntry(newEntryData);
			if (savedEntry) {
				onSave(savedEntry);
			} else {
				throw new Error('Save operation failed.');
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Could not save your journal entry. Please try again.',
				variant: 'destructive',
			});
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<Card className="premium-card border-blue-100 bg-gradient-to-br from-blue-50/30 to-white">
			<CardHeader className="pb-4">
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="text-xl font-semibold text-slate-900">
							New Entry for {format(selectedDate, 'MMMM d, yyyy')}
						</CardTitle>
						<CardDescription className="text-slate-600">
							How are you feeling today? Take a moment to reflect on your wellness.
						</CardDescription>
					</div>
					<Button 
						variant="outline" 
						className="premium-button-outline h-9 w-9 p-0" 
						onClick={onCancel}
					>
						<X className="h-4 w-4" />
					</Button>
				</div>
			</CardHeader>
			<CardContent className="space-y-8">
				{/* Mood Selector */}
				<div className="space-y-4">
					<Label className="text-base font-semibold text-slate-900 flex items-center gap-2">
						<Heart className="w-5 h-5 text-red-500" />
						Mood:{' '}
						<span className="font-normal text-muted-foreground">
							{moodDescriptions[mood as keyof typeof moodDescriptions]}
						</span>
					</Label>
					<div className="flex gap-3 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl">
						{Object.entries(moodIcons).map(([level, icon]) => (
							<Button
								key={level}
								variant={mood === parseInt(level) ? 'default' : 'outline'}
								className={`h-12 w-12 rounded-xl transition-all duration-200 ${
									mood === parseInt(level) 
										? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105' 
										: 'bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50'
								}`}
								onClick={() => setMood(parseInt(level))}
							>
								{icon}
							</Button>
						))}
					</div>
				</div>

				{/* Pain Level */}
				<div className="space-y-4">
					<Label className="text-base font-semibold text-slate-900 flex items-center justify-between">
						<span>Pain Level</span>
						<span className="font-normal text-muted-foreground">{painLevel}/10</span>
					</Label>
					<Slider
						value={[painLevel]}
						onValueChange={([val]) => setPainLevel(val)}
						max={10}
						step={1}
						className="w-full"
					/>
					<div className="flex justify-between text-xs text-slate-500">
						<span>No Pain</span>
						<span>Extreme Pain</span>
					</div>
				</div>

				{/* Energy Level */}
				<div className="space-y-4">
					<Label className="text-base font-semibold text-slate-900 flex items-center justify-between">
						<span>Energy Level</span>
						<span className="font-normal text-muted-foreground">{energyLevel}/10</span>
					</Label>
					<Slider
						value={[energyLevel]}
						onValueChange={([val]) => setEnergyLevel(val)}
						max={10}
						step={1}
						className="w-full"
					/>
					<div className="flex justify-between text-xs text-slate-500">
						<span>Very Low</span>
						<span>Very High</span>
					</div>
				</div>

				{/* Notes */}
				<div className="space-y-4">
					<Label htmlFor="notes" className="text-base font-semibold text-slate-900 flex items-center gap-2">
						<Edit3 className="w-5 h-5 text-blue-600" />
						Notes & Reflections
					</Label>
					<Textarea
						id="notes"
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
						placeholder="Share your thoughts, symptoms, or anything you'd like to remember about this day..."
						className="min-h-[120px] rounded-xl border-slate-200 focus:border-blue-400 focus:ring-blue-400"
					/>
				</div>

				{/* Tags */}
				<div className="space-y-4">
					<Label className="text-base font-semibold text-slate-900 flex items-center gap-2">
						<Tag className="w-5 h-5 text-purple-600" />
						Tags
					</Label>
					<TagInput value={tags} onChange={setTags} />
				</div>

				{/* Save Button */}
				<div className="flex justify-end pt-4">
					<Button 
						onClick={handleSave} 
						disabled={isSaving} 
						className="premium-button-primary group"
					>
						{isSaving ? (
							<>
								<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
								Saving...
							</>
						) : (
							<>
								<Save className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
								Save Entry
							</>
						)}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

function JournalEntryCard({ entry }: { entry: JournalEntry }) {
	return (
		<Card className="premium-card hover:shadow-lg transition-all duration-300 group">
			<CardHeader className="pb-4">
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
							{format(new Date(entry.date), 'MMMM d, yyyy')}
						</CardTitle>
						<CardDescription className="flex items-center gap-2 text-sm">
							{moodIcons[entry.mood]}
							<span className="font-medium">{moodDescriptions[entry.mood]}</span>
						</CardDescription>
					</div>
					<div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
						{moodIcons[entry.mood]}
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{entry.notes && (
					<div className="p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200">
						<p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
							{entry.notes}
						</p>
					</div>
				)}
				
				<div className="grid grid-cols-2 gap-4">
					<div className="p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-100">
						<div className="flex items-center gap-2 text-sm text-red-700">
							<span className="font-medium">Pain Level</span>
						</div>
						<div className="text-2xl font-bold text-red-600 mt-1">{entry.painLevel}/10</div>
					</div>
					
					<div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100">
						<div className="flex items-center gap-2 text-sm text-green-700">
							<span className="font-medium">Energy Level</span>
						</div>
						<div className="text-2xl font-bold text-green-600 mt-1">{entry.energyLevel}/10</div>
					</div>
				</div>
				
				{entry.tags && entry.tags.length > 0 && (
					<div className="flex flex-wrap gap-2 pt-2">
						{entry.tags.map((tag) => (
							<Badge 
								key={tag} 
								className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 px-3 py-1 rounded-full"
							>
								{tag}
							</Badge>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}

function JournalSkeleton() {
	return (
		<div className="space-y-6">
			<Card className="premium-card animate-pulse">
				<CardHeader className="pb-4">
					<div className="flex items-center justify-between">
						<div>
							<div className="h-6 w-32 bg-slate-200 rounded mb-2"></div>
							<div className="h-4 w-24 bg-slate-200 rounded"></div>
						</div>
						<div className="w-10 h-10 bg-slate-200 rounded-full"></div>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="h-20 bg-slate-200 rounded-xl"></div>
					<div className="grid grid-cols-2 gap-4">
						<div className="h-16 bg-slate-200 rounded-lg"></div>
						<div className="h-16 bg-slate-200 rounded-lg"></div>
					</div>
					<div className="flex gap-2">
						<div className="h-6 w-16 bg-slate-200 rounded-full"></div>
						<div className="h-6 w-20 bg-slate-200 rounded-full"></div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
