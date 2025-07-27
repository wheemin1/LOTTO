import { cryptoRandom } from './crypto-random';
import { LottoNumbers, LottoResult, ScratchResult, PensionNumbers, PensionResult } from '@/types/lottery';

export class LotteryLogic {
  // Lotto 6/45 Logic
  static generateLottoNumbers(): LottoNumbers {
    const main = cryptoRandom.uniqueRandomInts(6, 1, 45);
    const bonus = cryptoRandom.randomInt(1, 45);
    
    return { main, bonus };
  }
  
  static checkLottoResult(playerNumbers: LottoNumbers, winningNumbers: LottoNumbers): LottoResult {
    const mainMatches = playerNumbers.main.filter(num => 
      winningNumbers.main.includes(num)
    ).length;
    
    const bonusMatch = winningNumbers.main.includes(playerNumbers.bonus || 0);
    
    let rank = 0;
    let prize = 0;
    
    if (mainMatches === 6) {
      rank = 1;
      prize = 2000000000; // 20억
    } else if (mainMatches === 5 && bonusMatch) {
      rank = 2;
      prize = 30000000; // 3천만
    } else if (mainMatches === 5) {
      rank = 3;
      prize = 1500000; // 150만
    } else if (mainMatches === 4) {
      rank = 4;
      prize = 50000; // 5만
    } else if (mainMatches === 3) {
      rank = 5;
      prize = 5000; // 5천
    }
    
    return { winningNumbers, rank, prize };
  }
  
  // Scratch Logic
  static generateScratchTicket(): string[] {
    const symbols = ['🍒', '🍋', '🔔', '⭐', '💎', '🍀'];
    const grid = [];
    
    // Determine if this is a winning ticket (10% chance)
    const isWinner = cryptoRandom.randomInt(1, 100) <= 10;
    
    if (isWinner) {
      // Place 3 matching symbols
      const winningSymbol = symbols[cryptoRandom.randomInt(0, symbols.length - 1)];
      const positions = cryptoRandom.shuffle([0, 1, 2, 3, 4, 5]).slice(0, 3);
      
      for (let i = 0; i < 6; i++) {
        if (positions.includes(i)) {
          grid[i] = winningSymbol;
        } else {
          const otherSymbols = symbols.filter(s => s !== winningSymbol);
          grid[i] = otherSymbols[cryptoRandom.randomInt(0, otherSymbols.length - 1)];
        }
      }
    } else {
      // Generate losing combination
      for (let i = 0; i < 6; i++) {
        grid[i] = symbols[cryptoRandom.randomInt(0, symbols.length - 1)];
      }
      
      // Ensure no 3 matches
      const symbolCounts = new Map<string, number>();
      grid.forEach(symbol => {
        symbolCounts.set(symbol, (symbolCounts.get(symbol) || 0) + 1);
      });
      
      // If we accidentally created a winning combination, fix it
      for (const [symbol, count] of symbolCounts.entries()) {
        if (count >= 3) {
          const indices = grid.map((s, i) => s === symbol ? i : -1).filter(i => i !== -1);
          const toChange = indices.slice(2); // Keep only 2
          
          toChange.forEach(index => {
            const otherSymbols = symbols.filter(s => s !== symbol);
            grid[index] = otherSymbols[cryptoRandom.randomInt(0, otherSymbols.length - 1)];
          });
        }
      }
    }
    
    return grid;
  }
  
  static checkScratchResult(symbols: string[]): ScratchResult {
    const symbolCounts = new Map<string, number>();
    symbols.forEach(symbol => {
      symbolCounts.set(symbol, (symbolCounts.get(symbol) || 0) + 1);
    });
    
    const matchingSymbols: string[] = [];
    let prize = 0;
    
    for (const [symbol, count] of symbolCounts.entries()) {
      if (count >= 3) {
        matchingSymbols.push(symbol);
        
        // Prize based on symbol
        switch (symbol) {
          case '💎':
            prize = 1000000; // 100만원
            break;
          case '⭐':
            prize = 100000; // 10만원
            break;
          case '🍀':
            prize = 50000; // 5만원
            break;
          case '🔔':
            prize = 10000; // 1만원
            break;
          case '🍋':
            prize = 5000; // 5천원
            break;
          case '🍒':
            prize = 1000; // 1천원
            break;
        }
      }
    }
    
    return { matchingSymbols, prize };
  }
  
  // Pension 720+ Logic
  static generatePensionNumbers(): PensionNumbers {
    const group = cryptoRandom.randomInt(1000000, 9999999).toString();
    const number = cryptoRandom.randomInt(1000000, 9999999).toString();
    
    return { group, number };
  }
  
  static checkPensionResult(playerNumbers: PensionNumbers, winningNumbers: PensionNumbers): PensionResult {
    const groupMatch = playerNumbers.group === winningNumbers.group;
    const numberMatch = playerNumbers.number === winningNumbers.number;
    
    let rank = 0;
    let monthlyPrize = 0;
    let totalPrize = 0;
    
    if (groupMatch && numberMatch) {
      rank = 1;
      monthlyPrize = 7000000; // 월 700만원
      totalPrize = monthlyPrize * 12 * 20; // 20년
    } else if (numberMatch) {
      rank = 2;
      monthlyPrize = 1000000; // 월 100만원
      totalPrize = monthlyPrize * 12 * 10; // 10년
    } else if (groupMatch) {
      rank = 3;
      monthlyPrize = 0;
      totalPrize = 1000000; // 일시불 100만원
    }
    
    return { winningNumbers, rank, monthlyPrize, totalPrize };
  }
}
