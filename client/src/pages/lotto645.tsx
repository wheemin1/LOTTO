import { useEffect } from 'react';
import { useLotteryStore } from '@/stores/lottery-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Lotto645() {
  const { lotto645, loadTickets } = useLotteryStore();
  
  useEffect(() => {
    loadTickets();
  }, [loadTickets]);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">로또 6/45</h1>
        <p className="text-gray-600 dark:text-gray-400">생성한 로또 티켓과 결과를 확인하세요</p>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">총 생성</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lotto645.stats.totalTickets}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">당첨 횟수</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{lotto645.stats.winCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">당첨률</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{lotto645.stats.winRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">수익률</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${lotto645.stats.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {lotto645.stats.roi >= 0 ? '+' : ''}{lotto645.stats.roi.toFixed(0)}%
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tickets List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">생성 내역</h2>
        
        {lotto645.tickets.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">아직 생성한 로또가 없습니다.</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">홈에서 로또를 생성해보세요!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {lotto645.tickets.map((ticket) => (
              <Card key={ticket.id}>
                <CardContent className="py-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          ticket.isAuto 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}>
                          {ticket.isAuto ? '자동' : '수동'}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(ticket.purchaseDate).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex space-x-2 mb-2">
                        {ticket.numbers.main.map((num, index) => (
                          <div
                            key={index}
                            className="w-8 h-8 lottery-ball rounded-full flex items-center justify-center text-sm font-bold text-gray-700 bg-blue-200"
                          >
                            {num}
                          </div>
                        ))}
                        {ticket.numbers.bonus && (
                          <div className="w-8 h-8 lottery-ball rounded-full flex items-center justify-center text-sm font-bold text-gray-700 bg-red-200 border-2 border-red-400">
                            {ticket.numbers.bonus}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {ticket.result && ticket.result.rank > 0 ? (
                        <div className={`px-4 py-2 rounded-lg border-2 ${
                          ticket.result.rank === 1 ? 'bg-yellow-50 border-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-600' :
                          ticket.result.rank === 2 ? 'bg-gray-50 border-gray-300 dark:bg-gray-800 dark:border-gray-600' :
                          ticket.result.rank === 3 ? 'bg-orange-50 border-orange-300 dark:bg-orange-900/20 dark:border-orange-600' :
                          'bg-blue-50 border-blue-300 dark:bg-blue-900/20 dark:border-blue-600'
                        }`}>
                          <div className={`text-lg font-bold ${
                            ticket.result.rank === 1 ? 'text-yellow-700 dark:text-yellow-400' :
                            ticket.result.rank === 2 ? 'text-gray-700 dark:text-gray-300' :
                            ticket.result.rank === 3 ? 'text-orange-700 dark:text-orange-400' :
                            'text-blue-700 dark:text-blue-400'
                          }`}>
                            🎉 {ticket.result.rank}등 당첨!
                          </div>
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                            {ticket.result.prize.toLocaleString()}원
                          </div>
                        </div>
                      ) : (
                        <div className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                          <div className="text-sm text-gray-600 dark:text-gray-400">미당첨</div>
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
