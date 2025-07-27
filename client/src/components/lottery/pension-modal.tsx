import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLotteryStore } from '@/stores/lottery-store';
import { useToast } from '@/hooks/use-toast';

interface PensionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PensionModal({ open, onOpenChange }: PensionModalProps) {
  const [isAuto, setIsAuto] = useState(true);
  const [group, setGroup] = useState('');
  const [number, setNumber] = useState('');
  const { purchasePensionTicket } = useLotteryStore();
  const { toast } = useToast();
  
  const handlePurchase = async () => {
    if (!isAuto && (group.length !== 7 || number.length !== 7)) {
      toast({
        title: "번호 입력 오류",
        description: "조와 번호를 각각 7자리로 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const numbers = isAuto ? { group: '', number: '' } : { group, number };
      await purchasePensionTicket(numbers, isAuto);
      toast({
        title: "구매 완료",
        description: "연금복권720+을 구매했습니다.",
      });
      onOpenChange(false);
      setGroup('');
      setNumber('');
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
          <DialogTitle>연금복권720+</DialogTitle>
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
          
          {/* Number Input */}
          {!isAuto && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="group">조 (7자리)</Label>
                <Input
                  id="group"
                  type="text"
                  placeholder="1234567"
                  value={group}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 7);
                    setGroup(value);
                  }}
                  className="font-mono text-center text-lg"
                />
              </div>
              
              <div>
                <Label htmlFor="number">번 (7자리)</Label>
                <Input
                  id="number"
                  type="text"
                  placeholder="8901234"
                  value={number}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 7);
                    setNumber(value);
                  }}
                  className="font-mono text-center text-lg"
                />
              </div>
            </div>
          )}
          
          {/* Number Preview */}
          <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/20 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">조</div>
                <div className="font-mono text-lg font-bold text-yellow-600">
                  {isAuto ? '자동선택' : group || '0000000'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">번</div>
                <div className="font-mono text-lg font-bold text-yellow-600">
                  {isAuto ? '자동선택' : number || '0000000'}
                </div>
              </div>
            </div>
          </div>
          
          {/* Prize Info */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">당첨금 안내</h4>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>1등 (조+번 일치)</span>
                <span className="font-bold text-yellow-600">월 700만원×20년</span>
              </div>
              <div className="flex justify-between">
                <span>2등 (번 일치)</span>
                <span className="font-bold">월 100만원×10년</span>
              </div>
              <div className="flex justify-between">
                <span>3등 (조 일치)</span>
                <span className="font-bold">100만원</span>
              </div>
            </div>
          </div>
          
          {/* Total Cost */}
          <div className="flex justify-between items-center text-lg font-bold">
            <span className="text-gray-900 dark:text-white">총 금액</span>
            <span className="text-yellow-600">₩720</span>
          </div>
          
          {/* Purchase Button */}
          <Button
            onClick={handlePurchase}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 text-lg font-bold"
            size="lg"
          >
            구매하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
