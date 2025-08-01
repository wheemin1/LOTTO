import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LotteryState, LottoTicket, ScratchTicket, PensionTicket, PurchaseStats } from '@/types/lottery';
import { db } from '@/lib/database';
import { LotteryLogic } from '@/lib/lottery-logic';

interface LotteryStore extends LotteryState {
  // Batch processing state
  batchProgress: {
    isVisible: boolean;
    current: number;
    total: number;
    type: 'lotto' | 'scratch' | 'pension' | null;
  };
  
  // Actions
  purchaseLottoTicket: (numbers: number[], isAuto: boolean, gameCount: number) => Promise<LottoTicket[]>;
  purchaseLottoTicketBatch: (numbers: number[], isAuto: boolean, gameCount: number, onProgress?: (current: number, total: number) => void) => Promise<LottoTicket[]>;
  purchaseScratchTicket: (count: number) => Promise<ScratchTicket[]>;
  purchaseScratchTicketBatch: (count: number, onProgress?: (current: number, total: number) => void) => Promise<ScratchTicket[]>;
  purchasePensionTicket: (numbers: { group: string; number: string }, isAuto: boolean) => Promise<PensionTicket[]>;
  
  setBatchProgress: (isVisible: boolean, current?: number, total?: number, type?: 'lotto' | 'scratch' | 'pension' | null) => void;
  
  scratchTicket: (ticketId: string, symbolIndex: number) => Promise<void>;
  
  loadTickets: () => Promise<void>;
  calculateStats: () => void;
  clearAllData: () => Promise<void>;
  exportData: () => Promise<string>;
}

const initialStats: PurchaseStats = {
  totalSpent: 0,
  totalWon: 0,
  totalTickets: 0,
  winCount: 0,
  winRate: 0,
  roi: 0,
};

