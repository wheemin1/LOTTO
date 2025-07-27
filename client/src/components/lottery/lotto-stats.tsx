import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLotteryStore } from '@/stores/lottery-store';

export default function LottoStats() {
  const { lotto645 } = useLotteryStore();
  
  // 당첨 번호 통계 계산
  const getWinningNumberStats = () => {
    const numberCounts: { [key: number]: number } = {};
    
    // 당첨된 티켓들에서 번호 추출
    lotto645.tickets.forEach(ticket => {
      if (ticket.result && ticket.result.rank > 0) {
        ticket.numbers.main.forEach(num => {
          numberCounts[num] = (numberCounts[num] || 0) + 1;
        });
      }
    });
    
    // 카운트가 있는 번호들을 내림차순으로 정렬
    return Object.entries(numberCounts)
      .map(([num, count]) => ({ number: parseInt(num), count }))
      .sort((a, b) => b.count - a.count);
  };

  const winningStats = getWinningNumberStats();
  const hasWinningNumbers = winningStats.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
          당첨 번호 통계
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasWinningNumbers ? (
          <div className="space-y-3">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              많이 당첨된 번호 순서
            </div>
            <div className="grid gap-2 max-h-40 overflow-y-auto">
              {winningStats.map(({ number, count }, index) => (
                <div 
                  key={number}
                  className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-gray-500 dark:text-gray-400 w-4">
                      {index + 1}
                    </span>
                    <div className="w-8 h-8 lottery-ball rounded-full flex items-center justify-center text-sm font-bold text-gray-700 bg-blue-200">
                      {number}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-blue-600">
                    {count}회
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              아직 당첨된 번호가 없습니다
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              로또를 생성해서 당첨되면 여기에 통계가 표시됩니다
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}