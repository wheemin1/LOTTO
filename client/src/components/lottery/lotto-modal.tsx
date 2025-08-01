import { useState } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLotteryStore } from '@/stores/lottery-store';
import { useToast } from '@/hooks/use-toast';
import ResultModal from './result-modal';
import BatchProgress from '@/components/ui/batch-progress';
import { LottoTicket } from '@/types/lottery';

interface LottoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LottoModal({ open, onOpenChange }: LottoModalProps) {
  const [isAuto, setIsAuto] = useState(true);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [gameCount, setGameCount] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [generatedTickets, setGeneratedTickets] = useState<LottoTicket[]>([]);
  const { purchaseLottoTicket, purchaseLottoTicketBatch, batchProgress, setBatchProgress } = useLotteryStore();
  const { toast } = useToast();
  
  const toggleNumber = (number: number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== number));
    } else if (selectedNumbers.length < 6) {
      setSelectedNumbers([...selectedNumbers, number].sort((a, b) => a - b));
    }
  };
  
  const handlePurchase = async () => {
    if (!isAuto && selectedNumbers.length !== 6) {
      toast({
        title: "번호 선택 오류",
        description: "6개의 번호를 선택해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      let newTickets: LottoTicket[];
      
      if (gameCount > 50) {
        // Use batch processing for large counts
        setBatchProgress(true, 0, gameCount, 'lotto');
        
        newTickets = await purchaseLottoTicketBatch(
          selectedNumbers, 
          isAuto, 
          gameCount,
          (current, total) => setBatchProgress(true, current, total, 'lotto')
        );
        
        setBatchProgress(false);
      } else {
        // Use regular processing for small counts
        newTickets = await purchaseLottoTicket(selectedNumbers, isAuto, gameCount);
      }
      
      setGeneratedTickets(newTickets);
      setShowResults(true);
      onOpenChange(false);
      setSelectedNumbers([]);
      setGameCount(1);
      
      toast({
        title: "구매 완료",
        description: `${gameCount}게임의 로또 복권을 구매했습니다.`,
      });
    } catch (error) {
      setBatchProgress(false);
      toast({
        title: "생성 실패",
        description: "다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg w-full max-h-[90vh] overflow-y-auto mx-4">
        <DialogHeader>
          <DialogTitle className="text-lg md:text-xl">로또 6/45</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 md:space-y-6">
          {/* Auto/Manual Toggle */}
          <div className="flex space-x-2">
            <Button
              variant={isAuto ? "default" : "outline"}
              className="flex-1"
              onClick={() => setIsAuto(true)}
            >
              자동
            </Button>
            <Button
              variant={!isAuto ? "default" : "outline"}
              className="flex-1"
              onClick={() => setIsAuto(false)}
            >
              수동
            </Button>
          </div>
          
          {/* Number Grid */}
          {!isAuto && (
            <div className="grid grid-cols-5 sm:grid-cols-9 gap-1 md:gap-2">
              {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => (
                <Button
                  key={num}
                  variant={selectedNumbers.includes(num) ? "default" : "outline"}
                  size="sm"
                  className={`aspect-square p-0 text-xs md:text-sm ${
                    selectedNumbers.includes(num) 
                      ? "bg-blue-600 hover:bg-blue-700 text-white font-bold" 
                      : ""
                  }`}
                  onClick={() => toggleNumber(num)}
                >
                  {num}
                </Button>
              ))}
            </div>
          )}
          
          {/* Selected Numbers Display */}
          {!isAuto && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 md:p-4">
              <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2">선택된 번호</div>
              <div className="flex space-x-2 flex-wrap">
                {selectedNumbers.map((num) => (
                  <div
                    key={num}
                    className="w-7 h-7 md:w-8 md:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs md:text-sm font-bold lottery-ball"
                  >
                    {num}
                  </div>
                ))}
                {Array.from({ length: 6 - selectedNumbers.length }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="w-7 h-7 md:w-8 md:h-8 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center text-xs md:text-sm"
                  >
                    ?
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Game Count */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
            <div>
              <span className="text-gray-700 dark:text-gray-300 block text-sm md:text-base">게임 수</span>
              <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">1게임당 1,000원</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8 md:w-10 md:h-10"
                onClick={() => setGameCount(Math.max(1, gameCount - 1))}
                disabled={gameCount <= 1}
              >
                <Minus className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
              <input
                type="number"
                min="1"
                max="5000"
                value={gameCount}
                onChange={(e) => {
                  const value = Math.min(5000, Math.max(1, parseInt(e.target.value) || 1));
                  setGameCount(value);
                }}
                className="w-16 md:w-20 text-center font-mono bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm md:text-base"
              />
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8 md:w-10 md:h-10"
                onClick={() => setGameCount(Math.min(5000, gameCount + 1))}
                disabled={gameCount >= 5000}
              >
                <Plus className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
            </div>
          </div>
          
          {/* Total Price */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">총 구매 금액</div>
            <div className="text-2xl font-bold text-blue-600">{(gameCount * 1000).toLocaleString()}원</div>
          </div>
          
          {/* Purchase Button */}
          <Button
            onClick={handlePurchase}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-bold"
            size="lg"
          >
            복권 생성하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    
    <ResultModal
      open={showResults}
      onOpenChange={setShowResults}
      tickets={generatedTickets}
      type="lotto"
    />
    
    <BatchProgress
      current={batchProgress.current}
      total={batchProgress.total}
      isVisible={batchProgress.isVisible && batchProgress.type === 'lotto'}
      type="lotto"
    />
    </>
  );
}
