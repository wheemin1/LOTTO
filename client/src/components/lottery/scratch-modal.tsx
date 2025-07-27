import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLotteryStore } from '@/stores/lottery-store';
import { useToast } from '@/hooks/use-toast';
import ScratchArea from './scratch-area';
import ResultModal from './result-modal';
import { ScratchTicket } from '@/types/lottery';

interface ScratchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ScratchModal({ open, onOpenChange }: ScratchModalProps) {
  const [ticketCount, setTicketCount] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [generatedTickets, setGeneratedTickets] = useState<ScratchTicket[]>([]);
  const { speetto1000, purchaseScratchTicket, scratchTicket } = useLotteryStore();
  const { toast } = useToast();
  
  // Get the latest ticket for scratching
  const currentTicket = speetto1000.tickets[0];
  
  const handlePurchase = async () => {
    try {
      const newTickets = await purchaseScratchTicket(ticketCount);
      setGeneratedTickets(newTickets);
      setShowResults(true);
      onOpenChange(false);
      setTicketCount(1);
    } catch (error) {
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
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>스피또1000</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Current Scratch Card */}
          {currentTicket && !currentTicket.isComplete && (
            <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-6 text-white">
              <div className="text-center mb-4">
                <h4 className="text-lg font-bold">스피또1000</h4>
                <p className="text-sm opacity-90">같은 그림 3개를 찾으세요!</p>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {currentTicket.symbols.map((symbol) => (
                  <ScratchArea
                    key={symbol.id}
                    symbol={symbol}
                    onReveal={handleReveal}
                  />
                ))}
              </div>
              
              {currentTicket.isComplete && currentTicket.result && (
                <div className="text-center mt-4">
                  {currentTicket.result.prize > 0 ? (
                    <div className="text-yellow-300 font-bold">
                      당첨! {currentTicket.result.prize.toLocaleString()}원
                    </div>
                  ) : (
                    <div className="opacity-75">다음 기회에!</div>
                  )}
                </div>
              )}
            </div>
          )}
          
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
                <span className="w-8 text-center font-mono">{ticketCount}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8"
                  onClick={() => setTicketCount(Math.min(10, ticketCount + 1))}
                  disabled={ticketCount >= 10}
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
    </>
  );
}
