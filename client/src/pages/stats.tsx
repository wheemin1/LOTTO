import { useEffect, useState } from 'react';
import { useLotteryStore } from '@/stores/lottery-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Share2, Download, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LottoTicket } from '@/types/lottery';

export default function Stats() {
  const { lotto645, speetto1000, pension720, loadTickets, clearAllData } = useLotteryStore();
  const [activeTab, setActiveTab] = useState('lotto');
  const { toast } = useToast();

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  // 로또 번호별 당첨 통계 계산
  const calculateLottoNumberStats = () => {
    const numberStats: { [key: number]: { count: number, totalPrize: number } } = {};

    lotto645.tickets.forEach(ticket => {
      if (ticket.result && ticket.result.rank > 0) {
        ticket.numbers.main.forEach(num => {
          if (!numberStats[num]) {
            numberStats[num] = { count: 0, totalPrize: 0 };
          }
          numberStats[num].count++;
          numberStats[num].totalPrize += ticket.result.prize;
        });
      }
    });

    return Object.entries(numberStats)
      .map(([num, stats]) => ({ number: parseInt(num), ...stats }))
      .sort((a, b) => b.count - a.count || b.totalPrize - a.totalPrize);
  };

  const lottoNumberStats = calculateLottoNumberStats();

  // 전체 통계
  const totalSpent = lotto645.stats.totalSpent + (speetto1000.stats.totalTickets * 1000) + (pension720.stats.totalTickets * 7000);
  const totalWon = lotto645.stats.totalWon + speetto1000.stats.totalWon + pension720.stats.totalWon;
  const totalTickets = lotto645.stats.totalTickets + speetto1000.stats.totalTickets + pension720.stats.totalTickets;
  const totalWins = lotto645.stats.winCount + speetto1000.stats.winCount + pension720.stats.winCount;
  const overallROI = totalSpent > 0 ? ((totalWon - totalSpent) / totalSpent) * 100 : 0;

  // URL 공유 함수
  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "링크 복사됨",
        description: "통계 페이지 링크가 클립보드에 복사되었습니다.",
      });
    } catch (error) {
      toast({
        title: "복사 실패",
        description: "링크 복사에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  // 데이터 저장 함수 (CSV 다운로드)
  const handleSave = () => {
    const csvData = [
      ['복권종류', '총구매', '총당첨', '당첨횟수', '당첨률', '수익률'],
      ['로또6/45', lotto645.stats.totalTickets, `₩${lotto645.stats.totalWon.toLocaleString()}`, lotto645.stats.winCount, `${lotto645.stats.winRate.toFixed(1)}%`, `${lotto645.stats.roi.toFixed(1)}%`],
      ['스피또1000', speetto1000.stats.totalTickets, `₩${speetto1000.stats.totalWon.toLocaleString()}`, speetto1000.stats.winCount, `${speetto1000.stats.winRate.toFixed(1)}%`, `${speetto1000.stats.roi.toFixed(1)}%`],
      ['연금복권720+', pension720.stats.totalTickets, `₩${pension720.stats.totalWon.toLocaleString()}`, pension720.stats.winCount, `${pension720.stats.winRate.toFixed(1)}%`, `${pension720.stats.roi.toFixed(1)}%`],
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', '복권통계.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "저장 완료",
      description: "통계 데이터가 CSV 파일로 저장되었습니다.",
    });
  };

  // 데이터 리셋 함수
  const handleReset = () => {
    if (window.confirm('모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      clearAllData();
      toast({
        title: "데이터 초기화",
        description: "모든 복권 데이터가 삭제되었습니다.",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">통계</h1>
            <p className="text-gray-600 dark:text-gray-400">복권 구매 및 당첨 통계를 확인하세요</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              공유
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              저장
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:border-red-300"
            >
              <RotateCcw className="w-4 h-4" />
              리셋
            </Button>
          </div>
        </div>
      </div>

      {/* 전체 현황 - 상단 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">총 구매</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTickets}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">매</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">총 투자</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₩{totalSpent.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">총 당첨</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₩{totalWon.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">당첨 횟수</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalWins}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">전체 수익률</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${overallROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {overallROI >= 0 ? '+' : ''}{overallROI.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 자세한 분석 - 하단 탭 */}
      <Card>
        <CardHeader>
          <CardTitle>자세한 분석</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="lotto" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">로또 6/45</TabsTrigger>
              <TabsTrigger value="scratch" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">스피또 1000</TabsTrigger>
              <TabsTrigger value="pension" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">연금복권 720+</TabsTrigger>
            </TabsList>

            {/* 로또 6/45 탭 */}
            <TabsContent value="lotto" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">총 구매</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">{lotto645.stats.totalTickets}매</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">당첨 횟수</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold text-green-600">{lotto645.stats.winCount}회</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">당첨률</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">{lotto645.stats.winRate.toFixed(1)}%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">수익률</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-xl font-bold ${lotto645.stats.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {lotto645.stats.roi >= 0 ? '+' : ''}{lotto645.stats.roi.toFixed(1)}%
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 당첨된 번호 분석 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">당첨 번호 분석 (높은 순)</h3>
                {lottoNumberStats.length > 0 ? (
                  <div className="grid gap-4">
                    <div className="grid grid-cols-6 gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                      <div>번호</div>
                      <div>당첨 횟수</div>
                      <div>총 당첨금</div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                    {lottoNumberStats.map((stat, index) => (
                      <div key={stat.number} className="grid grid-cols-6 gap-2 items-center py-2 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                            {stat.number}
                          </div>
                        </div>
                        <div className="font-medium">{stat.count}회</div>
                        <div className="text-green-600 font-medium">₩{stat.totalPrize.toLocaleString()}</div>
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    아직 당첨된 번호가 없습니다.
                  </div>
                )}
              </div>
            </TabsContent>

            {/* 스피또 1000 탭 */}
            <TabsContent value="scratch" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">총 구매</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">{speetto1000.stats.totalTickets}매</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">당첨 횟수</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold text-green-600">{speetto1000.stats.winCount}회</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">당첨률</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">{speetto1000.stats.winRate.toFixed(1)}%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">수익률</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-xl font-bold ${speetto1000.stats.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {speetto1000.stats.roi >= 0 ? '+' : ''}{speetto1000.stats.roi.toFixed(1)}%
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">등급별 당첨 현황</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-600 dark:text-gray-400 pb-2 border-b">
                    <div>등급</div>
                    <div>당첨금</div>
                    <div>당첨 횟수</div>
                    <div>총 당첨금</div>
                  </div>
                  {[
                    { grade: '1등', prize: 500000000, count: speetto1000.tickets.filter(t => t.result?.prize === 500000000).length },
                    { grade: '2등', prize: 20000000, count: speetto1000.tickets.filter(t => t.result?.prize === 20000000).length },
                    { grade: '3등', prize: 10000, count: speetto1000.tickets.filter(t => t.result?.prize === 10000).length },
                    { grade: '4등', prize: 5000, count: speetto1000.tickets.filter(t => t.result?.prize === 5000).length },
                    { grade: '5등', prize: 1000, count: speetto1000.tickets.filter(t => t.result?.prize === 1000).length },
                  ].map((item) => (
                    <div key={item.grade} className="grid grid-cols-4 gap-4 py-2">
                      <div className="font-medium">{item.grade}</div>
                      <div>₩{item.prize.toLocaleString()}</div>
                      <div>{item.count}회</div>
                      <div className="text-green-600 font-medium">₩{(item.count * item.prize).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* 연금복권 720+ 탭 */}
            <TabsContent value="pension" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">총 구매</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">{pension720.stats.totalTickets}매</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">당첨 횟수</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold text-green-600">{pension720.stats.winCount}회</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">당첨률</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">{pension720.stats.winRate.toFixed(1)}%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">수익률</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-xl font-bold ${pension720.stats.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {pension720.stats.roi >= 0 ? '+' : ''}{pension720.stats.roi.toFixed(1)}%
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">등급별 당첨 현황</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-600 dark:text-gray-400 pb-2 border-b">
                    <div>등급</div>
                    <div>당첨 방식</div>
                    <div>당첨 횟수</div>
                    <div>총 당첨금</div>
                  </div>
                  {[
                    { grade: '1등', type: '월 700만원 x 20년', count: pension720.tickets.filter(t => t.result?.rank === 1).length },
                    { grade: '2등', type: '월 100만원 x 10년', count: pension720.tickets.filter(t => t.result?.rank === 2).length },
                    { grade: '3등', type: '일시불 100만원', count: pension720.tickets.filter(t => t.result?.rank === 3).length },
                  ].map((item) => (
                    <div key={item.grade} className="grid grid-cols-4 gap-4 py-2">
                      <div className="font-medium">{item.grade}</div>
                      <div className="text-sm">{item.type}</div>
                      <div>{item.count}회</div>
                      <div className="text-green-600 font-medium">
                        ₩{pension720.tickets
                          .filter(t => t.result?.rank === parseInt(item.grade.replace('등', '')))
                          .reduce((sum, t) => sum + (t.result?.totalPrize || 0), 0)
                          .toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}