export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            <p className="mb-2">⚠️ 이 애플리케이션은 시뮬레이션 목적으로만 제작되었습니다.</p>
            <p>실제 복권과는 관련이 없으며, 도박을 조장하지 않습니다.</p>
          </div>
          
          <div className="flex justify-center items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
            <span>LuckySim v1.0.0</span>
            <span>•</span>
            <button className="hover:text-blue-600 transition-colors">개인정보처리방침</button>
            <span>•</span>
            <button className="hover:text-blue-600 transition-colors">이용약관</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
