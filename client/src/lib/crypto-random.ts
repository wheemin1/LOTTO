/**
 * Cryptographically secure random number generation using Web Crypto API
 */
export class CryptoRandom {
  private static instance: CryptoRandom;
  
  private constructor() {}
  
  static getInstance(): CryptoRandom {
    if (!CryptoRandom.instance) {
      CryptoRandom.instance = new CryptoRandom();
    }
    return CryptoRandom.instance;
  }
  
  /**
   * Generate a random integer between min and max (inclusive)
   */
  randomInt(min: number, max: number): number {
    const range = max - min + 1;
    const bytesNeeded = Math.ceil(Math.log2(range) / 8);
    const maxValue = Math.pow(256, bytesNeeded);
    const threshold = maxValue - (maxValue % range);
    
    let randomValue: number;
    do {
      const randomBytes = new Uint8Array(bytesNeeded);
      crypto.getRandomValues(randomBytes);
      
      randomValue = 0;
      for (let i = 0; i < bytesNeeded; i++) {
        randomValue = (randomValue << 8) + randomBytes[i];
      }
    } while (randomValue >= threshold);
    
    return min + (randomValue % range);
  }
  
  /**
   * Generate an array of unique random numbers
   */
  uniqueRandomInts(count: number, min: number, max: number): number[] {
    if (count > (max - min + 1)) {
      throw new Error('Cannot generate more unique numbers than available range');
    }
    
    const numbers = new Set<number>();
    while (numbers.size < count) {
      numbers.add(this.randomInt(min, max));
    }
    
    return Array.from(numbers).sort((a, b) => a - b);
  }
  
  /**
   * Shuffle an array using Fisher-Yates algorithm with crypto random
   */
  shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = this.randomInt(0, i);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  
  /**
   * Generate SHA-256 hash for verification
   */
  async generateSeed(): Promise<string> {
    const randomData = new Uint8Array(32);
    crypto.getRandomValues(randomData);
    
    const hashBuffer = await crypto.subtle.digest('SHA-256', randomData);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}

export const cryptoRandom = CryptoRandom.getInstance();
