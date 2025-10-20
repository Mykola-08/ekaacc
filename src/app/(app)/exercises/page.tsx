'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dumbbell, 
  Play, 
  Clock, 
  Target, 
  CheckCircle2,
  Search,
  Filter
} from 'lucide-react';

type Exercise = {
  id: string;
  name: string;
  category: 'Stretching' | 'Strength' | 'Mobility' | 'Balance' | 'Cardio';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number; // in minutes
  description: string;
  benefits: string[];
  instructions: string[];
  videoUrl?: string;
  completed?: boolean;
};

export default function ExercisesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock data - replace with Firebase
  const exercises: Exercise[] = [
    {
      id: '1',
      name: 'Cat-Cow Stretch',
      category: 'Stretching',
      difficulty: 'Beginner',
      duration: 5,
      description: 'A gentle flow between two poses that warms the body and brings flexibility to the spine.',
      benefits: ['Improves spine flexibility', 'Relieves back pain', 'Reduces stress'],
      instructions: [
        'Start on your hands and knees in a tabletop position',
        'Arch your back and lift your head and tailbone (Cow)',
        'Round your spine and tuck your chin to chest (Cat)',
        'Repeat for 5-10 breaths'
      ],
      completed: true,
    },
    {
      id: '2',
      name: 'Wall Angels',
      category: 'Mobility',
      difficulty: 'Beginner',
      duration: 5,
      description: 'Improves shoulder mobility and posture by working the muscles between your shoulder blades.',
      benefits: ['Improves posture', 'Increases shoulder mobility', 'Strengthens upper back'],
      instructions: [
        'Stand with your back against a wall',
        'Press your lower back, head, and arms against the wall',
        'Slowly slide your arms up and down the wall',
        'Perform 10-15 repetitions'
      ],
      completed: false,
    },
    {
      id: '3',
      name: 'Hip Flexor Stretch',
      category: 'Stretching',
      difficulty: 'Beginner',
      duration: 8,
      description: 'Targets tight hip flexors, common in people who sit for extended periods.',
      benefits: ['Reduces hip pain', 'Improves posture', 'Increases hip flexibility'],
      instructions: [
        'Kneel on one knee with the other foot flat on the floor',
        'Push your hips forward gently',
        'Hold for 30 seconds',
        'Repeat on the other side'
      ],
      completed: false,
    },
    {
      id: '4',
      name: 'Plank',
      category: 'Strength',
      difficulty: 'Intermediate',
      duration: 10,
      description: 'A core strengthening exercise that also works your shoulders, arms, and glutes.',
      benefits: ['Strengthens core', 'Improves posture', 'Builds endurance'],
      instructions: [
        'Start in a push-up position',
        'Keep your body in a straight line',
        'Hold for 30-60 seconds',
        'Rest and repeat 3 times'
      ],
      completed: true,
    },
    {
      id: '5',
      name: 'Balance Board Work',
      category: 'Balance',
      difficulty: 'Intermediate',
      duration: 15,
      description: 'Improves balance and proprioception while strengthening stabilizer muscles.',
      benefits: ['Improves balance', 'Strengthens ankles', 'Enhances coordination'],
      instructions: [
        'Stand on balance board with feet shoulder-width apart',
        'Try to maintain balance',
        'Start with 30 seconds, gradually increase',
        'Practice daily for best results'
      ],
      completed: false,
    },
  ];

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'Stretching', 'Strength', 'Mobility', 'Balance', 'Cardio'];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'Intermediate':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'Advanced':
        return 'bg-red-500/10 text-red-700 dark:text-red-400';
      default:
        return '';
    }
  };

  const stats = {
    total: exercises.length,
    completed: exercises.filter(e => e.completed).length,
    thisWeek: 5,
    totalMinutes: exercises.reduce((sum, e) => sum + (e.completed ? e.duration : 0), 0),
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Exercise Library</h1>
        <p className="text-muted-foreground">
          Explore therapeutic exercises designed for your wellness journey
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exercises</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.completed / stats.total) * 100).toFixed(0)}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisWeek}</div>
            <p className="text-xs text-muted-foreground">exercises completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Time</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMinutes}</div>
            <p className="text-xs text-muted-foreground">minutes exercised</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full sm:w-auto">
          <TabsList>
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat} className="capitalize">
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Exercise Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {filteredExercises.map((exercise) => (
          <Card key={exercise.id} className="relative">
            {exercise.completed && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-green-500">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              </div>
            )}
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle>{exercise.name}</CardTitle>
                  <CardDescription>{exercise.description}</CardDescription>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline">{exercise.category}</Badge>
                <Badge className={getDifficultyColor(exercise.difficulty)}>
                  {exercise.difficulty}
                </Badge>
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  {exercise.duration} min
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">Benefits:</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {exercise.benefits.map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2">Instructions:</h4>
                <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                  {exercise.instructions.map((instruction, idx) => (
                    <li key={idx}>{instruction}</li>
                  ))}
                </ol>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1">
                  <Play className="h-4 w-4 mr-2" />
                  Start Exercise
                </Button>
                <Button variant="outline">
                  View Video
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="text-center py-12">
          <Dumbbell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
          <h3 className="text-lg font-semibold mb-2">No exercises found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}
