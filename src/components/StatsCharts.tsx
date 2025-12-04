/**
 * 统计图表组件集合
 * 使用recharts展示各种统计数据
 */

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card } from './ui';

// 自定义Tooltip组件
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border-2 border-primary">
        <p className="font-bold text-gray-800">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/**
 * 每周任务完成趋势图
 */
export function WeeklyTaskChart({ data }: {
  data: Array<{
    date: string;
    completed: number;
    total: number;
    rate: number;
  }>;
}) {
  return (
    <Card>
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        📈 最近7天任务完成趋势
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="date"
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '14px' }} />
          <Bar
            dataKey="completed"
            name="已完成"
            fill="#6BCF7F"
            radius={[8, 8, 0, 0]}
          />
          <Bar
            dataKey="total"
            name="总任务"
            fill="#E5E7EB"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

/**
 * 积分累计趋势图
 */
export function PointsTrendChart({ data }: {
  data: Array<{
    date: string;
    points: number;
  }>;
}) {
  return (
    <Card>
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        💰 积分累计趋势
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="date"
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '14px' }} />
          <Line
            type="monotone"
            dataKey="points"
            name="累计积分"
            stroke="#FFD93D"
            strokeWidth={3}
            dot={{ fill: '#FFD93D', r: 5 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

/**
 * 成就完成率圆环图
 */
export function AchievementProgressChart({ stats }: {
  stats: {
    total: number;
    unlocked: number;
    rate: number;
  };
}) {
  const data = [
    { name: '已解锁', value: stats.unlocked, color: '#6BCF7F' },
    { name: '未解锁', value: stats.total - stats.unlocked, color: '#E5E7EB' },
  ];

  return (
    <Card>
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        🏆 成就完成进度
      </h3>
      <div className="flex items-center justify-around">
        <ResponsiveContainer width="50%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="text-center">
          <div className="text-5xl font-bold text-primary mb-2">
            {stats.rate}%
          </div>
          <p className="text-gray-600 text-sm">完成率</p>
          <div className="mt-4 space-y-1">
            <p className="text-sm">
              <span className="inline-block w-3 h-3 bg-success rounded-full mr-2"></span>
              已解锁: {stats.unlocked}
            </p>
            <p className="text-sm">
              <span className="inline-block w-3 h-3 bg-gray-300 rounded-full mr-2"></span>
              未解锁: {stats.total - stats.unlocked}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

/**
 * 任务类型分布饼图
 */
export function TaskTypeChart({ data }: {
  data: Array<{
    type: string;
    count: number;
    color: string;
  }>;
}) {
  return (
    <Card>
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        📊 任务类型分布
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ type, count, percent }) =>
              `${type}: ${count} (${(percent * 100).toFixed(0)}%)`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}

/**
 * 总体统计卡片
 */
export function OverallStatsCard({ stats }: {
  stats: {
    totalTasksCompleted: number;
    totalPoints: number;
    longestStreak: number;
    perfectDays: number;
    level: number;
    completionRate: number;
  };
}) {
  const statItems = [
    { label: '累计完成', value: stats.totalTasksCompleted, icon: '✅', color: 'text-success' },
    { label: '总积分', value: stats.totalPoints, icon: '💰', color: 'text-warning' },
    { label: '最长连续', value: `${stats.longestStreak}天`, icon: '🔥', color: 'text-danger' },
    { label: '完美日数', value: stats.perfectDays, icon: '⭐', color: 'text-primary' },
    { label: '当前等级', value: `Lv.${stats.level}`, icon: '🏅', color: 'text-secondary' },
    { label: '完成率', value: `${stats.completionRate}%`, icon: '📈', color: 'text-primary' },
  ];

  return (
    <Card>
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        📋 总体数据统计
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statItems.map((item, index) => (
          <div
            key={index}
            className="text-center p-4 bg-gradient-to-br from-white to-gray-50 rounded-lg border-2 border-gray-200 hover:border-primary transition-colors"
          >
            <div className="text-3xl mb-2">{item.icon}</div>
            <div className={`text-2xl font-bold mb-1 ${item.color}`}>
              {item.value}
            </div>
            <div className="text-sm text-gray-600">{item.label}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
