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
    const baseStyles = 'flex-1 flex justify-center items-center py-2 rounded-lg transition-all duration-300 relative';

    if (isActive) {
      return `${baseStyles} text-orange-500 bg-white dark:bg-white/10 z-10`;
    }

    return `${baseStyles} text-slate-900 dark:text-white/20 hover:text-orange-500 dark:hover:text-white/60`;
  };

  return (
    <div className="flex items-center p-0.5 bg-slate-100 dark:bg-white/5 border border-slate-900 dark:border-orange-500 rounded-xl w-[100px] sm:w-40 transition-all">
      <button onClick={() => setTheme('light')} className={getButtonStyle('light')} aria-label="Light Mode">
        <Sun size={12} className="sm:w-[16px] sm:h-[16px]" fill={theme === 'light' ? 'currentColor' : 'none'} />
      </button>
      <button onClick={() => setTheme('dark')} className={getButtonStyle('dark')} aria-label="Dark Mode">
        <Moon size={12} className="sm:w-[16px] sm:h-[16px]" fill={theme === 'dark' ? 'currentColor' : 'none'} />
      </button>
      <button onClick={() => setTheme('system')} className={getButtonStyle('system')} aria-label="System Theme">
        <Laptop size={12} className="sm:w-[16px] sm:h-[16px]" />
      </button>
    </div>
  );
}
