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
  CircularProgress,
} from '@material-ui/core';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import RefreshIcon from '@material-ui/icons/Refresh';
import FocusIcon from '@material-ui/icons/CenterFocusStrong';
import { Graph } from 'react-d3-graph';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(3),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
  },
  graphContainer: {
    height: '500px',
    border: '1px solid #e0e0e0',
    borderRadius: 4,
    backgroundColor: '#fafafa',
    position: 'relative',
    overflow: 'hidden',
  },
  graphControls: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: theme.spacing(1),
    borderRadius: 4,
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
    marginTop: theme.spacing(3),
    display: 'flex',
    gap: theme.spacing(2),
    flexWrap: 'wrap',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    margin: theme.spacing(0.5, 0),
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: theme.spacing(1),
  },
  dependencyTypeSelector: {
    minWidth: 200,
    marginBottom: theme.spacing(2),
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
    bottom: theme.spacing(2),
    left: theme.spacing(2),
    zIndex: 10,
    width: 300,
    maxHeight: 200,
    overflowY: 'auto',
  },
  statsContainer: {
    marginTop: theme.spacing(3),
    display: 'flex',
    gap: theme.spacing(2),
  },
  statItem: {
    flex: 1,
    padding: theme.spacing(2),
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.palette.primary.main,
  },
  statLabel: {
    fontSize: 14,
    color: '#757575',
  },
}));

const dependencyTypes = [
  { value: 'all', label: '所有依赖', color: '#757575' },
  { value: 'data', label: '数据依赖', color: '#4caf50' },
  { value: 'functional', label: '功能依赖', color: '#2196f3' },
  { value: 'sync', label: '同步调用', color: '#ff9800' },
  { value: 'async', label: '异步调用', color: '#9c27b0' },
];

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

