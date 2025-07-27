import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowUpDown, BarChart3 } from 'lucide-react';
import { LottoTicket, ScratchTicket, PensionTicket } from '@/types/lottery';
import { useNavigate } from 'react-router-dom';

interface LottoResultModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tickets: LottoTicket[];
  type: 'lotto';
}

interface ScratchResultModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tickets: ScratchTicket[];
  type: 'scratch';
}

interface PensionResultModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tickets: PensionTicket[];
  type: 'pension';
}

type ResultModalProps = LottoResultModalProps | ScratchResultModalProps | PensionResultModalProps;

export default function ResultModal({ open, onOpenChange, tickets, type }: ResultModalProps) {
  const [sortByPrize, setSortByPrize] = useState(false);
  const navigate = useNavigate();

  const handleAnalyze = () => {
    onOpenChange(false);
    navigate('/stats');
  };

  const getTitle = () => {
    switch (type) {
      case 'lotto': return '로또 6/45 결과';
      case 'scratch': return '스피또1000 결과';
      case 'pension': return '연금복권720+ 결과';
    }
  };

  const getSortedTickets = () => {
    if (!sortByPrize) return tickets;
    
    return [...tickets].sort((a, b) => {
      const prizeA = (a as any).result?.prize || 0;
      const prizeB = (b as any).result?.prize || 0;
      return prizeB - prizeA; // 높은 금액부터
    });
  };

  const renderLottoResults = (lottoTickets: LottoTicket[]) => {
    const winningTickets = lottoTickets.filter(t => t.result && t.result.rank > 0);
    const totalPrize = lottoTickets.reduce((sum, t) => sum + (t.result?.prize || 0), 0);
    const sortedTickets = getSortedTickets() as LottoTicket[];

    return (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            총 {lottoTickets.length}게임 생성
          </div>
          <div className="text-lg text-gray-600 dark:text-gray-400 mb-2">
            구매 금액: {(lottoTickets.length * 1000).toLocaleString()}원
          </div>
          {winningTickets.length > 0 ? (
            <div className="text-lg font-semibold text-green-600">
              🎉 {winningTickets.length}게임 당첨! 총 {totalPrize.toLocaleString()}원
            </div>
          ) : (
            <div className="text-lg text-gray-600 dark:text-gray-400">
              아쉽지만 당첨되지 않았습니다
            </div>
          )}
          <div className={`text-sm mt-2 ${totalPrize - (lottoTickets.length * 1000) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalPrize - (lottoTickets.length * 1000) >= 0 ? '수익' : '손실'}: {Math.abs(totalPrize - (lottoTickets.length * 1000)).toLocaleString()}원
          </div>
        </div>

        <div className="flex justify-center mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortByPrize(!sortByPrize)}
            className="text-xs"
          >
            <ArrowUpDown className="w-3 h-3 mr-1" />
            {sortByPrize ? '원래 순서' : '당첨금 높은순'}
          </Button>
        </div>

        <div className="space-y-3 max-h-60 overflow-y-auto">
          {sortedTickets.map((ticket, index) => (
            <div key={ticket.id} className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  게임 {index + 1}
                </span>
                {ticket.result && ticket.result.rank > 0 ? (
                  <div className="text-sm font-bold text-green-600">
                    {ticket.result.rank}등 - {ticket.result.prize.toLocaleString()}원
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">미당첨</div>
                )}
              </div>
              <div className="flex space-x-1">
                {ticket.numbers.main.map((num, idx) => (
                  <div
                    key={idx}
                    className="w-6 h-6 lottery-ball rounded-full flex items-center justify-center text-xs font-bold text-gray-700 bg-blue-200"
                  >
                    {num}
                  </div>
                ))}
                {ticket.numbers.bonus && (
                  <div className="w-6 h-6 lottery-ball rounded-full flex items-center justify-center text-xs font-bold text-gray-700 bg-red-200 border border-red-400">
                    {ticket.numbers.bonus}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderScratchResults = (scratchTickets: ScratchTicket[]) => {
    const winningTickets = scratchTickets.filter(t => t.result && t.result.prize > 0);
    const totalPrize = scratchTickets.reduce((sum, t) => sum + (t.result?.prize || 0), 0);
    const sortedTickets = getSortedTickets() as ScratchTicket[];

    return (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            총 {scratchTickets.length}매 생성
          </div>
          {winningTickets.length > 0 ? (
            <div className="text-lg font-semibold text-green-600">
              🎉 {winningTickets.length}매 당첨! 총 {totalPrize.toLocaleString()}원
            </div>
          ) : (
            <div className="text-lg text-gray-600 dark:text-gray-400">
              아쉽지만 당첨되지 않았습니다
            </div>
          )}
        </div>

        <div className="flex justify-center mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortByPrize(!sortByPrize)}
            className="text-xs"
          >
            <ArrowUpDown className="w-3 h-3 mr-1" />
            {sortByPrize ? '원래 순서' : '당첨금 높은순'}
          </Button>
        </div>

        <div className="space-y-3 max-h-60 overflow-y-auto">
          {sortedTickets.map((ticket, index) => (
            <div key={ticket.id} className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  티켓 {index + 1}
                </span>
                {ticket.result && ticket.result.prize > 0 ? (
                  <div className="text-sm font-bold text-green-600">
                    당첨 - {ticket.result.prize.toLocaleString()}원
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">미당첨</div>
                )}
              </div>
              <div className="space-y-2">
                <div className="text-xs text-gray-500 dark:text-gray-400">행운숫자: {ticket.luckyNumbers.join(', ')}</div>
                <div className="grid grid-cols-6 gap-1">
                  {ticket.symbols.map((symbol) => (
                    <div
                      key={symbol.id}
                      className={`aspect-square rounded flex items-center justify-center text-sm font-bold ${
                        ticket.luckyNumbers.includes(symbol.number)
                          ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200'
                          : 'bg-gray-200 dark:bg-gray-600'
                      }`}
                    >
                      {symbol.number}
                    </div>
                  ))}
                </div>
                {ticket.result && ticket.result.matchingNumbers.length > 0 && (
                  <div className="text-xs text-green-600">
                    일치: {ticket.result.matchingNumbers.join(', ')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPensionResults = (pensionTickets: PensionTicket[]) => {
    const winningTickets = pensionTickets.filter(t => t.result && t.result.rank > 0);
    const totalPrize = pensionTickets.reduce((sum, t) => sum + (t.result?.totalPrize || 0), 0);

    return (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            총 {pensionTickets.length}장 생성
          </div>
          {winningTickets.length > 0 ? (
            <div className="text-lg font-semibold text-green-600">
              🎉 {winningTickets.length}장 당첨!
            </div>
          ) : (
            <div className="text-lg text-gray-600 dark:text-gray-400">
              아쉽지만 당첨되지 않았습니다
            </div>
          )}
        </div>

        <div className="space-y-3 max-h-60 overflow-y-auto">
          {pensionTickets.map((ticket, index) => (
            <div key={ticket.id} className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  티켓 {index + 1}
                </span>
                {ticket.result && ticket.result.rank > 0 ? (
                  <div className="text-sm font-bold text-green-600">
                    {ticket.result.rank}등
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">미당첨</div>
                )}
              </div>
              <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/20 rounded p-2">
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">조</div>
                    <div className="font-mono text-sm font-bold text-yellow-600">
                      {ticket.numbers.group}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">번</div>
                    <div className="font-mono text-sm font-bold text-yellow-600">
                      {ticket.numbers.number}
                    </div>
                  </div>
                </div>
              </div>
              {ticket.result && ticket.result.rank > 0 && (
                <div className="text-xs text-green-600 mt-1 text-center">
                  {ticket.result.monthlyPrize > 0 
                    ? `월 ${ticket.result.monthlyPrize.toLocaleString()}원`
                    : `${ticket.result.totalPrize.toLocaleString()}원`
                  }
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderResults = () => {
    switch (type) {
      case 'lotto':
        return renderLottoResults(tickets as LottoTicket[]);
      case 'scratch':
        return renderScratchResults(tickets as ScratchTicket[]);
      case 'pension':
        return renderPensionResults(tickets as PensionTicket[]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        
        {renderResults()}
        
        <div className="flex gap-3 mt-6">
          <Button onClick={() => onOpenChange(false)} variant="outline" className="flex-1">
            확인
          </Button>
          <Button onClick={handleAnalyze} className="flex-1">
            <BarChart3 className="w-4 h-4 mr-2" />
            분석하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}