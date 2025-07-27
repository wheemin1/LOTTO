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
  static generateScratchTicket(): { userNumbers: number[], luckyNumbers: number[] } {
    const userNumbers: number[] = [];
    const luckyNumbers: number[] = [];
    
    // 사용자 번호 6개 생성 (1-20 범위)
    for (let i = 0; i < 6; i++) {
      userNumbers.push(cryptoRandom.randomInt(1, 20));
    }
    
    // 행운 번호 3개 생성 (1-20 범위, 중복 제거)
    while (luckyNumbers.length < 3) {
      const num = cryptoRandom.randomInt(1, 20);
      if (!luckyNumbers.includes(num)) {
        luckyNumbers.push(num);
      }
    }
    
    return { userNumbers, luckyNumbers };
  }
  
  static checkScratchResult(userNumbers: number[], luckyNumbers: number[]): ScratchResult {
    const matches = userNumbers.filter(num => luckyNumbers.includes(num));
    const matchCount = matches.length;
    
    let prize = 0;
    
    // 일치하는 숫자 개수에 따른 당첨금 (기존 확률과 동일하게 유지)
    if (matchCount === 3) {
      prize = 1000000; // 100만원
    } else if (matchCount === 2) {
      prize = 10000; // 1만원  
    } else if (matchCount === 1) {
      prize = 1000; // 1천원
    }
    
    return { matchingNumbers: matches, prize };
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
