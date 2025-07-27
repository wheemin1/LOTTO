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
    <div
      className="ticket-texture rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`${title} 선택`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`${colors.badge} px-3 py-1 rounded-full text-sm font-medium`}>
          {title}
        </div>
        <div className={`text-2xl font-bold ${colors.price}`}>{price}</div>
      </div>
      
      {children}
      
      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
      <p className="text-sm text-gray-500 dark:text-gray-500">{prize}</p>
      
      <div className="mt-6 flex items-center justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400">{feature}</span>
        <ArrowRight className={`w-6 h-6 ${colors.icon} group-hover:translate-x-1 transition-transform`} />
      </div>
    </div>
  );
}
