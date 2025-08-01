import { ArrowRight } from 'lucide-react';

interface LotteryCardProps {
  title: string;
  price: string;
  description: string;
  prize: string;
  feature: string;
  color: 'blue' | 'red' | 'gold';
  onClick: () => void;
  children?: React.ReactNode;
}

const colorClasses = {
  blue: {
    badge: 'bg-blue-600 text-white',
    price: 'text-blue-600',
    icon: 'text-blue-600',
  },
  red: {
    badge: 'bg-red-600 text-white',
    price: 'text-red-600',
    icon: 'text-red-600',
  },
  gold: {
    badge: 'bg-yellow-600 text-white',
    price: 'text-yellow-600',
    icon: 'text-yellow-600',
  },
};

export default function LotteryCard({
  title,
  price,
  description,
  prize,
  feature,
  color,
  onClick,
  children,
}: LotteryCardProps) {
  const colors = colorClasses[color];
  
  return (
    <div className="ticket-texture rounded-xl md:rounded-2xl p-4 md:p-6 hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div className={`${colors.badge} px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium`}>
          {title}
        </div>
        <div className={`text-lg md:text-2xl font-bold ${colors.price}`}>{price}</div>
      </div>
      
      {children}
      
      <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-3 md:mb-4">{description}</p>
      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-500">{prize}</p>
      
      <div className="mt-4 md:mt-6 flex items-center justify-between">
        <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{feature}</span>
        <button
          onClick={onClick}
          className={`flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium transition-all hover:scale-105 ${colors.badge} hover:opacity-90 text-xs md:text-sm`}
          aria-label={`${title} 시작하기`}
        >
          시작하기
          <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
        </button>
      </div>
    </div>
  );
}
