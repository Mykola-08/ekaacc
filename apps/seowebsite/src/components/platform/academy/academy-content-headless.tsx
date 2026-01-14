'use client';

import React from 'react';
import { BookOpen, Award, GraduationCap, PlayCircle, Clock, CheckCircle, Search } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function AcademyContentHeadless() {
  const courses = [
      { title: "Mindfulness Fundamentals", progress: 65, total: 12, completed: 8, image: "bg-teal-100", icon: "🧘" },
      { title: "Sleep Science 101", progress: 30, total: 10, completed: 3, image: "bg-indigo-100", icon: "😴" },
      { title: "Stress Management Mastery", progress: 0, total: 15, completed: 0, image: "bg-orange-100", icon: "😌" }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-12">
        {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 animate-fade-in">
        <div>
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3">
              <GraduationCap className="w-3 h-3" />
              <span>Learning Center</span>
           </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Academy
          </h1>
          <p className="text-lg text-gray-500 mt-2">
            Expand your knowledge with expert-led courses.
          </p>
        </div>
         <div className="relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
             <input 
                type="text" 
                placeholder="Find a course..."
                className="pl-12 pr-4 py-3 rounded-2xl border-gray-200 bg-white border shadow-sm focus:ring-2 focus:ring-black focus:border-transparent w-full md:w-64 transition-all"
            />
        </div>
      </div>

       <div className="grid gap-8 lg:grid-cols-3 animate-slide-up">
            {/* Main Content: Current Courses */}
            <div className="lg:col-span-2 space-y-8">
                 <div className="flex items-center justify-between">
                     <h2 className="text-xl font-bold text-gray-900">Recommended for you</h2>
                     <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Browse Catalog</button>
                 </div>

                 <div className="space-y-4">
                     {courses.map((course, i) => (
                         <div key={i} className="group bg-white rounded-3xl p-4 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row items-center gap-6 cursor-pointer">
                             <div className={cn("w-full sm:w-32 h-32 rounded-2xl flex items-center justify-center text-5xl", course.image)}>
                                 {course.icon}
                             </div>
                             <div className="grow w-full text-center sm:text-left">
                                 <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{course.title}</h3>
                                 <div className="flex items-center justify-center sm:justify-start gap-4 text-sm text-gray-500 mb-3">
                                     <span className="flex items-center gap-1"><PlayCircle className="w-4 h-4" /> {course.total} Lessons</span>
                                     <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 2h 15m</span>
                                 </div>
                                 <div className="relative pt-2">
                                     <div className="text-xs font-semibold text-gray-500 mb-1 flex justify-between">
                                         <span>{course.progress}% Complete</span>
                                         <span>{course.completed}/{course.total}</span>
                                     </div>
                                     <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                         <div className="h-full bg-black rounded-full transition-all duration-500" style={{ width: `${course.progress}%` }} />
                                     </div>
                                 </div>
                             </div>
                             <div className="shrink-0 self-stretch flex items-center pr-4">
                                 <button className="bg-gray-900 text-white rounded-xl p-3 hover:bg-black transition-colors">
                                     <PlayCircle className="w-6 h-6" />
                                 </button>
                             </div>
                         </div>
                     ))}
                 </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                {/* Certificates */}
                <div className="bg-white rounded-4xl border border-gray-100 shadow-sm p-8">
                     <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                         <Award className="w-5 h-5 text-amber-500" />
                         Achievements
                     </h3>
                     <div className="grid grid-cols-2 gap-4">
                         <div className="aspect-square rounded-2xl bg-amber-50 border border-amber-100 flex flex-col items-center justify-center text-center p-3">
                             <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                                 <span className="text-xl">🏆</span>
                             </div>
                             <span className="text-xs font-bold text-amber-900">Early Adopter</span>
                         </div>
                         <div className="aspect-square rounded-2xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center text-center p-3 opacity-50">
                             <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                                 <span className="text-xl">🎓</span>
                             </div>
                             <span className="text-xs font-bold text-gray-500">Certified</span>
                             <span className="text-[10px] text-gray-400">Locked</span>
                         </div>
                     </div>
                </div>

                {/* Daily Tip */}
                <div className="bg-linear-to-br from-green-500 to-emerald-600 rounded-4xl p-8 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <h3 className="font-bold text-xl mb-2 relative z-10">Daily Insight</h3>
                    <p className="text-green-50 text-sm mb-4 relative z-10">
                        "Learning is not attained by chance, it must be sought for with ardor and attended to with diligence."
                    </p>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-xs font-medium text-white relative z-10 inline-block">
                        Read more &rarr;
                    </div>
                </div>
            </div>
       </div>
    </div>
  );
}
