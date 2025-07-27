import { useEffect } from 'react';
import { useLotteryStore } from '@/stores/lottery-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Speetto1000() {
  const { speetto1000, loadTickets } = useLotteryStore();
  
  useEffect(() => {
    loadTickets();
  }, [loadTickets]);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">스피또1000</h1>
        <p className="text-gray-600 dark:text-gray-400">생성한 스크래치 티켓과 결과를 확인하세요</p>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">총 생성</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{speetto1000.stats.totalTickets}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">당첨 횟수</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{speetto1000.stats.winCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">당첨률</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{speetto1000.stats.winRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">수익률</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${speetto1000.stats.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {speetto1000.stats.roi >= 0 ? '+' : ''}{speetto1000.stats.roi.toFixed(0)}%
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tickets List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">생성 내역</h2>
        
        {speetto1000.tickets.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">아직 생성한 스크래치가 없습니다.</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">홈에서 스크래치를 생성해보세요!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {speetto1000.tickets.map((ticket) => (
              <Card key={ticket.id}>
                <CardContent className="py-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(ticket.purchaseDate).toLocaleDateString()}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          ticket.isComplete 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {ticket.isComplete ? '완료' : '진행중'}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          행운숫자: {ticket.luckyNumbers.join(', ')}
                        </div>
                        <div className="grid grid-cols-6 gap-2 max-w-xs">
                          {ticket.symbols.map((symbol) => (
                            <div
                              key={symbol.id}
                              className={`aspect-square rounded-lg flex items-center justify-center text-lg font-bold ${
                                ticket.luckyNumbers.includes(symbol.number)
                                  ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200'
                                  : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {symbol.number}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {ticket.result && ticket.result.prize > 0 ? (
                        <div className="px-4 py-3 rounded-lg bg-yellow-50 border-2 border-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-600">
                          <div className="text-lg font-bold text-yellow-700 dark:text-yellow-400">
                            🎉 당첨!
                          </div>
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                            {ticket.result.prize.toLocaleString()}원
                          </div>
                          {ticket.result.matchingNumbers.length > 0 && (
                            <div className="text-sm text-yellow-600 dark:text-yellow-400 mt-1 font-medium">
                              일치: {ticket.result.matchingNumbers.join(', ')}
                            </div>
                          )}
                        </div>
                      ) : ticket.isComplete ? (
                        <div className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                          <div className="text-sm text-gray-600 dark:text-gray-400">미당첨</div>
                        </div>
                      ) : (
                        <div className="px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-600">
                          <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">스크래치 중...</div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
