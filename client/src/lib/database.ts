import Dexie, { Table } from 'dexie';
import { LottoTicket, ScratchTicket, PensionTicket } from '@/types/lottery';

interface DatabaseTables {
  lottoTickets: Table<LottoTicket>;
  scratchTickets: Table<ScratchTicket>;
  pensionTickets: Table<PensionTicket>;
  settings: Table<{ key: string; value: any }>;
}

class LotteryDatabase extends Dexie {
  lottoTickets!: Table<LottoTicket>;
  scratchTickets!: Table<ScratchTicket>;
  pensionTickets!: Table<PensionTicket>;
  settings!: Table<{ key: string; value: any }>;

  constructor() {
    super('LotteryDatabase');
    
    this.version(1).stores({
      lottoTickets: 'id, purchaseDate, drawDate, isAuto',
      scratchTickets: 'id, purchaseDate, isComplete',
      pensionTickets: 'id, purchaseDate, drawDate, isAuto',
      settings: 'key, value'
    });
  }
  
  async saveLottoTicket(ticket: LottoTicket): Promise<void> {
    await this.lottoTickets.put(ticket);
  }
  
  async saveScratchTicket(ticket: ScratchTicket): Promise<void> {
    await this.scratchTickets.put(ticket);
  }
  
  async savePensionTicket(ticket: PensionTicket): Promise<void> {
    await this.pensionTickets.put(ticket);
  }
  
  async getLottoTickets(): Promise<LottoTicket[]> {
    return await this.lottoTickets.orderBy('purchaseDate').reverse().toArray();
  }
  
  async getScratchTickets(): Promise<ScratchTicket[]> {
    return await this.scratchTickets.orderBy('purchaseDate').reverse().toArray();
  }
  
  async getPensionTickets(): Promise<PensionTicket[]> {
    return await this.pensionTickets.orderBy('purchaseDate').reverse().toArray();
  }
  
  async getSetting(key: string): Promise<any> {
    const setting = await this.settings.get(key);
    return setting?.value;
  }
  
  async setSetting(key: string, value: any): Promise<void> {
    await this.settings.put({ key, value });
  }
  
  async clearAllData(): Promise<void> {
    await this.transaction('rw', this.lottoTickets, this.scratchTickets, this.pensionTickets, () => {
      this.lottoTickets.clear();
      this.scratchTickets.clear();
      this.pensionTickets.clear();
    });
  }
  
  async exportData(): Promise<string> {
    const data = {
      lottoTickets: await this.getLottoTickets(),
      scratchTickets: await this.getScratchTickets(),
      pensionTickets: await this.getPensionTickets(),
      exportDate: new Date().toISOString()
    };
    
    return JSON.stringify(data, null, 2);
  }
}

export const db = new LotteryDatabase();
