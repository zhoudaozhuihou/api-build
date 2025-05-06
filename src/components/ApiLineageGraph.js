import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { 
  Paper, 
  Typography, 
  Button, 
  Divider,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Chip,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  CircularProgress
} from '@material-ui/core';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import RefreshIcon from '@material-ui/icons/Refresh';
import FocusIcon from '@material-ui/icons/CenterFocusStrong';
import { Graph } from 'react-d3-graph';

const useStyles = makeStyles({
  root: {
    padding: '24px',
    marginTop: '24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  graphContainer: {
    height: '500px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    backgroundColor: '#fafafa',
    position: 'relative',
    overflow: 'hidden',
  },
  graphControls: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '8px',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  graphLoading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 5,
    textAlign: 'center',
  },
  legendContainer: {
    marginTop: '16px',
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    margin: '4px 0',
  },
  legendColor: {
    width: '16px',
    height: '16px',
    borderRadius: '4px',
    marginRight: '8px',
  },
  dependencyTypeSelector: {
    minWidth: '200px',
    marginBottom: '16px',
  },
  noDataMessage: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: '#757575',
  },
  infoPanel: {
    position: 'absolute',
    bottom: '16px',
    left: '16px',
    zIndex: 10,
    width: '300px',
    maxHeight: '200px',
    overflowY: 'auto',
  },
  statsContainer: {
    marginTop: '16px',
    display: 'flex',
    gap: '16px',
  },
  statItem: {
    flex: 1,
    padding: '16px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    textAlign: 'center',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1976d2',
  },
  statLabel: {
    fontSize: '14px',
    color: '#757575',
  },
});

// 依赖关系类型
const dependencyTypes = [
  { value: 'all', label: '所有依赖', color: '#757575' },
  { value: 'data', label: '数据依赖', color: '#4caf50' },
  { value: 'functional', label: '功能依赖', color: '#2196f3' },
  { value: 'sync', label: '同步调用', color: '#ff9800' },
  { value: 'async', label: '异步调用', color: '#9c27b0' }
];

// D3图表的默认配置
const graphConfig = {
  nodeHighlightBehavior: true,
  directed: true,
  automaticRearrangeAfterDropNode: true,
  highlightDegree: 1,
  highlightOpacity: 0.2,
  linkHighlightBehavior: true,
  maxZoom: 8,
  minZoom: 0.1,
  panAndZoom: false,
  staticGraph: false,
  d3: {
    alphaTarget: 0.05,
    gravity: -250,
    linkLength: 120,
    linkStrength: 1,
  },
  node: {
    color: '#1976d2',
    size: 300,
    highlightStrokeColor: '#ff9800',
    highlightStrokeWidth: 3,
    fontSize: 14,
    fontWeight: 'bold',
    fontColor: 'black',
    labelProperty: 'name',
    renderLabel: true,
    labelPosition: 'right',
    symbolType: 'circle',
  },
  link: {
    highlightColor: '#ff9800',
    semanticStrokeWidth: true,
    strokeWidth: 2,
    type: 'STRAIGHT',
    renderLabel: true,
    labelProperty: 'type',
    fontSize: 12,
  },
};

