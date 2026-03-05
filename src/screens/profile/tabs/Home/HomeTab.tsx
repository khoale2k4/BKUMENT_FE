// HomeTab.tsx
import { Home } from 'lucide-react';

const HomeTab = () => (
  <div className="text-center py-24 bg-gray-50 rounded-3xl border border-dashed border-gray-200 animate-in fade-in">
    <Home size={48} className="mx-auto text-gray-300 mb-4" />
    <h3 className="text-lg font-bold text-gray-600">Dashboard Overview</h3>
    <p className="text-gray-400 mt-2">Thống kê tổng quan sẽ hiển thị tại đây.</p>
  </div>
);
export default HomeTab;