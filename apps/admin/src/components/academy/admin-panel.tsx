'use client';

import { Card } from '@/components/ui/card';
import { BookOpen, Award, TrendingUp, Users } from 'lucide-react';
import { AcademyStatistics } from '@/lib/academy/admin';

interface AcademyAdminPanelProps {
  statistics: AcademyStatistics;
}

export function AcademyAdminPanel({ statistics }: AcademyAdminPanelProps) {
  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Courses</p>
              <p className="text-2xl font-bold">{statistics.total_courses}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Enrollments</p>
              <p className="text-2xl font-bold">{statistics.total_enrollments}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Award className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Certificates</p>
              <p className="text-2xl font-bold">{statistics.certificates_issued}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Avg Rating</p>
              <p className="text-2xl font-bold">{statistics.avg_rating}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
