export interface Course {
    id: string;
    title: string;
    description: string;
    modules: Module[];
    is_published?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface Module {
    id: string;
    title: string;
    lessons?: Lesson[];
    order?: number;
}

export interface Lesson {
    id: string;
    title: string;
    content: string;
    content_type?: 'article' | 'video' | 'quiz';
    is_published?: boolean;
    article_text?: string;
    video_url?: string;
    questions?: QuizQuestion[];
    created_at?: string;
    updated_at?: string;
}

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correct_answer: number;
}
