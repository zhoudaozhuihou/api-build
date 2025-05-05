import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  FormControlLabel,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Box,
  Grid,
  Radio,
  RadioGroup,
  Switch,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper as MuiPaper,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LinkIcon from '@material-ui/icons/Link';
import AddIcon from '@material-ui/icons/Add';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import TrackChangesIcon from '@material-ui/icons/TrackChanges';
import SortIcon from '@material-ui/icons/Sort';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import IntegrationInstructionsIcon from '@material-ui/icons/Code';
import StorageIcon from '@material-ui/icons/Storage';
import BuildIcon from '@material-ui/icons/Build';

const useStyles = makeStyles({
  root: {
    padding: '24px',
    marginBottom: '24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  tableSelection: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '24px',
  },
  formControl: {
    minWidth: '200px',
  },
  selectedTables: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '16px',
    marginBottom: '24px',
  },
  chip: {
    margin: '0 4px 4px 0',
  },
  previewTable: {
    marginTop: '16px',
  },
  relationshipsContainer: {
    marginTop: '24px',
    padding: '16px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
  },
  relationshipItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    marginBottom: '8px',
    backgroundColor: 'white',
    borderRadius: '4px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  relationshipType: {
    margin: '0 16px',
    padding: '4px 8px',
    borderRadius: '4px',
    backgroundColor: '#e3f2fd',
  },
  buttonGroup: {
    marginTop: '16px',
    display: 'flex',
    gap: '8px',
  },
  divider: {
    margin: '24px 0',
  },
  relationshipsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  formSection: {
    marginBottom: '24px',
  },
  relationshipChip: {
    fontWeight: 'bold',
  },
  codeBlock: {
    fontFamily: 'monospace',
    padding: '12px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    overflowX: 'auto',
    whiteSpace: 'pre',
    fontSize: '14px',
  },
  actionButtons: {
    display: 'flex',
    gap: '8px',
  },
  detailSection: {
    marginBottom: '24px',
  },
  detailItem: {
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
  },
  detailLabel: {
    fontWeight: 'bold',
    marginRight: '8px',
    minWidth: '150px',
  },
  sqlPreviewSection: {
    marginTop: '16px',
  },
  advancedOptions: {
    marginTop: '16px',
    padding: '16px',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
  },
  lineageContainer: {
    marginTop: '24px',
    padding: '16px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
  },
  lineageCard: {
    marginBottom: '16px',
    position: 'relative',
  },
  lineageActions: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    display: 'flex',
  },
  lineageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  lineageArrow: {
    margin: '0 12px',
    color: '#757575',
  },
  lineageFlow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px',
  },
  upstreamApi: {
    padding: '8px 12px',
    backgroundColor: '#e3f2fd',
    borderRadius: '4px',
    marginRight: '8px',
    fontWeight: 'medium',
  },
  currentApi: {
    padding: '8px 12px',
    backgroundColor: '#e8f5e9',
    borderRadius: '4px',
    fontWeight: 'medium',
  },
  orderingContainer: {
    marginTop: '24px',
    padding: '16px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
  },
  groupByContainer: {
    marginTop: '24px',
    padding: '16px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
  },
  queryOptionsContainer: {
    marginTop: '24px',
    padding: '16px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
  },
  optionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  optionCard: {
    marginBottom: '16px',
  },
  orderItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px',
    backgroundColor: '#e3f2fd',
    borderRadius: '4px',
    marginBottom: '8px',
  },
  groupItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px',
    backgroundColor: '#e8f5e9',
    borderRadius: '4px',
    marginBottom: '8px',
  },
  directionIcon: {
    marginLeft: '8px',
  },
  orderActions: {
    marginLeft: 'auto',
    display: 'flex',
  },
  dragHandle: {
    cursor: 'move',
    marginRight: '8px',
    color: '#757575',
  },
  columnName: {
    fontWeight: 'medium',
  },
  aggregateFunction: {
    marginLeft: '8px',
    color: '#1976d2',
    fontStyle: 'italic',
  },
  accordionRoot: {
    marginBottom: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
  },
  accordionSummary: {
    backgroundColor: '#f9f9f9',
  },
  stepper: {
    marginTop: '32px',
    marginBottom: '32px',
  },
  stepContent: {
    padding: '16px 0',
  },
  stepButton: {
    marginTop: '16px',
    marginRight: '8px',
  },
  stepHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px',
  },
  stepIcon: {
    marginRight: '8px',
    color: '#1976d2',
  },
  methodChip: {
    fontWeight: 'bold',
    minWidth: '80px',
    textAlign: 'center',
    marginRight: '8px',
  },
  apiEndpoint: {
    fontFamily: 'monospace',
    padding: '8px 12px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    marginTop: '8px',
  },
  methodSelect: {
    minWidth: '100px',
    marginRight: '8px',
    '& .MuiSelect-select': {
      color: 'white',
      fontWeight: 'bold',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(0, 0, 0, 0.12)',
    },
  },
  methodMenuItem: {
    fontWeight: 'bold',
  },
  endpointContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '8px',
    marginBottom: '8px',
  },
  endpointField: {
    fontFamily: 'monospace',
    flexGrow: 1,
  },
  readOnlyEndpoint: {
    fontFamily: 'monospace',
    backgroundColor: '#f5f5f5',
    padding: '8px 12px',
    borderRadius: '4px',
    flexGrow: 1,
    marginLeft: '8px',
  },
  methodButton: {
    color: 'white',
    fontWeight: 'bold',
    padding: '4px 12px',
    borderRadius: '4px',
    minWidth: '60px',
    textAlign: 'center',
    marginRight: '8px',
    fontSize: '14px',
    textTransform: 'uppercase',
    display: 'inline-block',
  },
  methodDropdown: {
    minWidth: '100px',
    marginRight: '8px',
  },
  methodIndicator: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: '8px',
  },
  statusIndicator: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: '8px',
  },
  statusSelector: {
    minWidth: '120px',
  },
  statusMenuItem: {
    display: 'flex',
    alignItems: 'center',
  },
  apiEndpointRow: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '8px',
  },
  apiCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
});

// Mock data (in a real app, this would come from the selected database)
const mockTables = [
  { name: 'users', columns: ['id', 'username', 'email', 'created_at', 'last_login', 'status', 'profile_image'] },
  { name: 'posts', columns: ['id', 'user_id', 'title', 'content', 'created_at', 'updated_at', 'status', 'view_count', 'featured'] },
  { name: 'comments', columns: ['id', 'post_id', 'user_id', 'content', 'created_at', 'is_approved'] },
  { name: 'categories', columns: ['id', 'name', 'description', 'slug', 'parent_id'] },
  { name: 'post_categories', columns: ['post_id', 'category_id', 'is_primary'] },
  { name: 'tags', columns: ['id', 'name', 'slug'] },
  { name: 'post_tags', columns: ['post_id', 'tag_id'] },
  { name: 'media', columns: ['id', 'user_id', 'file_name', 'file_type', 'file_size', 'path', 'created_at'] },
];

const relationshipTypes = [
  { value: 'ONE_TO_ONE', label: 'ONE-TO-ONE', description: '每个源记录关联一个目标记录，每个目标记录关联一个源记录（如用户与用户个人资料）' },
  { value: 'ONE_TO_MANY', label: 'ONE-TO-MANY', description: '一个源记录关联多个目标记录（如用户与多个帖子）' },
  { value: 'MANY_TO_ONE', label: 'MANY-TO-ONE', description: '多个源记录关联同一个目标记录（如多个帖子关联一个用户）' },
  { value: 'MANY_TO_MANY', label: 'MANY-TO-MANY', description: '多个源记录关联多个目标记录，通常通过中间表实现（如帖子与标签）' },
  { value: 'SELF_REFERENCING', label: 'SELF-REFERENCING', description: '同一表内的记录相互关联（如评论层级或组织结构）' },
  { value: 'CUSTOM_JOIN', label: 'CUSTOM-JOIN', description: '自定义SQL JOIN条件（适用于非标准关系或复杂条件）' },
];

const joinTypes = [
  { value: 'INNER', label: 'INNER JOIN', description: '仅返回两表中都匹配的记录' },
  { value: 'LEFT', label: 'LEFT JOIN', description: '返回左表所有记录，即使右表没有匹配' },
  { value: 'RIGHT', label: 'RIGHT JOIN', description: '返回右表所有记录，即使左表没有匹配' },
  { value: 'FULL', label: 'FULL JOIN', description: '返回两表中的所有记录，无论是否匹配' },
  { value: 'CROSS', label: 'CROSS JOIN', description: '返回两表的笛卡尔积（所有记录的组合）' },
];

// Sample data for various fields
const sampleData = {
  usernames: ['johndoe', 'janesmith', 'bobmartin', 'alicejones', 'sarahlee', 'mikebrown', 'emmadavis', 'chrisevans'],
  emails: ['john@example.com', 'jane@example.com', 'bob@example.com', 'alice@example.com', 'sarah@example.com'],
  titles: ['Getting Started with React', 'Database Design Best Practices', 'API Integration Tutorial', 'Building Modern UIs', 'Performance Optimization Tips'],
  statuses: ['active', 'inactive', 'pending', 'deleted', 'banned'],
  categories: ['Technology', 'Design', 'Development', 'Business', 'Marketing', 'Mobile', 'AI', 'Data Science'],
  tagNames: ['react', 'javascript', 'api', 'tutorial', 'frontend', 'backend', 'database', 'design', 'ui/ux', 'performance'],
  mediaTypes: ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4', 'audio/mpeg'],
};

// Aggregate function options for GROUP BY
const aggregateFunctions = [
  { value: 'COUNT', label: 'COUNT' },
  { value: 'SUM', label: 'SUM' },
  { value: 'AVG', label: 'AVG' },
  { value: 'MIN', label: 'MIN' },
  { value: 'MAX', label: 'MAX' },
];

// Add publication status options
const publicationStatuses = [
  { value: 'published', label: '已发布', color: '#4caf50' },      // Green
  { value: 'testing', label: '测试中', color: '#ff9800' },        // Orange
  { value: 'to_be_deprecated', label: '将废弃', color: '#757575' }, // Gray
  { value: 'development', label: '开发中', color: '#2196f3' },    // Blue
  { value: 'deprecated', label: '已废弃', color: '#9e9e9e' }      // Light Gray
];