const ApiLineageGraph = ({ apiLineage }) => {
  const classes = useStyles();
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [selectedDependencyType, setSelectedDependencyType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [selectedNode, setSelectedNode] = useState(null);
  const [stats, setStats] = useState({
    totalApis: 0,
    dependencyCount: 0,
    upstreamMax: 0,
    downstreamMax: 0
  });

  // 处理依赖类型筛选变化
  const handleDependencyTypeChange = (event) => {
    setSelectedDependencyType(event.target.value);
    setSelectedNode(null); // 清除选中的节点
    transformData(event.target.value);
  };

  // 放大图表
  const handleZoomIn = () => {
    setZoom(Math.min(zoom * 1.2, graphConfig.maxZoom));
  };

  // 缩小图表
  const handleZoomOut = () => {
    setZoom(Math.max(zoom * 0.8, graphConfig.minZoom));
  };

  // 重置图表
  const handleReset = () => {
    setZoom(1);
    setSelectedNode(null);
  };

  // 节点点击事件处理
  const onNodeClick = (nodeId) => {
    setSelectedNode(apiLineage.find(api => api.apiName === nodeId));
  };

  // 将API数据转换为图形数据
  const transformData = (dependencyType = 'all') => {
    if (!apiLineage || apiLineage.length === 0) {
      setGraphData({ nodes: [], links: [] });
      setLoading(false);
      return;
    }

    setLoading(true);

    // 创建节点
    const nodes = apiLineage.map(api => ({
      id: api.apiName,
      name: api.apiName,
      color: api.httpMethod ? 
        httpMethods.find(m => m.value === api.httpMethod)?.color || '#1976d2' :
        '#1976d2',
      size: 300,
      method: api.httpMethod || 'GET',
      endpoint: api.apiEndpoint || '',
      symbolType: 'circle',
    }));

    // 创建连接
    let links = [];
    apiLineage.forEach(api => {
      if (api.upstreamApis && api.upstreamApis.length > 0) {
        api.upstreamApis.forEach(upstream => {
          // 如果有扩展的依赖类型数据，使用它；否则默认为数据依赖
          const dependencyInfo = api.upstreamDependencies && 
            api.upstreamDependencies.find(d => d.apiName === upstream) || 
            { type: 'data' };
            
          // 根据筛选条件过滤依赖类型
          if (dependencyType === 'all' || dependencyType === dependencyInfo.type) {
            links.push({
              source: upstream,
              target: api.apiName,
              type: dependencyInfo.type || 'data',
              color: dependencyTypes.find(t => t.value === (dependencyInfo.type || 'data'))?.color || '#4caf50'
            });
          }
        });
      }
    });

    // 计算统计数据
    const upstreamCounts = {};
    const downstreamCounts = {};
    
    apiLineage.forEach(api => {
      upstreamCounts[api.apiName] = api.upstreamApis?.length || 0;
    });
    
    links.forEach(link => {
      if (!downstreamCounts[link.source]) downstreamCounts[link.source] = 0;
      downstreamCounts[link.source]++;
    });
    
    const upstreamMax = Math.max(...Object.values(upstreamCounts), 0);
    const downstreamMax = Math.max(...Object.values(downstreamCounts), 0);
    
    setStats({
      totalApis: nodes.length,
      dependencyCount: links.length,
      upstreamMax,
      downstreamMax
    });

    setGraphData({ nodes, links });
    setLoading(false);
  };

  // 执行一次性数据转换
  useEffect(() => {
    transformData(selectedDependencyType);
  }, [apiLineage]);

  // 配置图表，加入缩放功能
  const graphConfigWithZoom = {
    ...graphConfig,
    d3: {
      ...graphConfig.d3,
      zoom: zoom,
    }
  };

  // 影响分析 - 获取直接和间接下游API
  const getImpactedApis = (apiName) => {
    const directImpacted = new Set();
    const indirectImpacted = new Set();
    
    // 查找直接受影响的API
    apiLineage.forEach(api => {
      if (api.upstreamApis && api.upstreamApis.includes(apiName)) {
        directImpacted.add(api.apiName);
      }
    });
    
    // 递归查找间接受影响的API
    const findDownstream = (name, visited = new Set()) => {
      if (visited.has(name)) return;
      visited.add(name);
      
      apiLineage.forEach(api => {
        if (api.upstreamApis && api.upstreamApis.includes(name) && 
            !directImpacted.has(api.apiName) && api.apiName !== apiName) {
          indirectImpacted.add(api.apiName);
          findDownstream(api.apiName, visited);
        }
      });
    };
    
    // 对每个直接受影响的API查找间接受影响的
    directImpacted.forEach(name => {
      findDownstream(name);
    });
    
    return {
      direct: Array.from(directImpacted),
      indirect: Array.from(indirectImpacted)
    };
  };

  return React.createElement(
    Paper,
    { className: classes.root },
    // 头部标题和控件
    React.createElement(
      'div', 
      { className: classes.header },
      React.createElement(
        Typography,
        { variant: 'h6', component: 'h2' },
        'API血缘关系可视化'
      ),
      React.createElement(
        FormControl,
        { variant: 'outlined', className: classes.dependencyTypeSelector },
        React.createElement(
          InputLabel,
          { id: 'dependency-type-label' },
          '依赖类型'
        ),
        React.createElement(
          Select,
          {
            labelId: 'dependency-type-label',
            id: 'dependency-type',
            value: selectedDependencyType,
            onChange: handleDependencyTypeChange,
            label: '依赖类型',
          },
          dependencyTypes.map(type => React.createElement(
            MenuItem,
            { key: type.value, value: type.value },
            React.createElement(
              'div',
              { style: { display: 'flex', alignItems: 'center' } },
              React.createElement(
                'span',
                {
                  style: {
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: type.color,
                    display: 'inline-block',
                    marginRight: '8px'
                  }
                }
              ),
              type.label
            )
          ))
        )
      )
    ),
    
    // 图表容器
    React.createElement(
      'div',
      { className: classes.graphContainer },
      // 图表操作控件
      React.createElement(
        'div',
        { className: classes.graphControls },
        React.createElement(
          IconButton,
          { onClick: handleZoomIn, size: 'small', title: '放大' },
          React.createElement(ZoomInIcon)
        ),
        React.createElement(
          IconButton,
          { onClick: handleZoomOut, size: 'small', title: '缩小' },
          React.createElement(ZoomOutIcon)
        ),
        React.createElement(
          IconButton,
          { onClick: handleReset, size: 'small', title: '重置' },
          React.createElement(RefreshIcon)
        )
      ),
      
      // 加载状态
      loading && React.createElement(
        'div',
        { className: classes.graphLoading },
        React.createElement(CircularProgress),
        React.createElement(
          Typography,
          { variant: 'body2', style: { marginTop: '8px' } },
          '加载血缘关系图...'
        )
      ),
      
      // 没有数据时的提示
      !loading && graphData.nodes.length === 0 && React.createElement(
        Typography,
        { className: classes.noDataMessage, variant: 'body1' },
        '没有API血缘数据可显示。请先创建API及其依赖关系。'
      ),
      
      // 渲染图表
      !loading && graphData.nodes.length > 0 && React.createElement(
        Graph,
        {
          id: 'api-lineage-graph',
          data: graphData,
          config: graphConfigWithZoom,
          onClickNode: onNodeClick
        }
      ),
      
      // 选中节点信息面板
      selectedNode && React.createElement(
        Card,
        { className: classes.infoPanel },
        React.createElement(
          CardContent,
          null,
          React.createElement(
            Typography,
            { variant: 'h6', gutterBottom: true },
            selectedNode.apiName
          ),
          selectedNode.apiEndpoint && React.createElement(
            'div',
            { style: { display: 'flex', alignItems: 'center', marginBottom: '8px' } },
            React.createElement(
              'span',
              { 
                style: {
                  backgroundColor: httpMethods.find(m => m.value === selectedNode.httpMethod)?.color || '#1976d2',
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  marginRight: '8px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }
              },
              selectedNode.httpMethod || 'GET'
            ),
            React.createElement(
              Typography,
              { variant: 'body2' },
              selectedNode.apiEndpoint
            )
          ),
          React.createElement(
            Divider,
            { style: { margin: '8px 0' } }
          ),
          React.createElement(
            Typography,
            { variant: 'subtitle2' },
            '依赖分析:'
          ),
          React.createElement(
            'div',
            null,
            React.createElement(
              Typography,
              { variant: 'body2' },
              `上游依赖: ${selectedNode.upstreamApis?.length || 0}`
            ),
            React.createElement(
              Typography,
              { variant: 'body2' },
              `下游影响: ${getImpactedApis(selectedNode.apiName).direct.length || 0} 直接, ${getImpactedApis(selectedNode.apiName).indirect.length || 0} 间接`
            )
          )
        )
      )
    ),
    
    // 图例
    React.createElement(
      'div',
      { className: classes.legendContainer },
      dependencyTypes.filter(t => t.value !== 'all').map(type => React.createElement(
        'div',
        { className: classes.legendItem, key: type.value },
        React.createElement(
          'div',
          { 
            className: classes.legendColor,
            style: { backgroundColor: type.color }
          }
        ),
        React.createElement(
          Typography,
          { variant: 'body2' },
          type.label
        )
      ))
    ),
    
    // 统计信息
    React.createElement(
      'div',
      { className: classes.statsContainer },
      React.createElement(
        'div',
        { className: classes.statItem },
        React.createElement(
          Typography,
          { className: classes.statValue },
          stats.totalApis
        ),
        React.createElement(
          Typography,
          { className: classes.statLabel },
          'API总数'
        )
      ),
      React.createElement(
        'div',
        { className: classes.statItem },
        React.createElement(
          Typography,
          { className: classes.statValue },
          stats.dependencyCount
        ),
        React.createElement(
          Typography,
          { className: classes.statLabel },
          '依赖关系总数'
        )
      ),
      React.createElement(
        'div',
        { className: classes.statItem },
        React.createElement(
          Typography,
          { className: classes.statValue },
          stats.upstreamMax
        ),
        React.createElement(
          Typography,
          { className: classes.statLabel },
          '最大上游依赖数'
        )
      ),
      React.createElement(
        'div',
        { className: classes.statItem },
        React.createElement(
          Typography,
          { className: classes.statValue },
          stats.downstreamMax
        ),
        React.createElement(
          Typography,
          { className: classes.statLabel },
          '最大下游影响数'
        )
      )
    )
  );
};

ApiLineageGraph.propTypes = {
  apiLineage: PropTypes.array.isRequired,
};

export default ApiLineageGraph; 