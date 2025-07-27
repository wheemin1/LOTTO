import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useLotteryStore } from '@/stores/lottery-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Share2, Trash2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import StatsCard from '@/components/stats/stats-card';

const COLORS = ['hsl(218, 83%, 45%)', 'hsl(355, 78%, 51%)', 'hsl(37, 92%, 50%)'];

export default function Stats() {
  const { lotto645, speetto1000, pension720, loadTickets, clearAllData, exportData } = useLotteryStore();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  // Prepare chart data
  const overviewData = [
    {
      name: '로또 6/45',
      구매: lotto645.stats.totalTickets,
      당첨: lotto645.stats.winCount,
      수익률: lotto645.stats.roi,
    },
    {
      name: '스피또1000',
      구매: speetto1000.stats.totalTickets,
      당첨: speetto1000.stats.winCount,
      수익률: speetto1000.stats.roi,
    },
    {
      name: '연금복권720+',
      구매: pension720.stats.totalTickets,
      당첨: pension720.stats.winCount,
      수익률: pension720.stats.roi,
    },
  ];

  const pieData = [
    { name: '로또 6/45', value: lotto645.stats.totalSpent },
    { name: '스피또1000', value: speetto1000.stats.totalSpent },
    { name: '연금복권720+', value: pension720.stats.totalSpent },
  ].filter(item => item.value > 0);

  // Calculate monthly spending trend (last 6 months)
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    const lottoSpent = lotto645.tickets
      .filter(ticket => {
        const ticketDate = new Date(ticket.purchaseDate);
        return `${ticketDate.getFullYear()}-${String(ticketDate.getMonth() + 1).padStart(2, '0')}` === monthKey;
      })
      .length * 1000;

    const scratchSpent = speetto1000.tickets
      .filter(ticket => {
        const ticketDate = new Date(ticket.purchaseDate);
        return `${ticketDate.getFullYear()}-${String(ticketDate.getMonth() + 1).padStart(2, '0')}` === monthKey;
      })
      .length * 1000;

    const pensionSpent = pension720.tickets
      .filter(ticket => {
        const ticketDate = new Date(ticket.purchaseDate);
        return `${ticketDate.getFullYear()}-${String(ticketDate.getMonth() + 1).padStart(2, '0')}` === monthKey;
      })
      .length * 720;

    monthlyData.push({
      month: date.toLocaleDateString('ko-KR', { month: 'short' }),
      로또: lottoSpent,
      스크래치: scratchSpent,
      연금복권: pensionSpent,
      총합: lottoSpent + scratchSpent + pensionSpent,
    });
  }

  // Calculate combined stats
  const totalSpent = lotto645.stats.totalSpent + speetto1000.stats.totalSpent + pension720.stats.totalSpent;
  const totalWon = lotto645.stats.totalWon + speetto1000.stats.totalWon + pension720.stats.totalWon;
  const totalTickets = lotto645.stats.totalTickets + speetto1000.stats.totalTickets + pension720.stats.totalTickets;
  const totalWins = lotto645.stats.winCount + speetto1000.stats.winCount + pension720.stats.winCount;
  const overallWinRate = totalTickets > 0 ? (totalWins / totalTickets) * 100 : 0;
  const overallROI = totalSpent > 0 ? ((totalWon - totalSpent) / totalSpent) * 100 : 0;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const data = await exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `luckysim-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "내보내기 완료",
        description: "데이터가 성공적으로 내보내졌습니다.",
      });
    } catch (error) {
      toast({
        title: "내보내기 실패",
        description: "데이터 내보내기에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearData = async () => {
    if (window.confirm('모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      try {
        await clearAllData();
        toast({
          title: "데이터 삭제 완료",
          description: "모든 데이터가 삭제되었습니다.",
        });
      } catch (error) {
        toast({
          title: "삭제 실패",
          description: "데이터 삭제에 실패했습니다.",
          variant: "destructive",
        });
      }
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'LuckySim 통계',
      text: `총 ${totalTickets}번의 복권 구매로 ${overallWinRate.toFixed(1)}% 당첨률을 기록했습니다!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        toast({
          title: "링크 복사됨",
          description: "통계 정보가 클립보드에 복사되었습니다.",
        });
      }
    } else {
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      toast({
        title: "링크 복사됨",
        description: "통계 정보가 클립보드에 복사되었습니다.",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              홈으로
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">통계 대시보드</h1>
          <p className="text-gray-600 dark:text-gray-400">복권 구매 내역과 분석 결과를 확인하세요</p>
        </div>
        
        <div className="flex space-x-2">
          <Button onClick={handleShare} variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            공유
          </Button>
          <Button onClick={handleExport} variant="outline" size="sm" disabled={isExporting}>
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? '내보내는 중...' : '내보내기'}
          </Button>
          <Button onClick={handleClearData} variant="destructive" size="sm">
            <Trash2 className="w-4 h-4 mr-2" />
            데이터 삭제
          </Button>
        </div>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">총 구매 금액</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₩{totalSpent.toLocaleString()}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {totalTickets}매 구매
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">총 당첨 금액</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalWon > 0 ? 'text-green-600' : ''}`}>
              ₩{totalWon.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {totalWins}회 당첨
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">전체 당첨률</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{overallWinRate.toFixed(1)}%</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              평균 당첨률
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">전체 수익률</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${overallROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {overallROI >= 0 ? '+' : ''}{overallROI.toFixed(0)}%
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              총 손익률
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">전체 현황</TabsTrigger>
          <TabsTrigger value="detailed">상세 분석</TabsTrigger>
          <TabsTrigger value="trends">트렌드</TabsTrigger>
          <TabsTrigger value="comparison">비교 분석</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Lottery Type Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <StatsCard title="로또 6/45" stats={lotto645.stats} color="blue" />
            <StatsCard title="스피또1000" stats={speetto1000.stats} color="red" />
            <StatsCard title="연금복권720+" stats={pension720.stats} color="gold" />
          </div>

          {/* Spending Distribution */}
          {pieData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>복권별 구매 비중</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `₩${Number(value).toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          {/* Win Rate Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>복권별 당첨률 비교</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={overviewData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="구매" fill="hsl(218, 83%, 45%)" />
                    <Bar dataKey="당첨" fill="hsl(158, 80%, 39%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* ROI Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>복권별 수익률 비교</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={overviewData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
                    <Bar dataKey="수익률" fill="hsl(37, 92%, 50%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {/* Monthly Spending Trend */}
          <Card>
            <CardHeader>
              <CardTitle>월별 구매 추이</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₩${Number(value).toLocaleString()}`} />
                    <Legend />
                    <Line type="monotone" dataKey="로또" stroke="hsl(218, 83%, 45%)" strokeWidth={2} />
                    <Line type="monotone" dataKey="스크래치" stroke="hsl(355, 78%, 51%)" strokeWidth={2} />
                    <Line type="monotone" dataKey="연금복권" stroke="hsl(37, 92%, 50%)" strokeWidth={2} />
                    <Line type="monotone" dataKey="총합" stroke="hsl(0, 0%, 30%)" strokeWidth={3} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          {/* Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle>복권 종류별 상세 비교</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-semibold">복권 종류</th>
                      <th className="text-right py-3 px-4 font-semibold">구매 수</th>
                      <th className="text-right py-3 px-4 font-semibold">구매 금액</th>
                      <th className="text-right py-3 px-4 font-semibold">당첨 횟수</th>
                      <th className="text-right py-3 px-4 font-semibold">당첨 금액</th>
                      <th className="text-right py-3 px-4 font-semibold">당첨률</th>
                      <th className="text-right py-3 px-4 font-semibold">수익률</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4 font-medium text-blue-600">로또 6/45</td>
                      <td className="py-3 px-4 text-right">{lotto645.stats.totalTickets}</td>
                      <td className="py-3 px-4 text-right">₩{lotto645.stats.totalSpent.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">{lotto645.stats.winCount}</td>
                      <td className="py-3 px-4 text-right">₩{lotto645.stats.totalWon.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">{lotto645.stats.winRate.toFixed(1)}%</td>
                      <td className={`py-3 px-4 text-right font-bold ${lotto645.stats.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {lotto645.stats.roi >= 0 ? '+' : ''}{lotto645.stats.roi.toFixed(0)}%
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4 font-medium text-red-600">스피또1000</td>
                      <td className="py-3 px-4 text-right">{speetto1000.stats.totalTickets}</td>
                      <td className="py-3 px-4 text-right">₩{speetto1000.stats.totalSpent.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">{speetto1000.stats.winCount}</td>
                      <td className="py-3 px-4 text-right">₩{speetto1000.stats.totalWon.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">{speetto1000.stats.winRate.toFixed(1)}%</td>
                      <td className={`py-3 px-4 text-right font-bold ${speetto1000.stats.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {speetto1000.stats.roi >= 0 ? '+' : ''}{speetto1000.stats.roi.toFixed(0)}%
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4 font-medium text-yellow-600">연금복권720+</td>
                      <td className="py-3 px-4 text-right">{pension720.stats.totalTickets}</td>
                      <td className="py-3 px-4 text-right">₩{pension720.stats.totalSpent.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">{pension720.stats.winCount}</td>
                      <td className="py-3 px-4 text-right">₩{pension720.stats.totalWon.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">{pension720.stats.winRate.toFixed(1)}%</td>
                      <td className={`py-3 px-4 text-right font-bold ${pension720.stats.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {pension720.stats.roi >= 0 ? '+' : ''}{pension720.stats.roi.toFixed(0)}%
                      </td>
                    </tr>
                    <tr className="border-t-2 border-gray-300 dark:border-gray-600 font-bold">
                      <td className="py-3 px-4">전체 합계</td>
                      <td className="py-3 px-4 text-right">{totalTickets}</td>
                      <td className="py-3 px-4 text-right">₩{totalSpent.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">{totalWins}</td>
                      <td className="py-3 px-4 text-right">₩{totalWon.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">{overallWinRate.toFixed(1)}%</td>
                      <td className={`py-3 px-4 text-right ${overallROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {overallROI >= 0 ? '+' : ''}{overallROI.toFixed(0)}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Empty State */}
      {totalTickets === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">아직 통계가 없습니다</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              복권을 구매하면 여기에 상세한 통계가 표시됩니다.
            </p>
            <Link href="/">
              <Button>복권 구매하러 가기</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
