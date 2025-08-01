import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLotteryStore } from '@/stores/lottery-store';
import { useToast } from '@/hooks/use-toast';
import ScratchArea from './scratch-area';
import ResultModal from './result-modal';
import BatchProgress from '@/components/ui/batch-progress';
import { ScratchTicket } from '@/types/lottery';

interface ScratchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ScratchModal({ open, onOpenChange }: ScratchModalProps) {
  const [ticketCount, setTicketCount] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [generatedTickets, setGeneratedTickets] = useState<ScratchTicket[]>([]);
  const { speetto1000, purchaseScratchTicket, purchaseScratchTicketBatch, scratchTicket, batchProgress, setBatchProgress } = useLotteryStore();
  const { toast } = useToast();
  
  // Get the latest ticket for scratching
  const currentTicket = speetto1000.tickets[0];
  
  const handlePurchase = async () => {
    try {
      let newTickets: ScratchTicket[];
      
      if (ticketCount > 50) {
        // Use batch processing for large counts
        setBatchProgress(true, 0, ticketCount, 'scratch');
        
        newTickets = await purchaseScratchTicketBatch(
          ticketCount,
          (current, total) => setBatchProgress(true, current, total, 'scratch')
        );
        
        setBatchProgress(false);
      } else {
        // Use regular processing for small counts
        newTickets = await purchaseScratchTicket(ticketCount);
      }
      
      setGeneratedTickets(newTickets);
      setShowResults(true);
      onOpenChange(false);
      setTicketCount(1);
      
      toast({
        title: "구매 완료",
        description: `${ticketCount}장의 스피또1000을 구매했습니다.`,
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
  
  const handleReveal = async (symbolId: string) => {
    if (!currentTicket) return;
    
    const symbolIndex = currentTicket.symbols.findIndex(s => s.id === symbolId);
    if (symbolIndex !== -1) {
      await scratchTicket(currentTicket.id, symbolIndex);
      
      // Check if all symbols are revealed
      const allRevealed = currentTicket.symbols.every(s => s.revealed);
      if (allRevealed && currentTicket.result) {
        if (currentTicket.result.prize > 0) {
          toast({
            title: "축하합니다! 🎉",
            description: `${currentTicket.result.prize.toLocaleString()}원에 당첨되었습니다!`,
          });
        } else {
          toast({
            title: "아쉽습니다",
            description: "다음 기회에 도전해보세요!",
          });
        }
      }
    }
  };
  
  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-4">
        <DialogHeader>
          <DialogTitle className="text-lg md:text-xl">스피또1000</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 md:space-y-6">
          {/* Purchase Options */}
          <div className="space-y-4">
            {/* Ticket Count */}
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">생성 매수</span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8"
                  onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                  disabled={ticketCount <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={ticketCount}
                  onChange={(e) => {
                    const value = Math.min(1000, Math.max(1, parseInt(e.target.value) || 1));
                    setTicketCount(value);
                  }}
                  className="w-16 text-center font-mono bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-1 py-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8"
                  onClick={() => setTicketCount(Math.min(1000, ticketCount + 1))}
                  disabled={ticketCount >= 1000}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Purchase Button */}
            <Button
              onClick={handlePurchase}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-bold"
              size="lg"
            >
              복권 긁기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    
    <ResultModal
      open={showResults}
      onOpenChange={setShowResults}
      tickets={generatedTickets}
      type="scratch"
    />
    
    <BatchProgress
      current={batchProgress.current}
      total={batchProgress.total}
      isVisible={batchProgress.isVisible && batchProgress.type === 'scratch'}
      type="scratch"
    />
    </>
  );
}
