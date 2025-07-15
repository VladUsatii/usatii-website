import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronRight, BookOpen, Clock, CheckCircle, Menu } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

// Mock data - replace with your actual data source
const generateLessons = () => [
  { id: 1, title: 'OBJECTIVE', duration: '1 min', completed: false },
  { id: 2, title: 'PROSPECT SEARCH', duration: '15 min', completed: false },
];

export const articlesData = [
    {
      id: 1,
      lessonId: 1,
      title: 'OBJECTIVE',
      content: `Land 3–5 clients in 30 days by intercepting companies that have already paid for upcoming trade show booth space but have no social strategy for the show.\n\n
      
      You'll do this by:\n

      • Finding businesses that are going to advertise or have a booth at an upcoming trade show.\n
      • Contact these businesses and ask if they have a social strategy.\n
      • If they don't, propose a quick 20-minute call to discuss how they can work our systems into their upcoming lead-gen cycle.\n
      • If they accept, help them get scheduled within 10 minutes of their initial response.`,
      readTime: '1 min read',
      author: 'Vlad Usatii, Founder',
      publishedAt: '2025-06-15'
    },
    {
        id: 2,
        lessonId: 2,
        title: 'ARCHITECTURE',
        content: ``,
        readTime: '1 min read',
        author: 'Vlad Usatii, Founder',
        publishedAt: '2025-06-15'
      },
  ];

const generateArticles = (page = 1, perPage = 5) => {
  const start = (page - 1) * perPage;
  return Array.from({ length: perPage }, (_, i) => ({
    id: start + i + 1,
    lessonId: Math.ceil((start + i + 1) / 3), // Associate articles with lessons
    title: `Lesson ${start + i + 1}`,
    content: `Objective : Land 3–5 niche-vertical clients in ≤ 30 days by intercepting companies that have already paid for upcoming booth space but have no social strategy for the show.`,
    readTime: '5 min read',
    author: 'Course Instructor',
    publishedAt: '2024-01-15'
  }));
};

