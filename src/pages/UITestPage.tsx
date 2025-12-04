/**
 * UI 组件测试页面
 *
 * 用于展示和测试所有基础 UI 组件
 */

import { useState } from 'react';
import {
  Button,
  Card,
  Badge,
  ProgressBar,
  Modal,
  useToast,
} from '../components/ui';

export default function UITestPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const { showToast } = useToast();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* 页面标题 */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            UI 组件测试页面
          </h1>
          <p className="text-gray-600">
            展示所有基础 UI 组件的样式和功能
          </p>
        </div>

        {/* Button 组件 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">按钮 Button</h2>
          <Card>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">按钮变体</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">主要按钮</Button>
                  <Button variant="secondary">次要按钮</Button>
                  <Button variant="success">成功按钮</Button>
                  <Button variant="danger">危险按钮</Button>
                  <Button variant="warning">警告按钮</Button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">按钮尺寸</h3>
                <div className="flex flex-wrap items-end gap-3">
                  <Button size="small">小按钮</Button>
                  <Button size="medium">中按钮</Button>
                  <Button size="large">大按钮</Button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">带图标</h3>
                <div className="flex flex-wrap gap-3">
                  <Button icon="✓">完成任务</Button>
                  <Button icon="➕" variant="success">添加任务</Button>
                  <Button icon="🎁" variant="warning">兑换奖励</Button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">其他状态</h3>
                <div className="flex flex-wrap gap-3">
                  <Button disabled>禁用按钮</Button>
                  <Button fullWidth>全宽按钮</Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Card 组件 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">卡片 Card</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card title="默认卡片" subtitle="这是一个标准卡片">
              <p className="text-gray-600">卡片内容区域</p>
            </Card>

            <Card
              title="主题卡片"
              subtitle="Primary 变体"
              variant="primary"
              icon="🎯"
            >
              <p className="text-gray-600">主题色卡片</p>
            </Card>

            <Card
              title="成功卡片"
              variant="success"
              icon="✓"
              hoverable
            >
              <p className="text-gray-600">鼠标悬停有动画效果</p>
            </Card>

            <Card
              title="警告卡片"
              variant="warning"
              icon="⚠"
            >
              <p className="text-gray-600">警告样式卡片</p>
            </Card>

            <Card
              title="可点击卡片"
              variant="danger"
              icon="🔥"
              onClick={() => showToast('你点击了卡片！', 'info')}
              hoverable
            >
              <p className="text-gray-600">点击我试试</p>
            </Card>
          </div>
        </section>

        {/* Badge 组件 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">徽章 Badge</h2>
          <Card>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">徽章变体</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="primary">主要</Badge>
                  <Badge variant="success">成功</Badge>
                  <Badge variant="warning">警告</Badge>
                  <Badge variant="danger">危险</Badge>
                  <Badge variant="gray">灰色</Badge>
                  <Badge variant="yellow" icon="⭐">黄色</Badge>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">徽章尺寸</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge size="small">小徽章</Badge>
                  <Badge size="medium">中徽章</Badge>
                  <Badge size="large">大徽章</Badge>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">实际用例</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="yellow" icon="⭐">简单 +5分</Badge>
                  <Badge variant="warning" icon="⚡">中等 +10分</Badge>
                  <Badge variant="danger" icon="🔥">困难 +20分</Badge>
                  <Badge variant="primary" icon="🔥">Streak 7天</Badge>
                  <Badge variant="success" icon="✓">已完成</Badge>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* ProgressBar 组件 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">进度条 ProgressBar</h2>
          <Card>
            <div className="space-y-6">
              <ProgressBar
                value={45}
                max={100}
                label="经验值进度"
                color="primary"
              />

              <ProgressBar
                value={7}
                max={10}
                label="每日任务完成度"
                color="success"
                size="large"
              />

              <ProgressBar
                value={150}
                max={200}
                label="积分获取进度"
                color="yellow"
                size="medium"
              />

              <ProgressBar
                value={3}
                max={30}
                label="连续打卡天数"
                color="danger"
                size="small"
                showPercentage={false}
              />
            </div>
          </Card>
        </section>

        {/* Modal 和 Toast 组件 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            交互组件 Modal & Toast
          </h2>
          <Card>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">模态弹窗</h3>
                <Button onClick={() => setModalOpen(true)}>打开模态框</Button>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Toast 通知</h3>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="success"
                    onClick={() => showToast('操作成功！', 'success')}
                  >
                    成功通知
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => showToast('发生错误！', 'error')}
                  >
                    错误通知
                  </Button>
                  <Button
                    variant="warning"
                    onClick={() => showToast('注意！', 'warning')}
                  >
                    警告通知
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => showToast('这是一条信息', 'info')}
                  >
                    信息通知
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </div>

      {/* Modal 示例 */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="示例模态框"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            这是一个模态弹窗的示例内容。你可以在这里放置任何内容。
          </p>
          <div className="flex gap-3">
            <Button variant="primary" onClick={() => setModalOpen(false)}>
              确定
            </Button>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              取消
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
