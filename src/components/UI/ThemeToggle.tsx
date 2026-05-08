import { useState, useEffect } from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem('theme', theme);

    if (theme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', systemPrefersDark);
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        const systemPrefersDark = mediaQuery.matches;
        document.documentElement.classList.toggle('dark', systemPrefersDark);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

  if (!mounted) {
    return <div className="h-[52px] w-48 bg-white/5 rounded-2xl animate-pulse"></div>;
  }

  const getButtonStyle = (buttonTheme: 'light' | 'dark' | 'system') => {
    const isActive = theme === buttonTheme;
    const baseStyles = 'flex-1 flex justify-center items-center py-2.5 rounded-xl transition-all duration-500 relative';

    if (isActive) {
      return `${baseStyles} text-orange-500 bg-white dark:bg-white/10 shadow-lg shadow-slate-200/50 dark:shadow-[0_0_20px_rgba(249,115,22,0.3)] scale-110 z-10`;
    }

    return `${baseStyles} text-slate-400 dark:text-white/20 hover:text-slate-900 dark:hover:text-white/60`;
  };

  return (
    <div className="flex items-center p-1.5 bg-slate-200/50 dark:bg-white/5 border border-slate-300/50 dark:border-white/10 rounded-2xl shadow-inner backdrop-blur-xl w-48 transition-all">
      <button onClick={() => setTheme('light')} className={getButtonStyle('light')} aria-label="Light Mode">
        <Sun size={18} fill={theme === 'light' ? 'currentColor' : 'none'} />
      </button>
      <button onClick={() => setTheme('dark')} className={getButtonStyle('dark')} aria-label="Dark Mode">
        <Moon size={18} fill={theme === 'dark' ? 'currentColor' : 'none'} />
      </button>
      <button onClick={() => setTheme('system')} className={getButtonStyle('system')} aria-label="System Theme">
        <Laptop size={18} />
      </button>
    </div>
  );
}