export default function CourseProgress() {
  const [lessons] = useState(generateLessons());
  const perPage = 5;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [articles, setArticles] = useState(articlesData.slice(0, perPage));
  const [currentArticle, setCurrentArticle] = useState(articles[0]?.id || 1);
  const [currentLesson, setCurrentLesson] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const scrollRef = useRef(null);
  const articleRefs = useRef({});
  const observerRef = useRef(null);

  // Calculate progress
  const completedLessons = lessons.filter(lesson => lesson.completed).length;
  const progressPercentage = (completedLessons / lessons.length) * 100;

  // Intersection Observer for tracking current article
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const target = entry.target;
            const articleId = parseInt(target.dataset.articleId || '0');
            setCurrentArticle(articleId);
            
            // Update current lesson based on article
            const article = articles.find(a => a.id === articleId);
            if (article) {
              setCurrentLesson(article.lessonId);
            }
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '-20% 0px -20% 0px'
      }
    );

    // Observe all article elements
    Object.values(articleRefs.current).forEach((ref) => {
      if (ref) observerRef.current.observe(ref);
    });

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [articles]);

  // Infinite scroll: grab the next slice from articlesData
  const loadMoreArticles = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);

    const nextPage = page + 1;
    const start = (nextPage - 1) * perPage;
    const newSlice = articlesData.slice(start, start + perPage);

    if (newSlice.length === 0) {
      setHasMore(false);
    } else {
      setArticles(prev => [...prev, ...newSlice]);
      setPage(nextPage);
    }
    setLoading(false);
  }, [page, loading, hasMore]);

  // Scroll event handler
  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      
      // Load more when near bottom
      if (scrollHeight - scrollTop <= clientHeight + 200 && hasMore) {loadMoreArticles();}
    };

    scrollElement.addEventListener('scroll', handleScroll);
    return () => scrollElement.removeEventListener('scroll', handleScroll);
  }, [loadMoreArticles]);

  const scrollToLesson = (lessonId) => {
    const article = articles.find(a => a.lessonId === lessonId);
    if (article && articleRefs.current[article.id]) {
      articleRefs.current[article.id]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <div className="h-screen flex bg-background border border-border rounded-lg overflow-hidden shadow-course">
    <Sheet>
        <SheetTitle></SheetTitle>
      {/* mobile hamburger button */}
      <SheetTrigger asChild>
        <button className="flex flex-col h-fit border-[3px] p-2 mx-2 mt-5 rounded-md hover:bg-accent/20 md:hidden">
          <Menu className="w-6 h-6 text-foreground" />
        </button>
      </SheetTrigger>

      {/* mobile sliding panel */}
      <SheetContent side="left" className="w-64 p-4">
        {/* replicate your left-nav here */}
        <div className="border-b pb-4 mb-4">
          <h2 className="font-black italic tracking-tight text-lg">TRADE SHOW PLAN</h2>
          <p className='text-neutral-500 text-sm'>Onboarding</p>
          <div className='flex flex-row justify-between items-center justify-center mt-2 gap-x-2'>
          <Progress value={progressPercentage} className="h-2"/>
          <p className='text-xs font-bold text-neutral-500'>0/2</p>
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-6rem)]">
          {lessons.map(lesson => (
            <button
              key={lesson.id}
              onClick={() => {
                scrollToLesson(lesson.id);
                // close sheet after you jump in
                document.activeElement?.dispatchEvent(
                  new Event('click', { bubbles: true })
                );
              }}
              className={`w-full p-4 rounded-lg text-left transition-all duration-200 hover:bg-accent group ${
                currentLesson === lesson.id 
                  ? 'bg-accent border border-primary/20 shadow-sm' 
                  : 'hover:bg-accent/50'
              }`}
            >
              Lesson {lesson.id}: {lesson.title}
            </button>
          ))}
        </ScrollArea>
      </SheetContent>

      {/* Left Navigation Panel */}
      <div className="hidden md:flex w-80 h-screen sticky top-0 bg-course-nav border-r border-course-nav-border flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-course-nav-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-course rounded-lg flex items-center justify-center bg-neutral-100/50 border-[2px] border-neutral-500">
              <BookOpen className="w-5 h-5 text-neutral-500" />
            </div>
            <div>
              <h2 className="font-black text-foreground tracking-tight italic">TRADE SHOW PLAN</h2>
              <p className="text-sm font-bold text-neutral-500">Onboarding</p>
            </div>
          </div>
          
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">{completedLessons}/{lessons.length}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {Math.round(progressPercentage)}% complete
            </p>
          </div>
        </div>

        {/* Lesson Navigation */}
        <ScrollArea className=" flex-1 p-4">
          <div className="space-y-2">
            {lessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => scrollToLesson(lesson.id)}
                className={`cursor-pointer w-full p-4 rounded-lg text-left transition-all duration-200 hover:bg-accent group ${
                  currentLesson === lesson.id 
                    ? 'bg-accent border border-primary/20 shadow-sm' 
                    : 'hover:bg-accent/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {lesson.completed ? (
                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                      ) : (
                        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                          currentLesson === lesson.id 
                            ? 'border-primary bg-primary/10' 
                            : 'border-muted-foreground/30'
                        }`} />
                      )}
                      <span className="text-xs font-medium text-muted-foreground">
                        Lesson {lesson.id}
                      </span>
                    </div>
                    <h3 className={`font-black italic tracking-tight text-sm mb-1 transition-colors ${
                      currentLesson === lesson.id ? 'text-primary' : 'text-foreground'
                    }`}>
                      {lesson.title}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {lesson.duration}
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${
                    currentLesson === lesson.id ? 'rotate-90 text-primary' : 'group-hover:translate-x-1'
                  }`} />
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right Content Area */}
      <div className="border-l-neutral-200 border-l-[2px] md:border-l-neutral-500 md:border-l-[0px] flex-1 flex flex-col">
        {/* Content Header */}
        <div className="p-6 border-b border-border bg-background/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="tracking-tight text-2xl font-bold text-foreground mb-1">👉 Complete onboarding</h1>
              <p className="text-neutral-500 text-sm">
                Once you complete this course, you will be given access to additional contractor resources.
              </p>
            </div>
            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              {articles.length} articles loaded
            </Badge>
          </div>
        </div>

        {/* Articles Scroll Area */}
        <ScrollArea ref={scrollRef} className="flex-1 h-screen">
          <div className="max-w-4xl mx-auto p-6 space-y-8">
            {articles.map((article) => (
              <article
                key={article.id}
                ref={(el) => articleRefs.current[article.id] = el}
                data-article-id={article.id}
                className={`bg-card rounded-lg p-8 border transition-all duration-300 ${
                  currentArticle === article.id 
                    ? 'border-primary/30 shadow-lg bg-accent/30' 
                    : 'border-border hover:border-border/80'
                }`}
              >
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      Lesson {article.lessonId}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {article.readTime}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {article.title}
                  </h2>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>By {article.author}</span>
                    <span className="mx-2">•</span>
                    <span>{article.publishedAt}</span>
                  </div>
                </div>
                
                <div className="prose prose-gray max-w-none">
                  {article.content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="text-card-foreground leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            ))}

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3 text-muted-foreground">Loading more articles...</span>
              </div>
            )}

            {/* End of Content */}
            {!hasMore && articles.length > 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  🎉 You've reached the end of the course! Great job!
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      </Sheet>
    </div>
  );
}