const ApiLineageManager = ({ apis }) => {
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
    downstreamMax: 0,
  });

  useEffect(() => {
    transformData(selectedDependencyType);
  }, [apis, selectedDependencyType]);

  const handleDependencyTypeChange = (event) => {
    setSelectedDependencyType(event.target.value);
    setSelectedNode(null);
  };

  const handleZoomIn = () => {
    setZoom(Math.min(zoom * 1.2, graphConfig.maxZoom));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom * 0.8, graphConfig.minZoom));
  };

  const handleReset = () => {
    setZoom(1);
    setSelectedNode(null);
  };

  const onNodeClick = (nodeId) => {
    setSelectedNode(apis.find((api) => api.name === nodeId));
  };

  const transformData = (dependencyType = 'all') => {
    if (!apis || apis.length === 0) {
      setGraphData({ nodes: [], links: [] });
      setLoading(false);
      return;
    }

    setLoading(true);

    const nodes = apis.map((api) => ({
      id: api.name,
      name: api.name,
      color: api.method ? getMethodColor(api.method) : '#1976d2',
      size: 300,
      method: api.method || 'GET',
      endpoint: api.endpoint || '',
      symbolType: 'circle',
    }));

    let links = [];
    apis.forEach((api) => {
      if (api.lineage && api.lineage.upstream) {
        api.lineage.upstream.forEach((upstream) => {
          if (dependencyType === 'all' || dependencyType === upstream.type) {
            links.push({
              source: upstream.source,
              target: api.name,
              type: upstream.type || 'data',
              color: dependencyTypes.find((t) => t.value === (upstream.type || 'data'))?.color || '#4caf50',
            });
          }
        });
      }
    });

    const upstreamCounts = {};
    const downstreamCounts = {};

    apis.forEach((api) => {
      upstreamCounts[api.name] = api.lineage?.upstream?.length || 0;
    });

    links.forEach((link) => {
      if (!downstreamCounts[link.source]) downstreamCounts[link.source] = 0;
      downstreamCounts[link.source]++;
    });

    const upstreamMax = Math.max(...Object.values(upstreamCounts), 0);
    const downstreamMax = Math.max(...Object.values(downstreamCounts), 0);

    setStats({
      totalApis: nodes.length,
      dependencyCount: links.length,
      upstreamMax,
      downstreamMax,
    });

    setGraphData({ nodes, links });
    setLoading(false);
  };

  const getMethodColor = (method) => {
    const colors = {
      GET: '#1976d2',
      POST: '#4caf50',
      PUT: '#ff9800',
      DELETE: '#f44336',
    };
    return colors[method] || '#1976d2';
  };

  const getImpactedApis = (apiName) => {
    const directImpacted = new Set();
    const indirectImpacted = new Set();

    apis.forEach((api) => {
      if (api.lineage?.upstream?.some((u) => u.source === apiName)) {
        directImpacted.add(api.name);
      }
    });

    const findDownstream = (name, visited = new Set()) => {
      if (visited.has(name)) return;
      visited.add(name);

      apis.forEach((api) => {
        if (
          api.lineage?.upstream?.some((u) => u.source === name) &&
          !directImpacted.has(api.name) &&
          api.name !== apiName
        ) {
          indirectImpacted.add(api.name);
          findDownstream(api.name, visited);
        }
      });
    };

    directImpacted.forEach((name) => {
      findDownstream(name);
    });

    return {
      direct: Array.from(directImpacted),
      indirect: Array.from(indirectImpacted),
    };
  };

  return (
    <Paper className={classes.root}>
      <div className={classes.header}>
        <Typography variant="h6" component="h2">
          API血缘关系可视化
        </Typography>
        <FormControl variant="outlined" className={classes.dependencyTypeSelector}>
          <InputLabel id="dependency-type-label">依赖类型</InputLabel>
          <Select
            labelId="dependency-type-label"
            id="dependency-type"
            value={selectedDependencyType}
            onChange={handleDependencyTypeChange}
            label="依赖类型"
          >
            {dependencyTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: type.color,
                      display: 'inline-block',
                      marginRight: 8,
                    }}
                  />
                  {type.label}
                </div>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className={classes.graphContainer}>
        <div className={classes.graphControls}>
          <Tooltip title="放大">
            <IconButton onClick={handleZoomIn} size="small">
              <ZoomInIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="缩小">
            <IconButton onClick={handleZoomOut} size="small">
              <ZoomOutIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="重置">
            <IconButton onClick={handleReset} size="small">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </div>

        {loading && (
          <div className={classes.graphLoading}>
            <CircularProgress />
            <Typography variant="body2" style={{ marginTop: 8 }}>
              加载血缘关系图...
            </Typography>
          </div>
        )}

        {!loading && graphData.nodes.length === 0 && (
          <Typography className={classes.noDataMessage} variant="body1">
            没有API血缘数据可显示。请先创建API及其依赖关系。
          </Typography>
        )}

        {!loading && graphData.nodes.length > 0 && (
          <Graph
            id="api-lineage-graph"
            data={graphData}
            config={{
              ...graphConfig,
              d3: { ...graphConfig.d3, zoom },
            }}
            onClickNode={onNodeClick}
          />
        )}

        {selectedNode && (
          <Card className={classes.infoPanel}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {selectedNode.name}
              </Typography>
              {selectedNode.endpoint && (
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  <span
                    style={{
                      backgroundColor: getMethodColor(selectedNode.method),
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: 4,
                      marginRight: 8,
                      fontSize: 12,
                      fontWeight: 'bold',
                    }}
                  >
                    {selectedNode.method || 'GET'}
                  </span>
                  <Typography variant="body2">{selectedNode.endpoint}</Typography>
                </div>
              )}
              <Divider style={{ margin: '8px 0' }} />
              <Typography variant="subtitle2">依赖分析:</Typography>
              <div>
                <Typography variant="body2">
                  上游依赖: {selectedNode.lineage?.upstream?.length || 0}
                </Typography>
                <Typography variant="body2">
                  下游影响: {getImpactedApis(selectedNode.name).direct.length} 直接,{' '}
                  {getImpactedApis(selectedNode.name).indirect.length} 间接
                </Typography>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className={classes.legendContainer}>
        {dependencyTypes
          .filter((t) => t.value !== 'all')
          .map((type) => (
            <div className={classes.legendItem} key={type.value}>
              <div
                className={classes.legendColor}
                style={{ backgroundColor: type.color }}
              />
              <Typography variant="body2">{type.label}</Typography>
            </div>
          ))}
      </div>

      <div className={classes.statsContainer}>
        <div className={classes.statItem}>
          <Typography className={classes.statValue}>{stats.totalApis}</Typography>
          <Typography className={classes.statLabel}>API总数</Typography>
        </div>
        <div className={classes.statItem}>
          <Typography className={classes.statValue}>{stats.dependencyCount}</Typography>
          <Typography className={classes.statLabel}>依赖关系总数</Typography>
        </div>
        <div className={classes.statItem}>
          <Typography className={classes.statValue}>{stats.upstreamMax}</Typography>
          <Typography className={classes.statLabel}>最大上游依赖数</Typography>
        </div>
        <div className={classes.statItem}>
          <Typography className={classes.statValue}>{stats.downstreamMax}</Typography>
          <Typography className={classes.statLabel}>最大下游影响数</Typography>
        </div>
      </div>
    </Paper>
  );
};

ApiLineageManager.propTypes = {
  apis: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      endpoint: PropTypes.string,
      method: PropTypes.string,
      lineage: PropTypes.shape({
        upstream: PropTypes.arrayOf(
          PropTypes.shape({
            type: PropTypes.string,
            source: PropTypes.string,
          })
        ),
      }),
    })
  ).isRequired,
};

export default ApiLineageManager; 