export const useLotteryStore = create<LotteryStore>()(
  persist(
    (set, get) => ({
      // Batch processing state
      batchProgress: {
        isVisible: false,
        current: 0,
        total: 0,
        type: null,
      },
      
      lotto645: {
        tickets: [],
        stats: { ...initialStats },
      },
      speetto1000: {
        tickets: [],
        stats: { ...initialStats },
      },
      pension720: {
        tickets: [],
        stats: { ...initialStats },
      },

      purchaseLottoTicket: async (numbers, isAuto, gameCount = 1) => {
        const tickets: LottoTicket[] = [];
        
        for (let i = 0; i < gameCount; i++) {
          const ticketNumbers = isAuto 
            ? LotteryLogic.generateLottoNumbers()
            : { main: numbers, bonus: numbers[6] };
          
          const ticket: LottoTicket = {
            id: crypto.randomUUID(),
            numbers: ticketNumbers,
            isAuto,
            purchaseDate: new Date(),
            drawDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
          };
          
          // Simulate draw immediately for demo
          const winningNumbers = LotteryLogic.generateLottoNumbers();
          ticket.result = LotteryLogic.checkLottoResult(ticket.numbers, winningNumbers);
          
          tickets.push(ticket);
          await db.saveLottoTicket(ticket);
        }
        
        set(state => ({
          lotto645: {
            ...state.lotto645,
            tickets: [...tickets, ...state.lotto645.tickets],
          },
        }));
        
        get().calculateStats();
        return tickets;
      },

      purchaseLottoTicketBatch: async (numbers, isAuto, gameCount = 1, onProgress) => {
        if (gameCount <= 10) {
          // Small batches use regular method
          return get().purchaseLottoTicket(numbers, isAuto, gameCount);
        }

        const tickets: LottoTicket[] = [];
        const BATCH_SIZE = 50;
        const totalBatches = Math.ceil(gameCount / BATCH_SIZE);
        
        for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
          const batchTickets: LottoTicket[] = [];
          const currentBatchSize = Math.min(BATCH_SIZE, gameCount - batchIndex * BATCH_SIZE);
          
          // Generate batch of tickets
          for (let i = 0; i < currentBatchSize; i++) {
            const ticketNumbers = isAuto 
              ? LotteryLogic.generateLottoNumbers()
              : { main: numbers, bonus: numbers[6] };
            
            const ticket: LottoTicket = {
              id: crypto.randomUUID(),
              numbers: ticketNumbers,
              isAuto,
              purchaseDate: new Date(),
              drawDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            };
            
            // Simulate draw immediately for demo
            const winningNumbers = LotteryLogic.generateLottoNumbers();
            ticket.result = LotteryLogic.checkLottoResult(ticket.numbers, winningNumbers);
            
            batchTickets.push(ticket);
          }
          
          // Save batch to DB
          await Promise.all(batchTickets.map(ticket => db.saveLottoTicket(ticket)));
          tickets.push(...batchTickets);
          
          // Update progress
          const currentTotal = (batchIndex + 1) * BATCH_SIZE;
          const completed = Math.min(currentTotal, gameCount);
          onProgress?.(completed, gameCount);
          
          // Yield control to prevent UI blocking
          if (batchIndex < totalBatches - 1) {
            await new Promise(resolve => setTimeout(resolve, 10));
          }
        }
        
        set(state => ({
          lotto645: {
            ...state.lotto645,
            tickets: [...tickets, ...state.lotto645.tickets],
          },
        }));
        
        get().calculateStats();
        return tickets;
      },

      purchaseScratchTicket: async (count = 1) => {
        const tickets: ScratchTicket[] = [];
        
        for (let i = 0; i < count; i++) {
          const { userNumbers, luckyNumbers } = LotteryLogic.generateScratchTicket();
          
          // 바로 결과 계산 (스피또는 생성과 동시에 결과가 결정됨)
          const result = LotteryLogic.checkScratchResult(userNumbers, luckyNumbers);
          
          const ticket: ScratchTicket = {
            id: crypto.randomUUID(),
            symbols: userNumbers.map((number, index) => ({
              id: `${crypto.randomUUID()}-${index}`,
              symbol: '❓',
              number,
              revealed: true, // 바로 모든 숫자를 공개
            })),
            luckyNumbers,
            purchaseDate: new Date(),
            isComplete: true, // 바로 완료 상태
            result, // 당첨 결과 바로 포함
          };
          
          tickets.push(ticket);
          await db.saveScratchTicket(ticket);
        }
        
        set(state => ({
          speetto1000: {
            ...state.speetto1000,
            tickets: [...tickets, ...state.speetto1000.tickets],
          },
        }));
        
        get().calculateStats();
        return tickets;
      },

      purchaseScratchTicketBatch: async (count = 1, onProgress) => {
        if (count <= 10) {
          // Small batches use regular method
          return get().purchaseScratchTicket(count);
        }

        const tickets: ScratchTicket[] = [];
        const BATCH_SIZE = 50;
        const totalBatches = Math.ceil(count / BATCH_SIZE);
        
        for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
          const batchTickets: ScratchTicket[] = [];
          const currentBatchSize = Math.min(BATCH_SIZE, count - batchIndex * BATCH_SIZE);
          
          // Generate batch of tickets
          for (let i = 0; i < currentBatchSize; i++) {
            const { userNumbers, luckyNumbers } = LotteryLogic.generateScratchTicket();
            const result = LotteryLogic.checkScratchResult(userNumbers, luckyNumbers);
            
            const ticket: ScratchTicket = {
              id: crypto.randomUUID(),
              symbols: userNumbers.map((number, index) => ({
                id: `${crypto.randomUUID()}-${index}`,
                symbol: '❓',
                number,
                revealed: true,
              })),
              luckyNumbers,
              purchaseDate: new Date(),
              isComplete: true,
              result,
            };
            
            batchTickets.push(ticket);
          }
          
          // Save batch to DB
          await Promise.all(batchTickets.map(ticket => db.saveScratchTicket(ticket)));
          tickets.push(...batchTickets);
          
          // Update progress
          const currentTotal = (batchIndex + 1) * BATCH_SIZE;
          const completed = Math.min(currentTotal, count);
          onProgress?.(completed, count);
          
          // Yield control to prevent UI blocking
          if (batchIndex < totalBatches - 1) {
            await new Promise(resolve => setTimeout(resolve, 10));
          }
        }
        
        set(state => ({
          speetto1000: {
            ...state.speetto1000,
            tickets: [...tickets, ...state.speetto1000.tickets],
          },
        }));
        
        get().calculateStats();
        return tickets;
      },

      purchasePensionTicket: async (numbers, isAuto) => {
        const ticketNumbers = isAuto 
          ? LotteryLogic.generatePensionNumbers()
          : numbers;
        
        const ticket: PensionTicket = {
          id: crypto.randomUUID(),
          numbers: ticketNumbers,
          isAuto,
          purchaseDate: new Date(),
          drawDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        };
        
        // Simulate draw
        const winningNumbers = LotteryLogic.generatePensionNumbers();
        ticket.result = LotteryLogic.checkPensionResult(ticket.numbers, winningNumbers);
        
        await db.savePensionTicket(ticket);
        
        set(state => ({
          pension720: {
            ...state.pension720,
            tickets: [ticket, ...state.pension720.tickets],
          },
        }));
        
        get().calculateStats();
        return [ticket];
      },

      scratchTicket: async (ticketId, symbolIndex) => {
        set(state => ({
          speetto1000: {
            ...state.speetto1000,
            tickets: state.speetto1000.tickets.map(ticket => {
              if (ticket.id === ticketId) {
                const updatedSymbols = ticket.symbols.map((symbol, index) => 
                  index === symbolIndex ? { ...symbol, revealed: true } : symbol
                );
                
                const allRevealed = updatedSymbols.every(s => s.revealed);
                let result = ticket.result;
                
                if (allRevealed && !result) {
                  const userNumbers = updatedSymbols.map(s => s.number);
                  result = LotteryLogic.checkScratchResult(userNumbers, ticket.luckyNumbers);
                }
                
                const updatedTicket = {
                  ...ticket,
                  symbols: updatedSymbols,
                  isComplete: allRevealed,
                  result,
                };
                
                db.saveScratchTicket(updatedTicket);
                return updatedTicket;
              }
              return ticket;
            }),
          },
        }));
        
        get().calculateStats();
      },

      setBatchProgress: (isVisible, current = 0, total = 0, type = null) => {
        set(state => ({
          ...state,
          batchProgress: {
            isVisible,
            current,
            total,
            type,
          },
        }));
      },

      loadTickets: async () => {
        const [lottoTickets, scratchTickets, pensionTickets] = await Promise.all([
          db.getLottoTickets(),
          db.getScratchTickets(),
          db.getPensionTickets(),
        ]);
        
        set({
          lotto645: { tickets: lottoTickets, stats: { ...initialStats } },
          speetto1000: { tickets: scratchTickets, stats: { ...initialStats } },
          pension720: { tickets: pensionTickets, stats: { ...initialStats } },
        });
        
        get().calculateStats();
      },

      calculateStats: () => {
        const state = get();
        
        // Calculate Lotto 6/45 stats
        const lottoStats: PurchaseStats = {
          totalSpent: state.lotto645.tickets.length * 1000,
          totalWon: state.lotto645.tickets.reduce((sum, ticket) => 
            sum + (ticket.result?.prize || 0), 0),
          totalTickets: state.lotto645.tickets.length,
          winCount: state.lotto645.tickets.filter(ticket => 
            ticket.result && ticket.result.prize > 0).length,
          winRate: 0,
          roi: 0,
        };
        
        if (lottoStats.totalTickets > 0) {
          lottoStats.winRate = (lottoStats.winCount / lottoStats.totalTickets) * 100;
          lottoStats.roi = ((lottoStats.totalWon - lottoStats.totalSpent) / lottoStats.totalSpent) * 100;
        }
        
        // Calculate Scratch stats
        const scratchStats: PurchaseStats = {
          totalSpent: state.speetto1000.tickets.length * 1000,
          totalWon: state.speetto1000.tickets.reduce((sum, ticket) => 
            sum + (ticket.result?.prize || 0), 0),
          totalTickets: state.speetto1000.tickets.length,
          winCount: state.speetto1000.tickets.filter(ticket => 
            ticket.result && ticket.result.prize > 0).length,
          winRate: 0,
          roi: 0,
        };
        
        if (scratchStats.totalTickets > 0) {
          scratchStats.winRate = (scratchStats.winCount / scratchStats.totalTickets) * 100;
          scratchStats.roi = ((scratchStats.totalWon - scratchStats.totalSpent) / scratchStats.totalSpent) * 100;
        }
        
        // Calculate Pension stats
        const pensionStats: PurchaseStats = {
          totalSpent: state.pension720.tickets.length * 720,
          totalWon: state.pension720.tickets.reduce((sum, ticket) => 
            sum + (ticket.result?.totalPrize || 0), 0),
          totalTickets: state.pension720.tickets.length,
          winCount: state.pension720.tickets.filter(ticket => 
            ticket.result && ticket.result.totalPrize > 0).length,
          winRate: 0,
          roi: 0,
        };
        
        if (pensionStats.totalTickets > 0) {
          pensionStats.winRate = (pensionStats.winCount / pensionStats.totalTickets) * 100;
          pensionStats.roi = ((pensionStats.totalWon - pensionStats.totalSpent) / pensionStats.totalSpent) * 100;
        }
        
        set({
          lotto645: { ...state.lotto645, stats: lottoStats },
          speetto1000: { ...state.speetto1000, stats: scratchStats },
          pension720: { ...state.pension720, stats: pensionStats },
        });
      },

      clearAllData: async () => {
        await db.clearAllData();
        set({
          lotto645: { tickets: [], stats: { ...initialStats } },
          speetto1000: { tickets: [], stats: { ...initialStats } },
          pension720: { tickets: [], stats: { ...initialStats } },
        });
      },

      exportData: async () => {
        return await db.exportData();
      },
    }),
    {
      name: 'lottery-store',
      partialize: (state) => ({
        // Only persist basic data, not the full tickets (they're in IndexedDB)
        lotto645: { tickets: [], stats: state.lotto645.stats },
        speetto1000: { tickets: [], stats: state.speetto1000.stats },
        pension720: { tickets: [], stats: state.pension720.stats },
      }),
    }
  )
);
