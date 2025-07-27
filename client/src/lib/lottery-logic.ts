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
    // 사용자 번호 6개 생성 (1-9 범위, 중복 없음)
    const userNumbers = cryptoRandom.uniqueRandomInts(6, 1, 9);

    // 행운 번호 1개 생성 (1-9 범위)
    const luckyNumbers = [cryptoRandom.randomInt(1, 9)];

    return { userNumbers, luckyNumbers };
  }

  static checkScratchResult(userNumbers: number[], luckyNumbers: number[]): ScratchResult {
    const luckyNumber = luckyNumbers[0];
    const matches = userNumbers.filter(num => num === luckyNumber);
    const matchCount = matches.length;

    let prize = 0;
    const random = Math.random();

    // 행운숫자와 일치하는 숫자가 있으면 무조건 최소 1000원 당첨
    if (matchCount > 0) {
      // 당첨 등급 결정 (행운숫자 일치시)
      // 1등: 5억원 - 1/5,000,000
      if (random < 1/5000000) {
        prize = 500000000;
      }
      // 2등: 2천만원 - 1/1,000,000  
      else if (random < 1/1000000) {
        prize = 20000000;
      }
      // 3등: 1만원 - 1/181.8
      else if (random < 1/181.8) {
        prize = 10000;
      }
      // 4등: 5천원 - 1/40
      else if (random < 1/40) {
        prize = 5000;
      }
      // 5등: 1천원 (행운숫자 일치시 최소 보장 당첨금)
      else {
        prize = 1000;
      }
    }
    // 행운숫자와 일치하지 않아도 1/3.3 확률로 당첨 가능
    else if (random < 1/3.3) {
      // 행운숫자 불일치시에도 동일한 등급 구조
      if (random < 1/10000000) {
        prize = 500000000;
      } else if (random < 1/2000000) {
        prize = 20000000;
      } else if (random < 1/500) {
        prize = 10000;
      } else if (random < 1/100) {
        prize = 5000;
      } else {
        prize = 1000;
      }
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

export function calculateLottoResult(userNumbers: number[], bonusNumber?: number): LottoResult {
  // Generate winning numbers (6 main + 1 bonus)
  const winningNumbers = LotteryLogic.generateLottoNumbers();
  const winningMain = winningNumbers.main;
  const winningBonus = winningNumbers.bonus;

  // Count matches
  const matches = userNumbers.filter(num => winningMain.includes(num)).length;
  const bonusMatch = bonusNumber === winningBonus;

  // Determine rank and prize based on actual probabilities
  let rank = 0;
  let prize = 0;

  // 실제 확률로 당첨 결정
  const random = Math.random();

  if (matches === 6) {
    // 1등 확률: 1/8,145,060
    if (random < 1/8145060) {
      rank = 1;
      prize = Math.floor(Math.random() * 500000000) + 2000000000; // 20억~25억
    }
  } else if (matches === 5 && bonusMatch) {
    // 2등 확률: 1/1,357,510
    if (random < 1/1357510) {
      rank = 2;
      prize = Math.floor(Math.random() * 40000000) + 40000000; // 4천만~8천만
    }
  } else if (matches === 5) {
    // 3등 확률: 1/35,724
    if (random < 1/35724) {
      rank = 3;
      prize = Math.floor(Math.random() * 500000) + 1500000; // 150만~200만
    }
  } else if (matches === 4) {
    // 4등 확률: 1/733
    if (random < 1/733) {
      rank = 4;
      prize = 50000;
    }
  } else if (matches === 3) {
    // 5등 확률: 1/45
    if (random < 1/45) {
      rank = 5;
      prize = 5000;
    }
  }

  return {
    winningNumbers: { main: winningMain, bonus: winningBonus },
    userNumbers: { main: userNumbers, bonus: bonusNumber },
    matches,
    bonusMatch,
    rank,
    prize
  };
}