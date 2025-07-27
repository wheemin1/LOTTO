import { useState } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLotteryStore } from '@/stores/lottery-store';
import { useToast } from '@/hooks/use-toast';

interface LottoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LottoModal({ open, onOpenChange }: LottoModalProps) {
  const [isAuto, setIsAuto] = useState(true);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [gameCount, setGameCount] = useState(1);
  const { purchaseLottoTicket } = useLotteryStore();
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
      await purchaseLottoTicket(selectedNumbers, isAuto, gameCount);
      toast({
        title: "구매 완료",
        description: `로또 ${gameCount}게임을 구매했습니다.`,
      });
      onOpenChange(false);
      setSelectedNumbers([]);
      setGameCount(1);
    } catch (error) {
      toast({
        title: "구매 실패",
        description: "다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>로또 6/45</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
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
            <div className="grid grid-cols-9 gap-1">
              {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => (
                <Button
                  key={num}
                  variant={selectedNumbers.includes(num) ? "default" : "outline"}
                  size="sm"
                  className="aspect-square p-0 text-xs"
                  onClick={() => toggleNumber(num)}
                >
                  {num}
                </Button>
              ))}
            </div>
          )}
          
          {/* Selected Numbers Display */}
          {!isAuto && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">선택된 번호</div>
              <div className="flex space-x-2 flex-wrap">
                {selectedNumbers.map((num) => (
                  <div
                    key={num}
                    className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold lottery-ball"
                  >
                    {num}
                  </div>
                ))}
                {Array.from({ length: 6 - selectedNumbers.length }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="w-8 h-8 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center text-sm"
                  >
                    ?
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Game Count */}
          <div className="flex justify-between items-center">
            <span className="text-gray-700 dark:text-gray-300">게임 수</span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8"
                onClick={() => setGameCount(Math.max(1, gameCount - 1))}
                disabled={gameCount <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-8 text-center font-mono">{gameCount}</span>
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8"
                onClick={() => setGameCount(Math.min(5, gameCount + 1))}
                disabled={gameCount >= 5}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Total Cost */}
          <div className="flex justify-between items-center text-lg font-bold">
            <span className="text-gray-900 dark:text-white">총 금액</span>
            <span className="text-blue-600">₩{(gameCount * 1000).toLocaleString()}</span>
          </div>
          
          {/* Purchase Button */}
          <Button
            onClick={handlePurchase}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-bold"
            size="lg"
          >
            구매하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
