import { Link, useLocation } from 'wouter';
import { Moon, Sun, BarChart3, Settings } from 'lucide-react';
import { useSettingsStore } from '@/stores/settings-store';
import { Button } from '@/components/ui/button';

export default function Header() {
  const [location] = useLocation();
  const { theme, toggleTheme } = useSettingsStore();
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">LuckySim</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">복권 시뮬레이터</p>
              </div>
            </div>
          </Link>
          
          <div className="flex items-center space-x-4">
            {/* Offline indicator */}
            <div className="hidden sm:flex items-center space-x-2 text-xs">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-600 dark:text-gray-400">오프라인 지원</span>
            </div>
            
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-lg"
              aria-label="테마 전환"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
            
            {/* Stats Button */}
            <Link href="/stats">
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-lg ${location === '/stats' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                aria-label="통계 보기"
              >
                <BarChart3 className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
