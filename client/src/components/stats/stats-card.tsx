import { PurchaseStats } from '@/types/lottery';

interface StatsCardProps {
  title: string;
  stats: PurchaseStats;
  color: 'blue' | 'red' | 'gold';
}

const colorClasses = {
  blue: 'text-blue-600',
  red: 'text-red-600',
  gold: 'text-yellow-600',
};

export default function StatsCard({ title, stats, color }: StatsCardProps) {
  const colorClass = colorClasses[color];
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <h3 className={`text-lg font-bold mb-4 ${colorClass}`}>{title}</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {stats.totalTickets}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">총 구매</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {stats.winCount}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">당첨 횟수</div>
        </div>
        
        <div className="text-center">
          <div className={`text-2xl font-bold mb-1 ${colorClass}`}>
            {stats.winRate.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">당첨률</div>
        </div>
        
        <div className="text-center">
          <div className={`text-2xl font-bold mb-1 ${stats.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stats.roi >= 0 ? '+' : ''}{stats.roi.toFixed(0)}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">수익률</div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">총 구매금액</span>
          <span className="font-bold">₩{stats.totalSpent.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-gray-600 dark:text-gray-400">총 당첨금액</span>
          <span className={`font-bold ${stats.totalWon > 0 ? 'text-green-600' : ''}`}>
            ₩{stats.totalWon.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
