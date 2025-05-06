# API构建与血缘管理系统

一个基于React的API管理平台，支持API设计、表关系映射、SQL查询构建和API血缘关系追踪。

## 主要功能

### 表关系定义
- 支持定义多种表关系：一对一、一对多、多对一、多对多、自引用等
- 可视化表关系展示
- SQL JOIN语句自动生成
- 支持复杂JOIN条件自定义

### SQL查询构建器
- 支持ORDER BY排序功能
- 支持GROUP BY分组和聚合功能
- 直观的SQL预览
- 支持拖放排序和分组字段

### API集成与HTTP Method管理
- 支持标准HTTP方法（GET、POST、PUT、DELETE等）
- 可视化的HTTP方法展示，使用颜色编码
- 端点URL管理
- 发布状态跟踪

### API血缘关系

#### 可视化血缘关系图
- 节点和连线清晰展示API的上下游依赖
- 支持放大、缩小和平移操作
- 焦点模式突出显示选中API的依赖链
- 使用颜色编码表示不同类型的依赖关系

#### 依赖关系类型与元数据
- 数据依赖：上游API提供数据给下游API
- 功能依赖：下游API依赖上游API的功能
- 同步调用：实时依赖关系
- 异步调用：基于消息队列或事件的依赖
- 支持记录数据交换格式和结构

#### 影响分析
- 变更影响评估：识别API变更可能影响的下游系统
- 区分直接影响和间接影响
- 风险评级和警告机制
- 变更审批流程支持

#### 血缘追踪
- 数据来源追踪：从目标API向上游追溯数据源头
- 数据消费追踪：从源API向下游追踪数据使用情况
- 完整数据链路可视化
- 数据转换和处理步骤记录

#### 血缘管理功能
- 按名称、类型、状态等过滤和搜索
- 批量编辑血缘关系
- 血缘关系导入导出
- 版本控制和历史记录

---

### 自动API血缘发现（Auto API Lineage Discovery）

#### 功能简介
- 平台可自动识别和建立API之间的依赖关系，无需用户手动维护。
- 通过SQL解析、API调用链追踪、元数据比对等方式，自动生成API血缘信息。

#### 前端实现思路
- 在API创建/编辑时，前端将SQL语句发送到后端解析，自动提取涉及的表、视图等依赖。
- 若API实现中调用了其他API，自动识别为功能依赖或同步/异步依赖。
- 依赖信息自动写入API的`lineage.upstream`字段，血缘图自动展示。

#### 伪代码示例
```javascript
// 假设后端有 /api/parse-sql 接口
const handleSqlChange = async (sql) => {
  const res = await fetch('/api/parse-sql', {
    method: 'POST',
    body: JSON.stringify({ sql }),
    headers: { 'Content-Type': 'application/json' }
  });
  const { tables, views } = await res.json();
  setLineageUpstream([
    ...tables.map(t => ({ type: 'data', source: t })),
    ...views.map(v => ({ type: 'data', source: v }))
  ]);
};
```

#### 后端配合建议
- 提供SQL解析接口，返回表、视图、字段等依赖信息。
- 维护API元数据注册表，支持依赖比对和自动更新。
- 支持API调用链追踪（如有微服务或函数调用，可通过日志或代码分析自动发现依赖）。

#### 集成点说明
- `ApiBuilder.js`：在SQL生成后自动调用后端解析接口，更新依赖。
- `ApiLineageManager.js`：自动读取`apis`的`lineage`字段，无需手动维护。

---

## 技术架构

- 前端框架：React
- UI组件库：Material-UI v4
- 样式：Tailwind CSS
- 可视化库：react-d3-graph
- 数据管理：React Hooks

## 开发指南

### 安装
```bash
npm install
```

### 运行开发服务器
```bash
npm start
```

### 构建生产版本
```bash
npm run build
```

## 未来规划

- 与CI/CD流程集成
- 支持API文档自动生成
- 增加团队协作和角色管理功能
- 基于血缘关系的API测试自动化 