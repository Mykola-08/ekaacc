"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/context/auth-context';
import { useAppStore } from '@/store/app-store';
import { Plus, BookOpen, Smile, Meh, Frown, X } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
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

export default function JournalPage() {
	const { toast } = useToast();
	const { appUser: currentUser, user } = useAuth();
	const dataService = useAppStore((state) => state.dataService);

	const [entries, setEntries] = useState<JournalEntry[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [isCreating, setIsCreating] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedTag, setSelectedTag] = useState<string | null>(null);

	const fetchEntries = useCallback(async () => {
		if (dataService && user?.uid) {
			setIsLoading(true);
			const userEntries = await dataService.getJournalEntries(user.uid);
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

	return (
		<SettingsShell>
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<SettingsHeader
					title="My Wellness Journal"
					description="Track your mood, symptoms, and progress over time."
				/>
				{!isCreating && (
					<Button onClick={() => setIsCreating(true)}>
						<Plus className="mr-2 h-4 w-4" />
						New Entry
					</Button>
				)}
			</div>

			<div className="flex gap-4 mb-4">
				<Input
					placeholder="Search entries..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<Select onValueChange={(value) => setSelectedTag(value === 'all' ? null : value)} value={selectedTag || 'all'}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Filter by tag" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Tags</SelectItem>
						{allTags.map(tag => (
							<SelectItem key={tag} value={tag}>{tag}</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="grid gap-8 md:grid-cols-3">
				<div className="md:col-span-2 space-y-6">
					{isCreating && (
						<NewEntryCard
							selectedDate={selectedDate}
							onSave={handleSaveEntry}
							onCancel={() => setIsCreating(false)}
						/>
					)}

					{isLoading ? (
						<JournalSkeleton />
					) : filteredEntries.length > 0 ? (
						filteredEntries.map((entry) => <JournalEntryCard key={entry.id} entry={entry} />)
					) : (
						!isCreating && (
							<Card className="flex flex-col items-center justify-center text-center p-8 border-dashed">
								<BookOpen className="h-12 w-12 text-muted-foreground" />
								<h3 className="mt-4 text-lg font-semibold">No entries for this day</h3>
								<p className="mt-1 text-sm text-muted-foreground">
									Create a new entry to start tracking your wellness.
								</p>
							</Card>
						)
					)}
				</div>

				<div className="md:col-span-1">
					<Card>
						<CardContent className="p-0">
							<Calendar
								mode="single"
								selected={selectedDate}
								onSelect={(date) => date && setSelectedDate(date)}
								className="p-3"
								modifiers={{
									hasEntry: entries.map((e) => new Date(e.date)),
								}}
								modifiersStyles={{
									hasEntry: {
										fontWeight: 'bold',
										textDecoration: 'underline',
									},
								}}
							/>
						</CardContent>
					</Card>
				</div>
			</div>
		</SettingsShell>
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
	const { appUser: currentUser } = useAuth();
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
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle>New Entry for {format(selectedDate, 'MMMM d, yyyy')}</CardTitle>
						<CardDescription>How are you feeling today?</CardDescription>
					</div>
					<Button variant="outline" className="h-9 w-9 p-0" onClick={onCancel}>
						<X className="h-4 w-4" />
					</Button>
				</div>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="space-y-2">
					<Label>
						Mood:{' '}
						<span className="font-normal text-muted-foreground">
							{moodDescriptions[mood as keyof typeof moodDescriptions]}
						</span>
					</Label>
					<div className="flex items-center gap-2">
						{Object.entries(moodIcons).map(([level, icon]) => (
							<Button
								key={level}
								variant={mood === parseInt(level) ? 'default' : 'outline'}
								className="h-10 w-10 p-0"
								onClick={() => setMood(parseInt(level))}
							>
								{icon}
							</Button>
						))}
					</div>
				</div>
				<div className="space-y-2">
					<Label>Pain Level: {painLevel}/10</Label>
					<Slider
						value={[painLevel]}
						onValueChange={([val]) => setPainLevel(val)}
						max={10}
						step={1}
					/>
				</div>
				<div className="space-y-2">
					<Label>Energy Level: {energyLevel}/10</Label>
					<Slider
						value={[energyLevel]}
						onValueChange={([val]) => setEnergyLevel(val)}
						max={10}
						step={1}
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="notes">Notes</Label>
					<Textarea
						id="notes"
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
						placeholder="Any thoughts, symptoms, or events to note?"
					/>
				</div>
				<div className="space-y-2">
					<Label>Tags</Label>
					<TagInput value={tags} onChange={setTags} />
				</div>
				<div className="flex justify-end">
					<Button onClick={handleSave} disabled={isSaving}>
						{isSaving ? 'Saving...' : 'Save Entry'}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

function JournalEntryCard({ entry }: { entry: JournalEntry }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<span>{format(new Date(entry.date), 'MMMM d, yyyy')}</span>
					<div className="flex items-center gap-2 text-sm font-normal">
						{moodIcons[entry.mood]}
						<span>{moodDescriptions[entry.mood]}</span>
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{entry.notes && (
					<p className="text-sm text-foreground/80 whitespace-pre-wrap">{entry.notes}</p>
				)}
				<div className="flex items-center justify-between text-sm text-muted-foreground">
					<span>Pain: {entry.painLevel}/10</span>
					<span>Energy: {entry.energyLevel}/10</span>
				</div>
				{entry.tags && entry.tags.length > 0 && (
					<div className="flex flex-wrap gap-2 pt-2">
						{entry.tags.map((tag) => (
							<Badge key={tag} className="bg-blue-500 text-white">
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
			<Card>
				<CardHeader>
					<Skeleton className="h-6 w-1/2" />
				</CardHeader>
				<CardContent className="space-y-4">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-3/4" />
					<div className="flex justify-between">
						<Skeleton className="h-4 w-1/4" />
						<Skeleton className="h-4 w-1/4" />
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
