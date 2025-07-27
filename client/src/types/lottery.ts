export type LotteryType = 'lotto645' | 'speetto1000' | 'pension720';

export interface LottoNumbers {
  main: number[];
  bonus?: number;
}

export interface LottoTicket {
  id: string;
  numbers: LottoNumbers;
  isAuto: boolean;
  purchaseDate: Date;
  drawDate: Date;
  result?: LottoResult;
}

export interface LottoResult {
  winningNumbers: LottoNumbers;
  rank: number;
  prize: number;
}

export interface ScratchSymbol {
  id: string;
  symbol: string;
  revealed: boolean;
}

export interface ScratchTicket {
  id: string;
  symbols: ScratchSymbol[];
  purchaseDate: Date;
  isComplete: boolean;
  result?: ScratchResult;
}

export interface ScratchResult {
  matchingSymbols: string[];
  prize: number;
}

export interface PensionNumbers {
  group: string;
  number: string;
}

export interface PensionTicket {
  id: string;
  numbers: PensionNumbers;
  isAuto: boolean;
  purchaseDate: Date;
  drawDate: Date;
  result?: PensionResult;
}

export interface PensionResult {
  winningNumbers: PensionNumbers;
  rank: number;
  monthlyPrize: number;
  totalPrize: number;
}

export interface PurchaseStats {
  totalSpent: number;
  totalWon: number;
  totalTickets: number;
  winCount: number;
  winRate: number;
  roi: number;
}

export interface LotteryState {
  lotto645: {
    tickets: LottoTicket[];
    stats: PurchaseStats;
  };
  speetto1000: {
    tickets: ScratchTicket[];
    stats: PurchaseStats;
  };
  pension720: {
    tickets: PensionTicket[];
    stats: PurchaseStats;
  };
}
