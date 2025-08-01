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
      <section className="text-center mb-8 md:mb-16 px-4">
        <div className="flex items-center justify-center mb-4 md:mb-6">
          <img 
            src="/lotto-logo.svg" 
            alt="로또 로고" 
            className="w-12 h-12 md:w-16 md:h-16 mr-3 md:mr-4"
          />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            로또 분석 시뮬레이션
          </h1>
        </div>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-2">
          로또6/45, 스피또1000, 연금복권720+ 가상 분석과 통계로 당첨 패턴을 확인하세요. 
          100% 클라이언트 사이드로 안전하게 복권 분석을 체험할 수 있습니다.
        </p>
      </section>

      {/* Dashboard Section - 나의 복권 현황 */}
      <section className="mb-8 md:mb-12 px-4">
        <div className="bg-gradient-to-r from-blue-50 to-red-50 dark:from-blue-900/20 dark:to-red-900/20 rounded-xl md:rounded-2xl p-4 md:p-6 border border-blue-100 dark:border-blue-800">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 text-center">
            📊 나의 복권 현황
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 md:p-4 text-center shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="text-lg md:text-2xl font-bold text-blue-600 dark:text-blue-400">{totalTickets.toLocaleString()}</div>
              <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">구매한 복권</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 md:p-4 text-center shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="text-lg md:text-2xl font-bold text-green-600 dark:text-green-400">{totalWins.toLocaleString()}</div>
              <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">당첨 횟수</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 md:p-4 text-center shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="text-lg md:text-2xl font-bold text-red-600 dark:text-red-400">{totalSpent.toLocaleString()}원</div>
              <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">총 구매액</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 md:p-4 text-center shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="text-lg md:text-2xl font-bold text-green-600 dark:text-green-400">{totalWon.toLocaleString()}원</div>
              <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">총 당첨금</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 md:p-4 text-center shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="text-lg md:text-2xl font-bold text-purple-600 dark:text-purple-400">{winRate.toFixed(1)}%</div>
              <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">당첨율</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 md:p-4 text-center shadow-sm border border-gray-100 dark:border-gray-700">
              <div className={`text-lg md:text-2xl font-bold ${roi >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {roi >= 0 ? '+' : ''}{roi.toFixed(1)}%
              </div>
              <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">수익률</div>
            </div>
          </div>
          
          {/* 자세한 통계 보기 버튼 */}
          {totalTickets > 0 && (
            <div className="text-center mt-4 md:mt-6">
              <Link href="/stats">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg text-sm md:text-base font-medium transition-colors duration-200 shadow-sm hover:shadow-md">
                  📈 자세한 통계 보기
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Lottery Type Selection Cards */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12 px-4">
        {/* Lotto 6/45 Card */}
        <LotteryCard
          title="로또 6/45"
          price="1,000원"
          description="1~45 중 6개 번호 선택"
          prize="1등 당첨금: 약 20~25억원"
          feature="자동/수동 선택 가능"
          color="blue"
          onClick={() => setShowLottoModal(true)}
        >
          {/* 공 6개 + 보너스 공 1개 (이미지 2번째 참고) */}
          <div className="flex justify-center items-center space-x-1 md:space-x-2 mb-3 md:mb-4">
            <div className="w-8 h-8 md:w-10 md:h-10 lottery-ball rounded-full flex items-center justify-center text-xs md:text-sm font-bold text-black bg-orange-400 shadow-sm border border-orange-500">1</div>
            <div className="w-8 h-8 md:w-10 md:h-10 lottery-ball rounded-full flex items-center justify-center text-xs md:text-sm font-bold text-black bg-orange-400 shadow-sm border border-orange-500">4</div>
            <div className="w-8 h-8 md:w-10 md:h-10 lottery-ball rounded-full flex items-center justify-center text-xs md:text-sm font-bold text-black bg-red-500 shadow-sm border border-red-600">29</div>
            <div className="w-8 h-8 md:w-10 md:h-10 lottery-ball rounded-full flex items-center justify-center text-xs md:text-sm font-bold text-black bg-gray-400 shadow-sm border border-gray-500">39</div>
            <div className="w-8 h-8 md:w-10 md:h-10 lottery-ball rounded-full flex items-center justify-center text-xs md:text-sm font-bold text-black bg-green-500 shadow-sm border border-green-600">43</div>
            <div className="w-8 h-8 md:w-10 md:h-10 lottery-ball rounded-full flex items-center justify-center text-xs md:text-sm font-bold text-black bg-green-600 shadow-sm border border-green-700">45</div>
            <div className="text-lg font-bold text-gray-500 mx-1">+</div>
            <div className="w-8 h-8 md:w-10 md:h-10 lottery-ball rounded-full flex items-center justify-center text-xs md:text-sm font-bold text-black bg-gray-500 shadow-sm border border-gray-600">31</div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-3">
            <div className="text-center">
              <div className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-1">당첨 확률</div>
              <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                <div>1등: 1/814만</div>
                <div>2등: 1/135만 • 3등: 1/3.5만</div>
              </div>
            </div>
          </div>
        </LotteryCard>

        {/* Speetto 1000 Card - 확률 정보 수정 (이미지 4번째 참고) */}
        <LotteryCard
          title="스피또1000"
          price="1,000원"
          description="즉석 스크래치 복권"
          prize="1등 당첨금: 5억원"
          feature="터치로 스크래치"
          color="red"
          onClick={() => setShowScratchModal(true)}
        >
          {/* 정확한 당첨 정보 (이미지 4번째 참고) */}
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
            <div className="text-center">
              <div className="text-sm font-semibold text-red-700 dark:text-red-300 mb-1">주요 당첨금</div>
              <div className="text-xs text-red-600 dark:text-red-400 space-y-1">
                <div>1등: 5억원 (1/5,000,000)</div>
                <div>2등: 2천만원 (1/1,000,000)</div>
                <div>3등: 1만원 (1/181.8)</div>
                <div>4등: 5천원 (1/40) • 5등: 1천원 (1/3.3)</div>
              </div>
            </div>
          </div>
        </LotteryCard>

        {/* Pension 720+ Card */}
        <LotteryCard
          title="연금복권720+"
          price="1,000원"
          description="7자리×2열 번호 선택"
          prize="1등: 월 700만원 20년간"
          feature="7자리 번호 2세트"
          color="gold"
          onClick={() => setShowPensionModal(true)}
        >
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-2 text-center border border-green-200 dark:border-green-800">
              <div className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">1조</div>
              <div className="text-sm font-mono font-bold text-green-700 dark:text-green-300">1234567</div>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-2 text-center border border-green-200 dark:border-green-800">
              <div className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">2조</div>
              <div className="text-sm font-mono font-bold text-green-700 dark:text-green-300">7654321</div>
            </div>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
            <div className="text-center">
              <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-300 mb-1">주요 당첨금</div>
              <div className="text-xs text-yellow-600 dark:text-yellow-400 space-y-1">
                <div>1등: 월 700만원 × 20년</div>
                <div>2등: 1억원 • 3등: 300만원</div>
              </div>
            </div>
          </div>
        </LotteryCard>
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-12">
        <h3 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">주요 기능</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
            <div className="text-3xl mb-4">🎯</div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">실시간 분석</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">당첨 패턴과 통계를 실시간으로 분석하여 전략적인 번호 선택을 지원합니다.</p>
          </div>
          <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800">
            <div className="text-3xl mb-4">📊</div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">상세한 통계</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">구매 내역, 당첨 횟수, 수익률 등 모든 데이터를 한눈에 확인할 수 있습니다.</p>
          </div>
          <div className="text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800">
            <div className="text-3xl mb-4">🔒</div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">100% 안전</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">모든 데이터는 브라우저에만 저장되어 개인정보가 완전히 보호됩니다.</p>
          </div>
          <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
            <div className="text-3xl mb-4">📱</div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">모바일 최적화</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">PC와 모바일 모든 환경에서 편리하게 사용할 수 있습니다.</p>
          </div>
        </div>
      </section>
      
      {/* Modals */}
      <LottoModal open={showLottoModal} onOpenChange={setShowLottoModal} />
      <ScratchModal open={showScratchModal} onOpenChange={setShowScratchModal} />
      <PensionModal open={showPensionModal} onOpenChange={setShowPensionModal} />
    </div>
  );
}