const httpMethods = [
  { value: 'GET', color: '#2196f3' },    // 蓝色
  { value: 'POST', color: '#ff9800' },   // 橙色
  { value: 'PUT', color: '#4caf50' },    // 绿色
  { value: 'DELETE', color: '#f44336' }, // 红色
  { value: 'PATCH', color: '#9c27b0' },  // 紫色
  { value: 'HEAD', color: '#607d8b' },   // 蓝灰色
  { value: 'OPTIONS', color: '#795548' } // 棕色
];

const TableRelationships = ({ selectedConnection }) => {
  const classes = useStyles();
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedTables, setSelectedTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [currentTableData, setCurrentTableData] = useState(null);
  const [relationships, setRelationships] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [relationshipDetailOpen, setRelationshipDetailOpen] = useState(false);
  const [currentRelationship, setCurrentRelationship] = useState(null);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [relationshipForm, setRelationshipForm] = useState({
    sourceTable: '',
    sourceColumn: '',
    relationshipType: 'ONE_TO_MANY',
    targetTable: '',
    targetColumn: '',
    joinType: 'INNER',
    customCondition: '',
    description: '',
    isBidirectional: false,
    useJoinTable: false,
    joinTable: '',
    joinTableSourceColumn: '',
    joinTableTargetColumn: '',
  });

  // New state variables for API lineage
  const [apiLineage, setApiLineage] = useState([]);
  const [lineageDialogOpen, setLineageDialogOpen] = useState(false);
  const [currentLineage, setCurrentLineage] = useState(null);
  const [lineageForm, setLineageForm] = useState({
    apiName: '',
    httpMethod: 'GET',
    apiEndpoint: '',
    publicationStatus: 'published', // Added publicationStatus
    upstreamApis: [],
    description: '',
    upstreamApi: '',
  });

  // New state variables for ordering and grouping
  const [orderingDialogOpen, setOrderingDialogOpen] = useState(false);
  const [groupByDialogOpen, setGroupByDialogOpen] = useState(false);
  const [queryOptionsDialogOpen, setQueryOptionsDialogOpen] = useState(false);
  
  const [orderingOptions, setOrderingOptions] = useState([]);
  const [groupByOptions, setGroupByOptions] = useState([]);
  
  const [orderingForm, setOrderingForm] = useState({
    column: '',
    direction: 'ASC',
    table: '',
  });
  
  const [groupByForm, setGroupByForm] = useState({
    column: '',
    table: '',
    aggregateFunction: '',
    aggregateColumn: '',
  });

  // Add state for stepper
  const [activeStep, setActiveStep] = useState(0);

  // In a real app, we would fetch tables from the selected database
  useEffect(() => {
    if (selectedConnection) {
      // Mock fetching tables from the database
      setAvailableTables(mockTables);
      
      // Add some default selected tables for demo
      const defaultTables = ['users', 'posts', 'comments'];
      setSelectedTables(defaultTables);
      setSelectedTable('users');
      setCurrentTableData(mockTables.find(t => t.name === 'users'));
      
      // Add some demo relationships
      const demoRelationships = [
        {
          id: 1,
          sourceTable: 'users',
          sourceColumn: 'id',
          relationshipType: 'ONE_TO_MANY',
          targetTable: 'posts',
          targetColumn: 'user_id',
        },
        {
          id: 2,
          sourceTable: 'posts',
          sourceColumn: 'id',
          relationshipType: 'ONE_TO_MANY',
          targetTable: 'comments',
          targetColumn: 'post_id',
        },
        {
          id: 3,
          sourceTable: 'users',
          sourceColumn: 'id',
          relationshipType: 'ONE_TO_MANY',
          targetTable: 'comments',
          targetColumn: 'user_id',
        },
        {
          id: 4,
          sourceTable: 'posts',
          sourceColumn: 'id',
          relationshipType: 'MANY_TO_MANY',
          targetTable: 'categories',
          targetColumn: 'id',
        }
      ];
      setRelationships(demoRelationships);
    }
  }, [selectedConnection]);

  const handleTableSelect = (e) => {
    const tableName = e.target.value;
    setSelectedTable(tableName);
    
    if (tableName) {
      const tableData = mockTables.find(t => t.name === tableName);
      setCurrentTableData(tableData);
      
      if (!selectedTables.includes(tableName)) {
        setSelectedTables([...selectedTables, tableName]);
      }
    }
  };

  const handleRemoveTable = (tableName) => {
    setSelectedTables(selectedTables.filter(t => t !== tableName));
    
    // Also remove any relationships involving this table
    setRelationships(relationships.filter(r => 
      r.sourceTable !== tableName && r.targetTable !== tableName
    ));
    
    if (selectedTable === tableName) {
      setSelectedTable('');
      setCurrentTableData(null);
    }
  };

  const handleOpenDialog = () => {
    if (selectedTables.length < 2) {
      alert('Please select at least two tables to create a relationship');
      return;
    }
    
    setRelationshipForm({
      sourceTable: selectedTables[0],
      sourceColumn: '',
      relationshipType: 'ONE_TO_MANY',
      targetTable: selectedTables[1],
      targetColumn: '',
    });
    
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleRelationshipFormChange = (e) => {
    const { name, value } = e.target;
    setRelationshipForm(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleAdvancedMode = () => {
    setAdvancedMode(!advancedMode);
  };

  const handleJoinTypeChange = (e) => {
    setRelationshipForm(prev => ({ ...prev, joinType: e.target.value }));
  };

  const handleOpenRelationshipDetail = (relationship) => {
    setCurrentRelationship(relationship);
    setRelationshipDetailOpen(true);
  };

  const handleCloseRelationshipDetail = () => {
    setRelationshipDetailOpen(false);
    setCurrentRelationship(null);
  };

  const handleAddRelationship = () => {
    const { 
      sourceTable, sourceColumn, relationshipType, 
      targetTable, targetColumn, joinType, customCondition,
      description, isBidirectional, useJoinTable,
      joinTable, joinTableSourceColumn, joinTableTargetColumn
    } = relationshipForm;
    
    if (!sourceTable || !sourceColumn || !relationshipType || !targetTable || !targetColumn) {
      alert('请填写所有必填字段');
      return;
    }
    
    if (relationshipType === 'MANY_TO_MANY' && useJoinTable && 
        (!joinTable || !joinTableSourceColumn || !joinTableTargetColumn)) {
      alert('使用中间表时，必须填写中间表和关联列');
      return;
    }

    if (relationshipType === 'CUSTOM_JOIN' && !customCondition) {
      alert('自定义JOIN需要填写JOIN条件');
      return;
    }

    const newRelationship = {
      id: Date.now(),
      sourceTable,
      sourceColumn,
      relationshipType,
      targetTable,
      targetColumn,
      joinType: relationshipType === 'CUSTOM_JOIN' ? joinType : 'INNER',
      customCondition: relationshipType === 'CUSTOM_JOIN' ? customCondition : '',
      description: description || `${sourceTable}.${sourceColumn} → ${relationshipType} → ${targetTable}.${targetColumn}`,
      isBidirectional,
      useJoinTable: relationshipType === 'MANY_TO_MANY' && useJoinTable,
      joinTable: useJoinTable ? joinTable : '',
      joinTableSourceColumn: useJoinTable ? joinTableSourceColumn : '',
      joinTableTargetColumn: useJoinTable ? joinTableTargetColumn : '',
    };
    
    setRelationships([...relationships, newRelationship]);
    
    if (isBidirectional && relationshipType !== 'CUSTOM_JOIN') {
      const reversedType = relationshipType === 'ONE_TO_MANY' ? 'MANY_TO_ONE' : 
                           relationshipType === 'MANY_TO_ONE' ? 'ONE_TO_MANY' : 
                           relationshipType;
      
      const reverseRelationship = {
        id: Date.now() + 1,
        sourceTable: targetTable,
        sourceColumn: targetColumn,
        relationshipType: reversedType,
        targetTable: sourceTable,
        targetColumn: sourceColumn,
        joinType: 'INNER',
        customCondition: '',
        description: `${targetTable}.${targetColumn} → ${reversedType} → ${sourceTable}.${sourceColumn} (自动创建的反向关系)`,
        isBidirectional: false,
        useJoinTable: relationshipType === 'MANY_TO_MANY' && useJoinTable,
        joinTable: useJoinTable ? joinTable : '',
        joinTableSourceColumn: useJoinTable ? joinTableTargetColumn : '',
        joinTableTargetColumn: useJoinTable ? joinTableSourceColumn : '',
      };
      
      setRelationships(prev => [...prev, reverseRelationship]);
    }
    
    setDialogOpen(false);
  };

  const getColumnsForTable = (tableName) => {
    const table = mockTables.find(t => t.name === tableName);
    return table ? table.columns : [];
  };

  const generatePreviewData = (tableName) => {
    // In a real app, this would fetch actual data from the database
    const columns = getColumnsForTable(tableName);
    const rows = [];
    
    // Generate realistic mock data
    for (let i = 1; i <= 5; i++) {
      const row = {};
      columns.forEach(col => {
        if (col === 'id') {
          row[col] = i;
        } else if (col === 'user_id' || col === 'post_id' || col === 'category_id' || col === 'tag_id' || col === 'parent_id') {
          row[col] = Math.floor(Math.random() * 5) + 1;
        } else if (col === 'created_at' || col === 'updated_at' || col === 'last_login') {
          const date = new Date();
          date.setDate(date.getDate() - Math.floor(Math.random() * 30));
          row[col] = date.toISOString().split('T')[0];
        } else if (col === 'username') {
          row[col] = sampleData.usernames[Math.floor(Math.random() * sampleData.usernames.length)];
        } else if (col === 'email') {
          row[col] = sampleData.emails[Math.floor(Math.random() * sampleData.emails.length)];
        } else if (col === 'title') {
          row[col] = sampleData.titles[Math.floor(Math.random() * sampleData.titles.length)];
        } else if (col === 'content') {
          row[col] = `Sample content for ${tableName} #${i}. This is a longer text field with multiple sentences.`;
        } else if (col === 'status') {
          row[col] = sampleData.statuses[Math.floor(Math.random() * sampleData.statuses.length)];
        } else if (col === 'name' && tableName === 'categories') {
          row[col] = sampleData.categories[Math.floor(Math.random() * sampleData.categories.length)];
        } else if (col === 'name' && tableName === 'tags') {
          row[col] = sampleData.tagNames[Math.floor(Math.random() * sampleData.tagNames.length)];
        } else if (col === 'slug') {
          row[col] = `sample-slug-${i}`;
        } else if (col === 'view_count') {
          row[col] = Math.floor(Math.random() * 1000);
        } else if (col === 'is_approved' || col === 'featured' || col === 'is_primary') {
          row[col] = Math.random() > 0.5 ? true : false;
        } else if (col === 'file_type') {
          row[col] = sampleData.mediaTypes[Math.floor(Math.random() * sampleData.mediaTypes.length)];
        } else if (col === 'file_size') {
          row[col] = `${Math.floor(Math.random() * 1000) + 100}KB`;
        } else if (col === 'path') {
          row[col] = `/uploads/media/${i}.jpg`;
        } else if (col === 'file_name') {
          row[col] = `file_${i}.jpg`;
        } else if (col === 'profile_image') {
          row[col] = `/assets/profiles/user${i}.png`;
        } else if (col === 'description') {
          row[col] = `Description for item #${i}`;
        } else {
          row[col] = `${tableName}_${col}_${i}`;
        }
      });
      rows.push(row);
    }
    
    return rows;
  };

  const generateSqlPreview = (relationship, includeOrderAndGroup = false) => {
    if (!relationship) return '';
    
    const { 
      sourceTable, sourceColumn, relationshipType, targetTable, targetColumn,
      joinType, customCondition, useJoinTable, joinTable,
      joinTableSourceColumn, joinTableTargetColumn
    } = relationship;
    
    let sql = `SELECT * FROM ${sourceTable}\n`;
    
    if (relationshipType === 'CUSTOM_JOIN') {
      sql += `${joinType} JOIN ${targetTable} ON ${customCondition}`;
    } else if (relationshipType === 'MANY_TO_MANY' && useJoinTable) {
      sql += `${joinType} JOIN ${joinTable} ON ${sourceTable}.${sourceColumn} = ${joinTable}.${joinTableSourceColumn}\n`;
      sql += `${joinType} JOIN ${targetTable} ON ${joinTable}.${joinTableTargetColumn} = ${targetTable}.${targetColumn}`;
    } else {
      sql += `${joinType} JOIN ${targetTable} ON ${sourceTable}.${sourceColumn} = ${targetTable}.${targetColumn}`;
    }
    
    // Add GROUP BY clause if we have group by options and includeOrderAndGroup is true
    if (includeOrderAndGroup && groupByOptions.length > 0) {
      sql += '\nGROUP BY ';
      sql += groupByOptions.map(opt => `${opt.table}.${opt.column}`).join(', ');
      
      // Add any aggregate functions in the SELECT clause
      // This would require modifying the SELECT part above
      const hasAggregates = groupByOptions.some(opt => opt.aggregateFunction && opt.aggregateColumn);
      if (hasAggregates) {
        // Replace the SELECT * with specific columns including aggregates
        const selectParts = [];
        
        // Add all the GROUP BY columns
        groupByOptions.forEach(opt => {
          selectParts.push(`${opt.table}.${opt.column}`);
        });
        
        // Add the aggregate functions
        groupByOptions.forEach(opt => {
          if (opt.aggregateFunction && opt.aggregateColumn) {
            selectParts.push(`${opt.aggregateFunction}(${opt.table}.${opt.aggregateColumn}) AS ${opt.aggregateFunction.toLowerCase()}_${opt.aggregateColumn}`);
          }
        });
        
        // Replace the SELECT * part with our specific columns
        sql = sql.replace('SELECT *', `SELECT ${selectParts.join(', ')}`);
      }
    }
    
    // Add ORDER BY clause if we have ordering options and includeOrderAndGroup is true
    if (includeOrderAndGroup && orderingOptions.length > 0) {
      sql += '\nORDER BY ';
      sql += orderingOptions.map(opt => `${opt.table}.${opt.column} ${opt.direction}`).join(', ');
    }
    
    return sql;
  };

  const renderRelationshipDescription = (type) => {
    const relationshipType = relationshipTypes.find(t => t.value === type);
    return relationshipType ? relationshipType.description : '';
  };

  const renderJoinTypeDescription = (type) => {
    const joinType = joinTypes.find(t => t.value === type);
    return joinType ? joinType.description : '';
  };

  // New functions for API lineage
  const handleOpenLineageDialog = (lineage = null) => {
    if (lineage) {
      setCurrentLineage(lineage);
      setLineageForm({
        apiName: lineage.apiName,
        httpMethod: lineage.httpMethod || 'GET',
        apiEndpoint: lineage.apiEndpoint || '',
        publicationStatus: lineage.publicationStatus || 'published', // Added publicationStatus
        upstreamApis: [...lineage.upstreamApis],
        description: lineage.description || '',
        upstreamApi: '',
      });
    } else {
      setCurrentLineage(null);
      setLineageForm({
        apiName: '',
        httpMethod: 'GET',
        apiEndpoint: '',
        publicationStatus: 'published', // Added publicationStatus
        upstreamApis: [],
        description: '',
        upstreamApi: '',
      });
    }
    setLineageDialogOpen(true);
  };

  const handleCloseLineageDialog = () => {
    setLineageDialogOpen(false);
    setCurrentLineage(null);
  };

  const handleLineageFormChange = (e) => {
    const { name, value } = e.target;
    setLineageForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddUpstreamApi = () => {
    if (!lineageForm.upstreamApi.trim()) return;
    
    if (!lineageForm.upstreamApis.includes(lineageForm.upstreamApi)) {
      setLineageForm(prev => ({
        ...prev,
        upstreamApis: [...prev.upstreamApis, prev.upstreamApi],
        upstreamApi: '',
      }));
    }
  };

  const handleRemoveUpstreamApi = (api) => {
    setLineageForm(prev => ({
      ...prev,
      upstreamApis: prev.upstreamApis.filter(a => a !== api),
    }));
  };

  const handleSaveLineage = () => {
    if (!lineageForm.apiName) {
      alert('API名称不能为空');
      return;
    }

    if (currentLineage) {
      // Update existing lineage
      setApiLineage(apiLineage.map(l => 
        l.id === currentLineage.id ? 
          { ...l, ...lineageForm, id: currentLineage.id } : 
          l
      ));
    } else {
      // Add new lineage
      setApiLineage([...apiLineage, {
        id: Date.now(),
        ...lineageForm,
      }]);
    }
    
    handleCloseLineageDialog();
  };

  const handleDeleteLineage = (id) => {
    setApiLineage(apiLineage.filter(l => l.id !== id));
  };

  // Ordering dialog handlers
  const handleOpenOrderingDialog = () => {
    if (selectedTables.length === 0) {
      alert('Please select at least one table first');
      return;
    }
    
    setOrderingForm({
      column: '',
      direction: 'ASC',
      table: selectedTables[0],
    });
    
    setOrderingDialogOpen(true);
  };
  
  const handleCloseOrderingDialog = () => {
    setOrderingDialogOpen(false);
  };
  
  const handleOrderingFormChange = (e) => {
    const { name, value } = e.target;
    setOrderingForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddOrdering = () => {
    if (!orderingForm.column || !orderingForm.table) {
      alert('请选择排序列和表');
      return;
    }
    
    const newOrdering = {
      id: Date.now(),
      table: orderingForm.table,
      column: orderingForm.column,
      direction: orderingForm.direction,
    };
    
    setOrderingOptions([...orderingOptions, newOrdering]);
    
    // Reset form for next entry
    setOrderingForm({
      ...orderingForm,
      column: '',
    });
  };
  
  const handleRemoveOrdering = (id) => {
    setOrderingOptions(orderingOptions.filter(item => item.id !== id));
  };
  
  const handleToggleOrderingDirection = (id) => {
    setOrderingOptions(orderingOptions.map(item => 
      item.id === id ? 
        { ...item, direction: item.direction === 'ASC' ? 'DESC' : 'ASC' } : 
        item
    ));
  };
  
  // Group By dialog handlers
  const handleOpenGroupByDialog = () => {
    if (selectedTables.length === 0) {
      alert('请先选择至少一个表');
      return;
    }
    
    setGroupByForm({
      column: '',
      table: selectedTables[0],
      aggregateFunction: '',
      aggregateColumn: '',
    });
    
    setGroupByDialogOpen(true);
  };
  
  const handleCloseGroupByDialog = () => {
    setGroupByDialogOpen(false);
  };
  
  const handleGroupByFormChange = (e) => {
    const { name, value } = e.target;
    setGroupByForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddGroupBy = () => {
    if (!groupByForm.column || !groupByForm.table) {
      alert('请选择分组列和表');
      return;
    }
    
    const newGroupBy = {
      id: Date.now(),
      table: groupByForm.table,
      column: groupByForm.column,
      aggregateFunction: groupByForm.aggregateFunction,
      aggregateColumn: groupByForm.aggregateColumn,
    };
    
    setGroupByOptions([...groupByOptions, newGroupBy]);
    
    // Reset form for next entry
    setGroupByForm({
      ...groupByForm,
      column: '',
      aggregateFunction: '',
      aggregateColumn: '',
    });
  };
  
  const handleRemoveGroupBy = (id) => {
    setGroupByOptions(groupByOptions.filter(item => item.id !== id));
  };
  
  // Query Options dialog handlers
  const handleOpenQueryOptionsDialog = () => {
    if (selectedTables.length === 0) {
      alert('请先选择至少一个表');
      return;
    }
    
    setQueryOptionsDialogOpen(true);
  };
  
  const handleCloseQueryOptionsDialog = () => {
    setQueryOptionsDialogOpen(false);
  };

  // Get available columns for both tables and the current table
  const getAvailableColumnsForOrdering = () => {
    const columns = [];
    
    if (orderingForm.table) {
      const tableColumns = getColumnsForTable(orderingForm.table);
      columns.push(...tableColumns.map(col => ({
        table: orderingForm.table,
        column: col,
        display: `${orderingForm.table}.${col}`
      })));
    }
    
    return columns;
  };
  
  const getAvailableColumnsForGroupBy = () => {
    const columns = [];
    
    if (groupByForm.table) {
      const tableColumns = getColumnsForTable(groupByForm.table);
      columns.push(...tableColumns.map(col => ({
        table: groupByForm.table,
        column: col,
        display: `${groupByForm.table}.${col}`
      })));
    }
    
    return columns;
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  // Add this helper function for rendering method selects
  const renderMethodSelect = (value, onChange, disabled = false) => {
    const selectedMethod = httpMethods.find(m => m.value === value) || httpMethods[0];
    
    return React.createElement(
      FormControl,
      { 
        variant: 'outlined', 
        className: classes.methodDropdown,
        size: 'small',
      },
      !disabled && React.createElement(
        InputLabel,
        { id: 'http-method-label' },
        'Method'
      ),
      React.createElement(
        Select,
        {
          labelId: 'http-method-label',
          id: 'http-method',
          name: 'httpMethod',
          value: value,
          onChange: onChange,
          label: disabled ? undefined : 'Method',
          disabled: disabled,
        },
        httpMethods.map(method => React.createElement(
          MenuItem,
          { 
            key: method.value, 
            value: method.value,
          },
          React.createElement(
            'div',
            { className: classes.methodMenuItem },
            React.createElement(
              'span',
              {
                className: classes.methodIndicator,
                style: { backgroundColor: method.color }
              }
            ),
            React.createElement(
              Typography,
              { 
                variant: 'body2',
                style: { fontWeight: 'bold' }
              },
              method.value
            )
          )
        ))
      )
    );
  };

  // Helper function to render HTTP method button
  const renderMethodButton = (method) => {
    const methodObj = httpMethods.find(m => m.value === method) || httpMethods[0];
    
    return React.createElement(
      'div',
      {
        className: classes.methodButton,
        style: { backgroundColor: methodObj.color }
      },
      method
    );
  };

  // Helper function to render publication status
  const renderPublicationStatus = (status) => {
    const statusObj = publicationStatuses.find(s => s.value === status) || publicationStatuses[0];
    
    return React.createElement(
      'div',
      {
        style: { display: 'flex', alignItems: 'center' }
      },
      React.createElement(
        'span',
        {
          className: classes.statusIndicator,
          style: { backgroundColor: statusObj.color }
        }
      ),
      React.createElement(
        Typography,
        { variant: 'body2' },
        statusObj.label
      )
    );
  };

  return React.createElement(
    Paper,
    { className: classes.root },
    React.createElement(
      'div',
      { className: classes.header },
      React.createElement(
        Typography,
        { variant: 'h5', component: 'h2' },
        'Table Relationships & Query Builder'
      )
    ),
    
    // Table Selection Section
    React.createElement(
      'div',
      { className: classes.tableSelection },
      React.createElement(
        FormControl,
        { variant: 'outlined', className: classes.formControl },
        React.createElement(
          InputLabel,
          { id: 'table-select-label' },
          'Select Table'
        ),
        React.createElement(
          Select,
          {
            labelId: 'table-select-label',
            id: 'table-select',
            value: selectedTable,
            onChange: handleTableSelect,
            label: 'Select Table',
          },
          availableTables.map(table => React.createElement(
            MenuItem,
            { key: table.name, value: table.name },
            table.name
          ))
        )
      ),
      React.createElement(
        Button,
        {
          variant: 'outlined',
          color: 'primary',
          startIcon: React.createElement(VisibilityIcon),
          disabled: !selectedTable,
        },
        'Preview Data'
      )
    ),
    
    selectedTables.length > 0 && React.createElement(
      'div',
      null,
      React.createElement(
        Typography,
        { variant: 'subtitle1', component: 'h3' },
        'Selected Tables'
      ),
      React.createElement(
        'div',
        { className: classes.selectedTables },
        selectedTables.map(table => React.createElement(
          Chip,
          {
            key: table,
            label: table,
            onDelete: () => handleRemoveTable(table),
            className: classes.chip,
            color: selectedTable === table ? 'primary' : 'default',
          }
        ))
      )
    ),
    
    // Stepper for the workflow
    React.createElement(
      Stepper,
      { 
        activeStep: activeStep, 
        orientation: 'vertical',
        className: classes.stepper
      },
      // Step 1: Define Relationships
      React.createElement(
        Step,
        { key: 'define-relationships' },
        React.createElement(
          StepLabel,
          null,
          'Define Table Relationships'
        ),
        React.createElement(
          StepContent,
          null,
          React.createElement(
            'div',
            { className: classes.stepHeader },
            React.createElement(
              StorageIcon,
              { className: classes.stepIcon }
            ),
            React.createElement(
              Typography,
              { variant: 'h6' },
              'Define Relationships Between Tables'
            )
          ),
          React.createElement(
            Typography,
            { variant: 'body2', color: 'textSecondary', paragraph: true },
            'Connect tables together by defining relationships such as one-to-many, many-to-many, etc.'
          ),
          React.createElement(
            Button,
            {
              variant: 'contained',
              color: 'primary',
              startIcon: React.createElement(LinkIcon),
              onClick: handleOpenDialog,
              disabled: selectedTables.length < 2,
              style: { marginBottom: '16px' }
            },
            'Define Relationship'
          ),
          
          // Relationships Container
          React.createElement(
            'div',
            { className: classes.relationshipsContainer },
            React.createElement(
              'div',
              { className: classes.relationshipsHeader },
              React.createElement(
                Typography,
                { variant: 'subtitle1', component: 'h3' },
                'Defined Relationships'
              ),
              relationships.length > 0 && React.createElement(
                Button,
                {
                  variant: 'outlined',
                  color: 'primary',
                  size: 'small',
                  onClick: () => {
                    // 导出关系定义的功能可以在这里实现
                    alert('关系定义导出功能将在此实现');
                  }
                },
                'Export Definitions'
              )
            ),
            relationships.length === 0 ? React.createElement(
              Typography,
              { variant: 'body2', color: 'textSecondary' },
              'No relationships defined yet. Use the "Define Relationship" button to create one.'
            ) : React.createElement(
              TableContainer,
              { component: Paper },
              React.createElement(
                Table,
                { size: 'small' },
                React.createElement(
                  TableHead,
                  null,
                  React.createElement(TableCell, null, 'Source'),
                  React.createElement(TableCell, null, 'Relationship'),
                  React.createElement(TableCell, null, 'Target'),
                  React.createElement(TableCell, null, 'Type'),
                  React.createElement(TableCell, null, 'Actions')
                ),
                React.createElement(
                  TableBody,
                  null,
                  relationships.map(rel => React.createElement(
                    TableRow,
                    { 
                      key: rel.id,
                      hover: true,
                      onClick: () => handleOpenRelationshipDetail(rel)
                    },
                    React.createElement(
                      TableCell,
                      null,
                      `${rel.sourceTable}.${rel.sourceColumn}`
                    ),
                    React.createElement(
                      TableCell,
                      null,
                      React.createElement(
                        Chip,
                        { 
                          label: rel.relationshipType,
                          className: classes.relationshipChip,
                          color: rel.relationshipType === 'CUSTOM_JOIN' ? 'secondary' : 'primary'
                        }
                      )
                    ),
                    React.createElement(
                      TableCell,
                      null,
                      `${rel.targetTable}.${rel.targetColumn}`
                    ),
                    React.createElement(
                      TableCell,
                      null,
                      rel.joinType
                    ),
                    React.createElement(
                      TableCell,
                      null,
                      React.createElement(
                        'div',
                        { className: classes.actionButtons },
                        React.createElement(
                          Button,
                          {
                            size: 'small',
                            color: 'primary',
                            onClick: (e) => {
                              e.stopPropagation();
                              handleOpenRelationshipDetail(rel);
                            }
                          },
                          'View'
                        ),
                        React.createElement(
                          Button,
                          {
                            size: 'small',
                            color: 'secondary',
                            onClick: (e) => {
                              e.stopPropagation();
                              setRelationships(relationships.filter(r => r.id !== rel.id));
                            }
                          },
                          'Delete'
                        )
                      )
                    )
                  ))
                )
              )
            )
          ),
          
          // Step navigation buttons
          React.createElement(
            'div',
            { className: classes.stepButton },
            React.createElement(
              Button,
              {
                variant: 'contained',
                color: 'primary',
                onClick: handleNext,
                disabled: relationships.length === 0
              },
              'Continue to SQL Query Builder'
            )
          )
        )
      ),
      
      // Step 2: SQL Query Builder
      React.createElement(
        Step,
        { key: 'sql-query-builder' },
        React.createElement(
          StepLabel,
          null,
          'Build SQL Query'
        ),
        React.createElement(
          StepContent,
          null,
          React.createElement(
            'div',
            { className: classes.stepHeader },
            React.createElement(
              BuildIcon,
              { className: classes.stepIcon }
            ),
            React.createElement(
              Typography,
              { variant: 'h6' },
              'SQL Query Builder'
            )
          ),
          React.createElement(
            Typography,
            { variant: 'body2', color: 'textSecondary', paragraph: true },
            'Build your SQL query by adding ordering and grouping options.'
          ),
          
          // Query Options Controls
          React.createElement(
            'div',
            { style: { display: 'flex', gap: '8px', marginBottom: '16px' } },
            React.createElement(
              Button,
              {
                variant: 'contained',
                color: 'primary',
                startIcon: React.createElement(SortIcon),
                onClick: handleOpenOrderingDialog,
                disabled: selectedTables.length === 0,
              },
              'Add Ordering'
            ),
            React.createElement(
              Button,
              {
                variant: 'contained',
                color: 'primary',
                startIcon: React.createElement(GroupWorkIcon),
                onClick: handleOpenGroupByDialog,
                disabled: selectedTables.length === 0,
              },
              'Add Group By'
            )
          ),
          
          // Display Ordering Options
          React.createElement(
            Accordion,
            { 
              className: classes.accordionRoot,
              defaultExpanded: orderingOptions.length > 0,
            },
            React.createElement(
              AccordionSummary,
              { 
                expandIcon: React.createElement(ExpandMoreIcon),
                className: classes.accordionSummary,
              },
              React.createElement(
                Typography,
                { variant: 'subtitle1' },
                'Ordering Options'
              ),
              orderingOptions.length > 0 && React.createElement(
                Chip,
                { 
                  label: orderingOptions.length,
                  size: 'small',
                  color: 'primary',
                  style: { marginLeft: '8px' },
                }
              )
            ),
            React.createElement(
              AccordionDetails,
              { style: { display: 'block' } },
              orderingOptions.length === 0 ? React.createElement(
                Typography,
                { variant: 'body2', color: 'textSecondary' },
                'No ordering options defined. Use the "Add Ordering" button to add sorting criteria.'
              ) : React.createElement(
                'div',
                null,
                orderingOptions.map((orderItem, index) => React.createElement(
                  'div',
                  { key: orderItem.id, className: classes.orderItem },
                  React.createElement(
                    DragHandleIcon,
                    { className: classes.dragHandle }
                  ),
                  React.createElement(
                    'span',
                    { className: classes.columnName },
                    `${orderItem.table}.${orderItem.column}`
                  ),
                  React.createElement(
                    IconButton,
                    { 
                      size: 'small',
                      onClick: () => handleToggleOrderingDirection(orderItem.id),
                      className: classes.directionIcon,
                    },
                    orderItem.direction === 'ASC' ? 
                      React.createElement(ArrowUpwardIcon, { fontSize: 'small' }) : 
                      React.createElement(ArrowDownwardIcon, { fontSize: 'small' })
                  ),
                  React.createElement(
                    'div',
                    { className: classes.orderActions },
                    React.createElement(
                      IconButton,
                      { 
                        size: 'small',
                        onClick: () => handleRemoveOrdering(orderItem.id),
                      },
                      React.createElement(DeleteIcon, { fontSize: 'small' })
                    )
                  )
                )),
                orderingOptions.length > 0 && React.createElement(
                  'div',
                  { style: { marginTop: '16px' } },
                  React.createElement(
                    Typography,
                    { variant: 'subtitle2', gutterBottom: true },
                    'SQL Preview:'
                  ),
                  React.createElement(
                    'div',
                    { className: classes.codeBlock },
                    'ORDER BY ' + orderingOptions.map(opt => 
                      `${opt.table}.${opt.column} ${opt.direction}`
                    ).join(', ')
                  )
                )
              )
            )
          ),
          
          // Display Group By Options
          React.createElement(
            Accordion,
            { 
              className: classes.accordionRoot,
              defaultExpanded: groupByOptions.length > 0,
            },
            React.createElement(
              AccordionSummary,
              { 
                expandIcon: React.createElement(ExpandMoreIcon),
                className: classes.accordionSummary,
              },
              React.createElement(
                Typography,
                { variant: 'subtitle1' },
                'Group By Options'
              ),
              groupByOptions.length > 0 && React.createElement(
                Chip,
                { 
                  label: groupByOptions.length,
                  size: 'small',
                  color: 'primary',
                  style: { marginLeft: '8px' },
                }
              )
            ),
            React.createElement(
              AccordionDetails,
              { style: { display: 'block' } },
              groupByOptions.length === 0 ? React.createElement(
                Typography,
                { variant: 'body2', color: 'textSecondary' },
                'No grouping options defined. Use the "Add Group By" button to add grouping criteria.'
              ) : React.createElement(
                'div',
                null,
                groupByOptions.map((groupItem) => React.createElement(
                  'div',
                  { key: groupItem.id, className: classes.groupItem },
                  React.createElement(
                    DragHandleIcon,
                    { className: classes.dragHandle }
                  ),
                  React.createElement(
                    'span',
                    { className: classes.columnName },
                    `${groupItem.table}.${groupItem.column}`
                  ),
                  groupItem.aggregateFunction && groupItem.aggregateColumn && React.createElement(
                    'span',
                    { className: classes.aggregateFunction },
                    `+ ${groupItem.aggregateFunction}(${groupItem.table}.${groupItem.aggregateColumn})`
                  ),
                  React.createElement(
                    'div',
                    { className: classes.orderActions },
                    React.createElement(
                      IconButton,
                      { 
                        size: 'small',
                        onClick: () => handleRemoveGroupBy(groupItem.id),
                      },
                      React.createElement(DeleteIcon, { fontSize: 'small' })
                    )
                  )
                )),
                groupByOptions.length > 0 && React.createElement(
                  'div',
                  { style: { marginTop: '16px' } },
                  React.createElement(
                    Typography,
                    { variant: 'subtitle2', gutterBottom: true },
                    'SQL Preview:'
                  ),
                  React.createElement(
                    'div',
                    { className: classes.codeBlock },
                    'GROUP BY ' + groupByOptions.map(opt => 
                      `${opt.table}.${opt.column}`
                    ).join(', ')
                  )
                )
              )
            )
          ),
          
          // Show full SQL preview with relationships, ordering and grouping
          relationships.length > 0 && React.createElement(
            Card,
            { className: classes.optionCard },
            React.createElement(
              CardContent,
              null,
              React.createElement(
                Typography,
                { variant: 'subtitle1', gutterBottom: true },
                'Complete SQL Query Preview'
              ),
              React.createElement(
                'div',
                { className: classes.codeBlock },
                generateSqlPreview(relationships[0], true)
              )
            )
          ),
          
          // Step navigation buttons
          React.createElement(
            'div',
            { className: classes.stepButton },
            React.createElement(
              Button,
              {
                onClick: handleBack,
                className: classes.button,
                style: { marginRight: '8px' }
              },
              'Back'
            ),
            React.createElement(
              Button,
              {
                variant: 'contained',
                color: 'primary',
                onClick: handleNext
              },
              'Continue to API Integration'
            )
          )
        )
      ),
      
      // Step 3: API Integration
      React.createElement(
        Step,
        { key: 'api-integration' },
        React.createElement(
          StepLabel,
          null,
          'API Integration'
        ),
        React.createElement(
          StepContent,
          null,
          React.createElement(
            'div',
            { className: classes.stepHeader },
            React.createElement(
              IntegrationInstructionsIcon,
              { className: classes.stepIcon }
            ),
            React.createElement(
              Typography,
              { variant: 'h6' },
              'API Integration & Lineage'
            )
          ),
          React.createElement(
            Typography,
            { variant: 'body2', color: 'textSecondary', paragraph: true },
            'Track API dependencies and manage API lineage to understand upstream data sources.'
          ),
          
          // API Lineage Controls
          React.createElement(
            Button,
            {
              variant: 'contained',
              color: 'primary',
              startIcon: React.createElement(TrackChangesIcon),
              onClick: () => handleOpenLineageDialog(),
              style: { marginBottom: '16px' }
            },
            'Register API Dependency'
          ),
          
          // API Lineage Container
          apiLineage.length === 0 ? React.createElement(
            Typography,
            { variant: 'body2', color: 'textSecondary' },
            'No API lineage registered yet. Use the "Register API Dependency" button to track upstream API dependencies.'
          ) : React.createElement(
            'div',
            null,
            apiLineage.map(lineage => React.createElement(
              Card,
              { key: lineage.id, className: classes.lineageCard },
              React.createElement(
                'div',
                { style: {
                  padding: '16px',
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }},
                React.createElement(
                  Typography,
                  { variant: 'h6', style: { margin: 0 } },
                  lineage.apiName
                ),
                React.createElement(
                  'div',
                  { className: classes.lineageActions },
                  React.createElement(
                    IconButton,
                    { 
                      size: 'small', 
                      onClick: () => handleOpenLineageDialog(lineage),
                      'aria-label': 'edit'
                    },
                    React.createElement(EditIcon, { fontSize: 'small' })
                  ),
                  React.createElement(
                    IconButton,
                    { 
                      size: 'small', 
                      onClick: () => handleDeleteLineage(lineage.id),
                      'aria-label': 'delete'
                    },
                    React.createElement(DeleteIcon, { fontSize: 'small' })
                  )
                )
              ),
              React.createElement(
                CardContent,
                null,
                lineage.apiEndpoint && React.createElement(
                  'div',
                  { className: classes.apiEndpointRow },
                  renderMethodButton(lineage.httpMethod || 'GET'),
                  React.createElement(
                    Typography,
                    { variant: 'body1' },
                    lineage.apiEndpoint
                  )
                ),
                lineage.description && React.createElement(
                  Typography,
                  { variant: 'body2', color: 'textSecondary', gutterBottom: true, style: { marginTop: '16px' } },
                  lineage.description
                ),
                React.createElement(
                  Typography,
                  { variant: 'subtitle2', gutterBottom: true, style: { marginTop: '16px' } },
                  'Upstream Dependencies:'
                ),
                lineage.upstreamApis.length > 0 ? lineage.upstreamApis.map((api, index) => 
                  React.createElement(
                    'div',
                    { key: index, className: classes.lineageFlow },
                    React.createElement(
                      'div',
                      { className: classes.upstreamApi },
                      api
                    ),
                    React.createElement(
                      ArrowForwardIcon,
                      { className: classes.lineageArrow }
                    ),
                    React.createElement(
                      'div',
                      { className: classes.currentApi },
                      lineage.apiName
                    )
                  )
                ) : React.createElement(
                  Typography,
                  { variant: 'body2', color: 'textSecondary' },
                  'No upstream APIs registered.'
                )
              )
            ))
          ),
          
          // Step navigation buttons
          React.createElement(
            'div',
            { className: classes.stepButton },
            React.createElement(
              Button,
              {
                onClick: handleBack,
                className: classes.button,
                style: { marginRight: '8px' }
              },
              'Back'
            ),
            React.createElement(
              Button,
              {
                variant: 'contained',
                color: 'primary',
                onClick: handleReset
              },
              'Finish & Reset'
            )
          )
        )
      )
    ),
    
    // The rest of the component (dialogs, etc.) remain the same
    // Relationship Dialog
    React.createElement(
      Dialog,
      {
        open: dialogOpen,
        onClose: handleCloseDialog,
        'aria-labelledby': 'relationship-dialog-title',
        maxWidth: 'md',
        fullWidth: true,
      },
      React.createElement(
        DialogTitle,
        { id: 'relationship-dialog-title' },
        'Define Table Relationship'
      ),
      React.createElement(
        DialogContent,
        null,
        React.createElement(
          'div',
          { className: classes.formSection },
          React.createElement(
            Typography,
            { variant: 'subtitle1', gutterBottom: true },
            'Basic Information'
          ),
          React.createElement(
            FormControl,
            { variant: 'outlined', fullWidth: true, margin: 'normal' },
            React.createElement(
              InputLabel,
              { id: 'source-table-label' },
              'Source Table'
            ),
            React.createElement(
              Select,
              {
                labelId: 'source-table-label',
                id: 'source-table',
                name: 'sourceTable',
                value: relationshipForm.sourceTable,
                onChange: handleRelationshipFormChange,
                label: 'Source Table',
              },
              selectedTables.map(table => React.createElement(
                MenuItem,
                { key: `source-${table}`, value: table },
                table
              ))
            )
          ),
          relationshipForm.sourceTable && React.createElement(
            FormControl,
            { variant: 'outlined', fullWidth: true, margin: 'normal' },
            React.createElement(
              InputLabel,
              { id: 'source-column-label' },
              'Source Column'
            ),
            React.createElement(
              Select,
              {
                labelId: 'source-column-label',
                id: 'source-column',
                name: 'sourceColumn',
                value: relationshipForm.sourceColumn,
                onChange: handleRelationshipFormChange,
                label: 'Source Column',
              },
              getColumnsForTable(relationshipForm.sourceTable).map(column => React.createElement(
                MenuItem,
                { key: `source-col-${column}`, value: column },
                column
              ))
            )
          ),
          React.createElement(
            FormControl,
            { variant: 'outlined', fullWidth: true, margin: 'normal' },
            React.createElement(
              InputLabel,
              { id: 'relationship-type-label' },
              'Relationship Type'
            ),
            React.createElement(
              Select,
              {
                labelId: 'relationship-type-label',
                id: 'relationship-type',
                name: 'relationshipType',
                value: relationshipForm.relationshipType,
                onChange: handleRelationshipFormChange,
                label: 'Relationship Type',
              },
              relationshipTypes.map(type => React.createElement(
                MenuItem,
                { key: type.value, value: type.value },
                type.label
              ))
            )
          ),
          relationshipForm.relationshipType && React.createElement(
            Typography,
            { variant: 'caption', color: 'textSecondary', style: { display: 'block', margin: '8px 0 16px' } },
            renderRelationshipDescription(relationshipForm.relationshipType)
          ),
          React.createElement(
            FormControl,
            { variant: 'outlined', fullWidth: true, margin: 'normal' },
            React.createElement(
              InputLabel,
              { id: 'target-table-label' },
              'Target Table'
            ),
            React.createElement(
              Select,
              {
                labelId: 'target-table-label',
                id: 'target-table',
                name: 'targetTable',
                value: relationshipForm.targetTable,
                onChange: handleRelationshipFormChange,
                label: 'Target Table',
              },
              selectedTables
                .filter(table => relationshipForm.relationshipType === 'SELF_REFERENCING' ? true : table !== relationshipForm.sourceTable)
                .map(table => React.createElement(
                  MenuItem,
                  { key: `target-${table}`, value: table },
                  table
                ))
            )
          ),
          relationshipForm.targetTable && React.createElement(
            FormControl,
            { variant: 'outlined', fullWidth: true, margin: 'normal' },
            React.createElement(
              InputLabel,
              { id: 'target-column-label' },
              'Target Column'
            ),
            React.createElement(
              Select,
              {
                labelId: 'target-column-label',
                id: 'target-column',
                name: 'targetColumn',
                value: relationshipForm.targetColumn,
                onChange: handleRelationshipFormChange,
                label: 'Target Column',
              },
              getColumnsForTable(relationshipForm.targetTable).map(column => React.createElement(
                MenuItem,
                { key: `target-col-${column}`, value: column },
                column
              ))
            )
          ),
          React.createElement(
            TextField,
            {
              variant: 'outlined',
              margin: 'normal',
              fullWidth: true,
              id: 'relationship-description',
              label: 'Description (Optional)',
              name: 'description',
              value: relationshipForm.description,
              onChange: handleRelationshipFormChange
            }
          ),
          React.createElement(
            FormControlLabel,
            {
              control: React.createElement(
                'input',
                {
                  type: 'checkbox',
                  checked: relationshipForm.isBidirectional,
                  onChange: (e) => setRelationshipForm({
                    ...relationshipForm,
                    isBidirectional: e.target.checked
                  })
                }
              ),
              label: '创建双向关系（同时创建反向关联）'
            }
          )
        ),
        
        React.createElement(
          'div',
          null,
          React.createElement(
            Button,
            {
              onClick: handleToggleAdvancedMode,
              color: 'primary',
              style: { marginTop: '16px' }
            },
            advancedMode ? '隐藏高级选项' : '显示高级选项'
          ),
          advancedMode && React.createElement(
            'div',
            { className: classes.advancedOptions },
            relationshipForm.relationshipType === 'MANY_TO_MANY' && React.createElement(
              'div',
              { className: classes.formSection },
              React.createElement(
                Typography,
                { variant: 'subtitle1', gutterBottom: true },
                'Many-to-Many Relationship Options'
              ),
              React.createElement(
                FormControlLabel,
                {
                  control: React.createElement(
                    'input',
                    {
                      type: 'checkbox',
                      checked: relationshipForm.useJoinTable,
                      onChange: (e) => setRelationshipForm({
                        ...relationshipForm,
                        useJoinTable: e.target.checked
                      })
                    }
                  ),
                  label: '指定中间表（Junction Table）'
                }
              ),
              relationshipForm.useJoinTable && React.createElement(
                React.Fragment,
                null,
                React.createElement(
                  FormControl,
                  { variant: 'outlined', fullWidth: true, margin: 'normal' },
                  React.createElement(
                    InputLabel,
                    { id: 'join-table-label' },
                    'Junction Table'
                  ),
                  React.createElement(
                    Select,
                    {
                      labelId: 'join-table-label',
                      id: 'join-table',
                      name: 'joinTable',
                      value: relationshipForm.joinTable,
                      onChange: handleRelationshipFormChange,
                      label: 'Junction Table',
                    },
                    availableTables.map(table => React.createElement(
                      MenuItem,
                      { key: `join-${table.name}`, value: table.name },
                      table.name
                    ))
                  )
                ),
                relationshipForm.joinTable && React.createElement(
                  React.Fragment,
                  null,
                  React.createElement(
                    FormControl,
                    { variant: 'outlined', fullWidth: true, margin: 'normal' },
                    React.createElement(
                      InputLabel,
                      { id: 'join-source-column-label' },
                      `${relationshipForm.joinTable} → ${relationshipForm.sourceTable} Column`
                    ),
                    React.createElement(
                      Select,
                      {
                        labelId: 'join-source-column-label',
                        id: 'join-source-column',
                        name: 'joinTableSourceColumn',
                        value: relationshipForm.joinTableSourceColumn,
                        onChange: handleRelationshipFormChange,
                        label: `${relationshipForm.joinTable} → ${relationshipForm.sourceTable} Column`,
                      },
                      getColumnsForTable(relationshipForm.joinTable).map(column => React.createElement(
                        MenuItem,
                        { key: `join-src-col-${column}`, value: column },
                        column
                      ))
                    )
                  ),
                  React.createElement(
                    FormControl,
                    { variant: 'outlined', fullWidth: true, margin: 'normal' },
                    React.createElement(
                      InputLabel,
                      { id: 'join-target-column-label' },
                      `${relationshipForm.joinTable} → ${relationshipForm.targetTable} Column`
                    ),
                    React.createElement(
                      Select,
                      {
                        labelId: 'join-target-column-label',
                        id: 'join-target-column',
                        name: 'joinTableTargetColumn',
                        value: relationshipForm.joinTableTargetColumn,
                        onChange: handleRelationshipFormChange,
                        label: `${relationshipForm.joinTable} → ${relationshipForm.targetTable} Column`,
                      },
                      getColumnsForTable(relationshipForm.joinTable).map(column => React.createElement(
                        MenuItem,
                        { key: `join-tgt-col-${column}`, value: column },
                        column
                      ))
                    )
                  )
                )
              )
            ),
            
            relationshipForm.relationshipType === 'CUSTOM_JOIN' && React.createElement(
              'div',
              { className: classes.formSection },
              React.createElement(
                Typography,
                { variant: 'subtitle1', gutterBottom: true },
                'Custom Join Options'
              ),
              React.createElement(
                FormControl,
                { variant: 'outlined', fullWidth: true, margin: 'normal' },
                React.createElement(
                  InputLabel,
                  { id: 'join-type-label' },
                  'Join Type'
                ),
                React.createElement(
                  Select,
                  {
                    labelId: 'join-type-label',
                    id: 'join-type',
                    name: 'joinType',
                    value: relationshipForm.joinType,
                    onChange: handleJoinTypeChange,
                    label: 'Join Type',
                  },
                  joinTypes.map(type => React.createElement(
                    MenuItem,
                    { key: type.value, value: type.value },
                    type.label
                  ))
                )
              ),
              relationshipForm.joinType && React.createElement(
                Typography,
                { variant: 'caption', color: 'textSecondary', style: { display: 'block', margin: '8px 0 16px' } },
                renderJoinTypeDescription(relationshipForm.joinType)
              ),
              React.createElement(
                TextField,
                {
                  variant: 'outlined',
                  margin: 'normal',
                  fullWidth: true,
                  id: 'custom-condition',
                  label: 'Custom JOIN Condition',
                  name: 'customCondition',
                  placeholder: `${relationshipForm.sourceTable}.column = ${relationshipForm.targetTable}.column OR other complex conditions`,
                  value: relationshipForm.customCondition,
                  onChange: handleRelationshipFormChange,
                  multiline: true,
                  rows: 3
                }
              )
            )
          )
        ),
        
        relationshipForm.sourceTable && relationshipForm.targetTable && (
          relationshipForm.relationshipType !== 'CUSTOM_JOIN' || 
          (relationshipForm.relationshipType === 'CUSTOM_JOIN' && relationshipForm.customCondition)
        ) && React.createElement(
          'div',
          { className: classes.sqlPreview },
          React.createElement(
            Typography,
            { variant: 'subtitle1', gutterBottom: true },
            'SQL Preview'
          ),
          React.createElement(
            'div',
            { className: classes.codeBlock },
            generateSqlPreview({
              sourceTable: relationshipForm.sourceTable,
              sourceColumn: relationshipForm.sourceColumn,
              relationshipType: relationshipForm.relationshipType,
              targetTable: relationshipForm.targetTable,
              targetColumn: relationshipForm.targetColumn,
              joinType: relationshipForm.joinType,
              customCondition: relationshipForm.customCondition,
              useJoinTable: relationshipForm.useJoinTable,
              joinTable: relationshipForm.joinTable,
              joinTableSourceColumn: relationshipForm.joinTableSourceColumn,
              joinTableTargetColumn: relationshipForm.joinTableTargetColumn
            })
          )
        )
      ),
      React.createElement(
        DialogActions,
        null,
        React.createElement(
          Button,
          { onClick: handleCloseDialog, color: 'default' },
          'Cancel'
        ),
        React.createElement(
          Button,
          {
            onClick: handleAddRelationship,
            color: 'primary',
            variant: 'contained',
            startIcon: React.createElement(AddIcon),
          },
          'Add Relationship'
        )
      )
    ),
    
    currentRelationship && React.createElement(
      Dialog,
      {
        open: relationshipDetailOpen,
        onClose: handleCloseRelationshipDetail,
        'aria-labelledby': 'relationship-detail-dialog-title',
        maxWidth: 'md',
        fullWidth: true,
      },
      React.createElement(
        DialogTitle,
        { id: 'relationship-detail-dialog-title' },
        'Relationship Details'
      ),
      React.createElement(
        DialogContent,
        null,
        React.createElement(
          Typography,
          { variant: 'h6', gutterBottom: true },
          currentRelationship.description || `${currentRelationship.sourceTable} → ${currentRelationship.targetTable} Relationship`
        ),
        React.createElement(
          'div',
          { className: classes.detailSection },
          React.createElement(
            Typography,
            { variant: 'subtitle1', gutterBottom: true },
            'Relationship Information'
          ),
          React.createElement(
            'div',
            { className: classes.detailItem },
            React.createElement(
              Typography,
              { variant: 'body2', component: 'span', className: classes.detailLabel },
              'Source Table:'
            ),
            React.createElement(
              Typography,
              { variant: 'body1', component: 'span' },
              currentRelationship.sourceTable
            )
          ),
          React.createElement(
            'div',
            { className: classes.detailItem },
            React.createElement(
              Typography,
              { variant: 'body2', component: 'span', className: classes.detailLabel },
              'Source Column:'
            ),
            React.createElement(
              Typography,
              { variant: 'body1', component: 'span' },
              currentRelationship.sourceColumn
            )
          ),
          React.createElement(
            'div',
            { className: classes.detailItem },
            React.createElement(
              Typography,
              { variant: 'body2', component: 'span', className: classes.detailLabel },
              'Relationship Type:'
            ),
            React.createElement(
              Chip,
              { 
                label: currentRelationship.relationshipType,
                className: classes.relationshipChip
              }
            )
          ),
          React.createElement(
            'div',
            { className: classes.detailItem },
            React.createElement(
              Typography,
              { variant: 'body2', component: 'span', className: classes.detailLabel },
              'Target Table:'
            ),
            React.createElement(
              Typography,
              { variant: 'body1', component: 'span' },
              currentRelationship.targetTable
            )
          ),
          React.createElement(
            'div',
            { className: classes.detailItem },
            React.createElement(
              Typography,
              { variant: 'body2', component: 'span', className: classes.detailLabel },
              'Target Column:'
            ),
            React.createElement(
              Typography,
              { variant: 'body1', component: 'span' },
              currentRelationship.targetColumn
            )
          ),
          currentRelationship.relationshipType === 'MANY_TO_MANY' && currentRelationship.useJoinTable && React.createElement(
            React.Fragment,
            null,
            React.createElement(
              'div',
              { className: classes.detailItem },
              React.createElement(
                Typography,
                { variant: 'body2', component: 'span', className: classes.detailLabel },
                'Join Table:'
              ),
              React.createElement(
                Typography,
                { variant: 'body1', component: 'span' },
                currentRelationship.joinTable
              )
            ),
            React.createElement(
              'div',
              { className: classes.detailItem },
              React.createElement(
                Typography,
                { variant: 'body2', component: 'span', className: classes.detailLabel },
                `${currentRelationship.joinTable} → ${currentRelationship.sourceTable} Column:`
              ),
              React.createElement(
                Typography,
                { variant: 'body1', component: 'span' },
                currentRelationship.joinTableSourceColumn
              )
            ),
            React.createElement(
              'div',
              { className: classes.detailItem },
              React.createElement(
                Typography,
                { variant: 'body2', component: 'span', className: classes.detailLabel },
                `${currentRelationship.joinTable} → ${currentRelationship.targetTable} Column:`
              ),
              React.createElement(
                Typography,
                { variant: 'body1', component: 'span' },
                currentRelationship.joinTableTargetColumn
              )
            )
          ),
          currentRelationship.relationshipType === 'CUSTOM_JOIN' && React.createElement(
            React.Fragment,
            null,
            React.createElement(
              'div',
              { className: classes.detailItem },
              React.createElement(
                Typography,
                { variant: 'body2', component: 'span', className: classes.detailLabel },
                'Join Type:'
              ),
              React.createElement(
                Typography,
                { variant: 'body1', component: 'span' },
                currentRelationship.joinType
              )
            ),
            React.createElement(
              'div',
              { className: classes.detailItem },
              React.createElement(
                Typography,
                { variant: 'body2', component: 'span', className: classes.detailLabel },
                'Custom Condition:'
              ),
              React.createElement(
                Typography,
                { variant: 'body1', component: 'span' },
                currentRelationship.customCondition || 'None'
              )
            )
          )
        ),
        React.createElement(
          'div',
          { className: classes.sqlPreviewSection },
          React.createElement(
            Typography,
            { variant: 'subtitle1', gutterBottom: true },
            'SQL Preview'
          ),
          React.createElement(
            'div',
            { className: classes.codeBlock },
            generateSqlPreview(currentRelationship)
          )
        )
      ),
      React.createElement(
        DialogActions,
        null,
        React.createElement(
          Button,
          { onClick: handleCloseRelationshipDetail, color: 'default' },
          'Close'
        ),
        React.createElement(
          Button,
          {
            color: 'primary',
            onClick: () => {
              handleCloseRelationshipDetail();
              setRelationshipForm({
                ...currentRelationship,
                description: currentRelationship.description || ''
              });
              setDialogOpen(true);
            }
          },
          'Edit'
        )
      )
    ),
    
    // Ordering Dialog
    React.createElement(
      Dialog,
      {
        open: orderingDialogOpen,
        onClose: handleCloseOrderingDialog,
        'aria-labelledby': 'ordering-dialog-title',
        maxWidth: 'sm',
        fullWidth: true,
      },
      React.createElement(
        DialogTitle,
        { id: 'ordering-dialog-title' },
        'Add Ordering Option'
      ),
      React.createElement(
        DialogContent,
        null,
        React.createElement(
          FormControl,
          { variant: 'outlined', fullWidth: true, margin: 'normal' },
          React.createElement(
            InputLabel,
            { id: 'ordering-table-label' },
            'Table'
          ),
          React.createElement(
            Select,
            {
              labelId: 'ordering-table-label',
              id: 'ordering-table',
              name: 'table',
              value: orderingForm.table,
              onChange: handleOrderingFormChange,
              label: 'Table',
            },
            selectedTables.map(table => React.createElement(
              MenuItem,
              { key: `order-table-${table}`, value: table },
              table
            ))
          )
        ),
        orderingForm.table && React.createElement(
          FormControl,
          { variant: 'outlined', fullWidth: true, margin: 'normal' },
          React.createElement(
            InputLabel,
            { id: 'ordering-column-label' },
            'Column'
          ),
          React.createElement(
            Select,
            {
              labelId: 'ordering-column-label',
              id: 'ordering-column',
              name: 'column',
              value: orderingForm.column,
              onChange: handleOrderingFormChange,
              label: 'Column',
            },
            getAvailableColumnsForOrdering().map(col => React.createElement(
              MenuItem,
              { key: `order-col-${col.table}-${col.column}`, value: col.column },
              col.display
            ))
          )
        ),
        React.createElement(
          FormControl,
          { component: 'fieldset', margin: 'normal' },
          React.createElement(
            Typography,
            { variant: 'subtitle2', gutterBottom: true },
            'Sort Direction'
          ),
          React.createElement(
            RadioGroup,
            {
              row: true,
              name: 'direction',
              value: orderingForm.direction,
              onChange: handleOrderingFormChange
            },
            React.createElement(
              FormControlLabel,
              {
                value: 'ASC',
                control: React.createElement(Radio),
                label: 'Ascending (A-Z, 1-9)'
              }
            ),
            React.createElement(
              FormControlLabel,
              {
                value: 'DESC',
                control: React.createElement(Radio),
                label: 'Descending (Z-A, 9-1)'
              }
            )
          )
        )
      ),
      React.createElement(
        DialogActions,
        null,
        React.createElement(
          Button,
          { onClick: handleCloseOrderingDialog, color: 'default' },
          'Cancel'
        ),
        React.createElement(
          Button,
          {
            onClick: handleAddOrdering,
            color: 'primary',
            variant: 'contained',
            disabled: !orderingForm.column || !orderingForm.table,
          },
          'Add'
        )
      )
    ),
    
    // Group By Dialog
    React.createElement(
      Dialog,
      {
        open: groupByDialogOpen,
        onClose: handleCloseGroupByDialog,
        'aria-labelledby': 'group-by-dialog-title',
        maxWidth: 'sm',
        fullWidth: true,
      },
      React.createElement(
        DialogTitle,
        { id: 'group-by-dialog-title' },
        'Add Group By Option'
      ),
      React.createElement(
        DialogContent,
        null,
        React.createElement(
          FormControl,
          { variant: 'outlined', fullWidth: true, margin: 'normal' },
          React.createElement(
            InputLabel,
            { id: 'group-table-label' },
            'Table'
          ),
          React.createElement(
            Select,
            {
              labelId: 'group-table-label',
              id: 'group-table',
              name: 'table',
              value: groupByForm.table,
              onChange: handleGroupByFormChange,
              label: 'Table',
            },
            selectedTables.map(table => React.createElement(
              MenuItem,
              { key: `group-table-${table}`, value: table },
              table
            ))
          )
        ),
        groupByForm.table && React.createElement(
          FormControl,
          { variant: 'outlined', fullWidth: true, margin: 'normal' },
          React.createElement(
            InputLabel,
            { id: 'group-column-label' },
            'Group By Column'
          ),
          React.createElement(
            Select,
            {
              labelId: 'group-column-label',
              id: 'group-column',
              name: 'column',
              value: groupByForm.column,
              onChange: handleGroupByFormChange,
              label: 'Group By Column',
            },
            getAvailableColumnsForGroupBy().map(col => React.createElement(
              MenuItem,
              { key: `group-col-${col.table}-${col.column}`, value: col.column },
              col.display
            ))
          )
        ),
        React.createElement(
          Typography,
          { 
            variant: 'subtitle2', 
            gutterBottom: true,
            style: { marginTop: '16px' }
          },
          'Aggregate Function (Optional)'
        ),
        React.createElement(
          FormControl,
          { variant: 'outlined', fullWidth: true, margin: 'normal' },
          React.createElement(
            InputLabel,
            { id: 'aggregate-function-label' },
            'Aggregate Function'
          ),
          React.createElement(
            Select,
            {
              labelId: 'aggregate-function-label',
              id: 'aggregate-function',
              name: 'aggregateFunction',
              value: groupByForm.aggregateFunction,
              onChange: handleGroupByFormChange,
              label: 'Aggregate Function',
            },
            aggregateFunctions.map(func => React.createElement(
              MenuItem,
              { key: `agg-func-${func.value}`, value: func.value },
              func.label
            ))
          )
        ),
        groupByForm.aggregateFunction && groupByForm.table && React.createElement(
          FormControl,
          { variant: 'outlined', fullWidth: true, margin: 'normal' },
          React.createElement(
            InputLabel,
            { id: 'aggregate-column-label' },
            'Aggregate Column'
          ),
          React.createElement(
            Select,
            {
              labelId: 'aggregate-column-label',
              id: 'aggregate-column',
              name: 'aggregateColumn',
              value: groupByForm.aggregateColumn,
              onChange: handleGroupByFormChange,
              label: 'Aggregate Column',
            },
            getAvailableColumnsForGroupBy().map(col => React.createElement(
              MenuItem,
              { key: `agg-col-${col.table}-${col.column}`, value: col.column },
              col.display
            ))
          )
        )
      ),
      React.createElement(
        DialogActions,
        null,
        React.createElement(
          Button,
          { onClick: handleCloseGroupByDialog, color: 'default' },
          'Cancel'
        ),
        React.createElement(
          Button,
          {
            onClick: handleAddGroupBy,
            color: 'primary',
            variant: 'contained',
            disabled: !groupByForm.column || !groupByForm.table,
          },
          'Add'
        )
      )
    ),
    
    // API Lineage Container
    React.createElement(
      'div',
      { className: classes.lineageContainer },
      React.createElement(
        'div',
        { className: classes.lineageHeader },
        React.createElement(
          Typography,
          { variant: 'h6', component: 'h3' },
          'API Lineage Tracking'
        ),
        React.createElement(
          Button,
          {
            variant: 'contained',
            color: 'primary',
            startIcon: React.createElement(TrackChangesIcon),
            onClick: () => handleOpenLineageDialog(),
          },
          'Register API Dependency'
        )
      ),
      
      apiLineage.length === 0 ? React.createElement(
        Typography,
        { variant: 'body2', color: 'textSecondary' },
        'No API lineage registered yet. Use the "Register API Dependency" button to track upstream API dependencies.'
      ) : React.createElement(
        'div',
        null,
        apiLineage.map(lineage => React.createElement(
          Card,
          { key: lineage.id, className: classes.lineageCard },
          React.createElement(
            'div',
            { style: {
              padding: '16px',
              borderBottom: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }},
            React.createElement(
              Typography,
              { variant: 'h6', style: { margin: 0 } },
              lineage.apiName
            ),
            React.createElement(
              'div',
              { className: classes.lineageActions },
              React.createElement(
                IconButton,
                { 
                  size: 'small', 
                  onClick: () => handleOpenLineageDialog(lineage),
                  'aria-label': 'edit'
                },
                React.createElement(EditIcon, { fontSize: 'small' })
              ),
              React.createElement(
                IconButton,
                { 
                  size: 'small', 
                  onClick: () => handleDeleteLineage(lineage.id),
                  'aria-label': 'delete'
                },
                React.createElement(DeleteIcon, { fontSize: 'small' })
              )
            )
          ),
          React.createElement(
            CardContent,
            null,
            lineage.apiEndpoint && React.createElement(
              'div',
              { className: classes.apiEndpointRow },
              renderMethodButton(lineage.httpMethod || 'GET'),
              React.createElement(
                Typography,
                { variant: 'body1' },
                lineage.apiEndpoint
              )
            ),
            lineage.description && React.createElement(
              Typography,
              { variant: 'body2', color: 'textSecondary', gutterBottom: true, style: { marginTop: '16px' } },
              lineage.description
            ),
            React.createElement(
              Typography,
              { variant: 'subtitle2', gutterBottom: true, style: { marginTop: '16px' } },
              'Upstream Dependencies:'
            ),
            lineage.upstreamApis.length > 0 ? lineage.upstreamApis.map((api, index) => 
              React.createElement(
                'div',
                { key: index, className: classes.lineageFlow },
                React.createElement(
                  'div',
                  { className: classes.upstreamApi },
                  api
                ),
                React.createElement(
                  ArrowForwardIcon,
                  { className: classes.lineageArrow }
                ),
                React.createElement(
                  'div',
                  { className: classes.currentApi },
                  lineage.apiName
                )
              )
            ) : React.createElement(
              Typography,
              { variant: 'body2', color: 'textSecondary' },
              'No upstream APIs registered.'
            )
          )
        ))
      )
    ),
    
    // API Lineage Dialog
    React.createElement(
      Dialog,
      {
        open: lineageDialogOpen,
        onClose: handleCloseLineageDialog,
        'aria-labelledby': 'lineage-dialog-title',
        maxWidth: 'md',
        fullWidth: true,
      },
      React.createElement(
        DialogTitle,
        { id: 'lineage-dialog-title' },
        currentLineage ? 'Edit API Lineage' : 'Register New API Lineage'
      ),
      React.createElement(
        DialogContent,
        null,
        React.createElement(
          'div',
          { style: { display: 'flex', alignItems: 'center', gap: '16px' } },
          React.createElement(
            TextField,
            {
              variant: 'outlined',
              margin: 'normal',
              fullWidth: true,
              id: 'api-name',
              label: 'API Name',
              name: 'apiName',
              value: lineageForm.apiName,
              onChange: handleLineageFormChange,
              required: true,
            }
          ),
          React.createElement(
            FormControl,
            { variant: 'outlined', className: classes.statusSelector, margin: 'normal' },
            React.createElement(
              InputLabel,
              { id: 'publication-status-label' },
              '发布状态'
            ),
            React.createElement(
              Select,
              {
                labelId: 'publication-status-label',
                id: 'publication-status',
                name: 'publicationStatus',
                value: lineageForm.publicationStatus,
                onChange: handleLineageFormChange,
                label: '发布状态',
              },
              publicationStatuses.map(status => React.createElement(
                MenuItem,
                { key: status.value, value: status.value },
                React.createElement(
                  'div',
                  { className: classes.statusMenuItem },
                  React.createElement(
                    'span',
                    {
                      className: classes.statusIndicator,
                      style: { backgroundColor: status.color }
                    }
                  ),
                  React.createElement(
                    Typography,
                    { variant: 'body2' },
                    status.label
                  )
                )
              ))
            )
          )
        ),
        // The rest remains the same
        React.createElement(
          Typography,
          { 
            variant: 'subtitle2', 
            gutterBottom: true,
            style: { marginTop: '16px' }
          },
          'API Endpoint'
        ),
        React.createElement(
          'div',
          { className: classes.apiEndpointRow },
          renderMethodSelect(lineageForm.httpMethod, handleLineageFormChange),
          React.createElement(
            TextField,
            {
              variant: 'outlined',
              fullWidth: true,
              id: 'api-endpoint',
              label: 'Endpoint URL',
              name: 'apiEndpoint',
              value: lineageForm.apiEndpoint,
              onChange: handleLineageFormChange,
              placeholder: 'https://api.openai.com/v1/fine_tuning/jobs',
              className: classes.endpointField,
            }
          )
        ),
        React.createElement(
          TextField,
          {
            variant: 'outlined',
            margin: 'normal',
            fullWidth: true,
            id: 'lineage-description',
            label: 'Description (Optional)',
            name: 'description',
            value: lineageForm.description,
            onChange: handleLineageFormChange,
            multiline: true,
            rows: 2,
          }
        ),
        React.createElement(
          Box,
          { mt: 3, mb: 2 },
          React.createElement(
            Typography,
            { variant: 'subtitle1', gutterBottom: true },
            'Upstream APIs'
          )
        ),
        React.createElement(
          Grid,
          { container: true, spacing: 2, alignItems: 'center' },
          React.createElement(
            Grid,
            { item: true, xs: 9 },
            React.createElement(
              TextField,
              {
                variant: 'outlined',
                fullWidth: true,
                id: 'upstream-api',
                label: 'Add Upstream API',
                name: 'upstreamApi',
                value: lineageForm.upstreamApi,
                onChange: handleLineageFormChange,
                placeholder: 'Enter upstream API name',
              }
            )
          ),
          React.createElement(
            Grid,
            { item: true, xs: 3 },
            React.createElement(
              Button,
              {
                variant: 'contained',
                color: 'primary',
                fullWidth: true,
                onClick: handleAddUpstreamApi,
              },
              'Add'
            )
          )
        ),
        React.createElement(
          Box,
          { mt: 2 },
          lineageForm.upstreamApis.length > 0 ? React.createElement(
            'div',
            { className: classes.selectedTables },
            lineageForm.upstreamApis.map((api, index) => React.createElement(
              Chip,
              {
                key: index,
                label: api,
                onDelete: () => handleRemoveUpstreamApi(api),
                className: classes.chip,
              }
            ))
          ) : React.createElement(
            Typography,
            { variant: 'body2', color: 'textSecondary' },
            'No upstream APIs added yet.'
          )
        )
      ),
      React.createElement(
        DialogActions,
        null,
        React.createElement(
          Button,
          { onClick: handleCloseLineageDialog, color: 'default' },
          'Cancel'
        ),
        React.createElement(
          Button,
          {
            onClick: handleSaveLineage,
            color: 'primary',
            variant: 'contained',
          },
          currentLineage ? 'Update' : 'Save'
        )
      )
    )
  );
};

TableRelationships.propTypes = {
  selectedConnection: PropTypes.object,
};

export default TableRelationships; 