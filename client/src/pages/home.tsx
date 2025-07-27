import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useLotteryStore } from '@/stores/lottery-store';
import LotteryCard from '@/components/lottery/lottery-card';
import LottoModal from '@/components/lottery/lotto-modal';
import ScratchModal from '@/components/lottery/scratch-modal';
import PensionModal from '@/components/lottery/pension-modal';

export default function Home() {
  const [showLottoModal, setShowLottoModal] = useState(false);
  const [showScratchModal, setShowScratchModal] = useState(false);
  const [showPensionModal, setShowPensionModal] = useState(false);
  
  const { lotto645, speetto1000, pension720, loadTickets } = useLotteryStore();
  
  useEffect(() => {
    loadTickets();
  }, [loadTickets]);
  
  // Calculate combined stats
  const totalTickets = lotto645.stats.totalTickets + speetto1000.stats.totalTickets + pension720.stats.totalTickets;
  const totalWins = lotto645.stats.winCount + speetto1000.stats.winCount + pension720.stats.winCount;
  const totalSpent = lotto645.stats.totalSpent + speetto1000.stats.totalSpent + pension720.stats.totalSpent;
  const totalWon = lotto645.stats.totalWon + speetto1000.stats.totalWon + pension720.stats.totalWon;
  const winRate = totalTickets > 0 ? (totalWins / totalTickets) * 100 : 0;
  const roi = totalSpent > 0 ? ((totalWon - totalSpent) / totalSpent) * 100 : 0;
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          운을 시험해보세요
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          100% 클라이언트 사이드 복권 시뮬레이터로 언제든지 안전하게 복권의 재미를 경험하세요
        </p>
      </section>

      {/* Lottery Type Selection Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* Lotto 6/45 Card */}
        <LotteryCard
          title="로또 6/45"
          price="₩1,000"
          description="1~45 중 6개 번호 선택"
          prize="1등 당첨금: 약 20억원"
          feature="자동/수동 선택 가능"
          color="blue"
          onClick={() => setShowLottoModal(true)}
        >
          <div className="flex justify-center space-x-2 mb-6">
            <div className="w-10 h-10 lottery-ball rounded-full flex items-center justify-center text-sm font-bold text-gray-700 bg-yellow-200">7</div>
            <div className="w-10 h-10 lottery-ball rounded-full flex items-center justify-center text-sm font-bold text-gray-700 bg-blue-200">14</div>
            <div className="w-10 h-10 lottery-ball rounded-full flex items-center justify-center text-sm font-bold text-gray-700 bg-green-200">23</div>
            <div className="w-10 h-10 lottery-ball rounded-full flex items-center justify-center text-sm font-bold text-gray-700 bg-pink-200">31</div>
            <div className="w-10 h-10 lottery-ball rounded-full flex items-center justify-center text-sm font-bold text-gray-700 bg-purple-200">38</div>
            <div className="w-10 h-10 lottery-ball rounded-full flex items-center justify-center text-sm font-bold text-gray-700 bg-red-200 border-2 border-red-400">42</div>
          </div>
        </LotteryCard>

        {/* Speetto 1000 Card */}
        <LotteryCard
          title="스피또1000"
          price="₩1,000"
          description="즉석 스크래치 복권"
          prize="1등 당첨금: 100만원"
          feature="터치로 스크래치"
          color="red"
          onClick={() => setShowScratchModal(true)}
        >
          <div className="bg-gray-300 dark:bg-gray-600 rounded-lg p-4 mb-6 relative overflow-hidden">
            <div className="scratch-area absolute inset-0 rounded-lg flex items-center justify-center opacity-80">
              <span className="text-gray-600 dark:text-gray-300 font-medium">긁어보세요!</span>
            </div>
            <div className="text-center space-y-2">
              <div className="text-lg font-bold text-yellow-600">★ ★ ★</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">1,000,000원</div>
            </div>
          </div>
        </LotteryCard>

        {/* Pension 720+ Card */}
        <div className="md:col-span-2 lg:col-span-1">
          <LotteryCard
            title="연금복권720+"
            price="₩720"
            description="7자리×2열 번호 선택"
            prize="1등: 월 700만원×20년"
            feature="월 연금 시뮬레이션"
            color="gold"
            onClick={() => setShowPensionModal(true)}
          >
            <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/20 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">조</div>
                  <div className="font-mono text-lg font-bold text-yellow-600">1234567</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">번</div>
                  <div className="font-mono text-lg font-bold text-yellow-600">8901234</div>
                </div>
              </div>
            </div>
          </LotteryCard>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-12">
        <h3 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">주요 기능</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">진정한 난수</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Web Crypto API로 안전한 난수 생성</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-red-600/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">오프라인 지원</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">PWA로 인터넷 없이도 사용 가능</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-600/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">통계 분석</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">구매 내역과 수익률 분석</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-600/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </div>
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">결과 공유</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">CSV/PNG 내보내기 및 SNS 공유</p>
          </div>
        </div>
      </section>

      {/* Quick Stats Preview */}
      <section className="bg-gradient-to-r from-blue-600/5 to-red-600/5 dark:from-blue-600/10 dark:to-red-600/10 rounded-2xl p-8">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">나의 복권 현황</h3>
          <p className="text-gray-600 dark:text-gray-400">지금까지의 구매 내역을 확인해보세요</p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{totalTickets}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">총 구매</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">{totalWins}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">당첨 횟수</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-1">{winRate.toFixed(1)}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">당첨률</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold mb-1 ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {roi >= 0 ? '+' : ''}{roi.toFixed(0)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">수익률</div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <Link href="/stats">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium">
              자세한 통계 보기
            </button>
          </Link>
        </div>
      </section>
      
      {/* Modals */}
      <LottoModal open={showLottoModal} onOpenChange={setShowLottoModal} />
      <ScratchModal open={showScratchModal} onOpenChange={setShowScratchModal} />
      <PensionModal open={showPensionModal} onOpenChange={setShowPensionModal} />
    </div>
  );
}
