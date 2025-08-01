import { Progress } from '@/components/ui/progress';
import { useEffect } from 'react';

interface BatchProgressProps {
  current: number;
  total: number;
  isVisible: boolean;
  type: 'lotto' | 'scratch' | 'pension';
}

const typeNames = {
  lotto: '로또 6/45',
  scratch: '스피또1000',
  pension: '연금복권720+'
};

export default function BatchProgress({ current, total, isVisible, type }: BatchProgressProps) {
  // 모달이 열려있을 때 body 스크롤 방지
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // cleanup function
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const percentage = (current / total) * 100;
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-xl min-w-72 md:min-w-80 max-w-sm w-full relative z-[10000]">
        <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-center">
          {typeNames[type]} 생성 중...
        </h3>
        
        <div className="space-y-2">
          <Progress value={percentage} className="h-2 md:h-3" />
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 text-center">
            {current.toLocaleString()} / {total.toLocaleString()} ({percentage.toFixed(0)}%)
          </p>
        </div>
        
        <p className="text-xs text-gray-500 mt-2 md:mt-3 text-center">
          잠시만 기다려주세요...
        </p>
      </div>
    </div>
  );
}
