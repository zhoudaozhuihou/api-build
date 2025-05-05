import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  Divider,
  Chip,
  IconButton,
  Switch,
  FormControlLabel,
  Box,
  Collapse,
  Tab,
  Tabs
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import SettingsIcon from '@material-ui/icons/Settings';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

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
  tableContainer: {
    marginTop: '24px',
    marginBottom: '24px',
  },
  paramTypeCell: {
    width: '150px',
  },
  validationCell: {
    width: '200px',
  },
  checkboxCell: {
    width: '80px',
    textAlign: 'center',
  },
  optionsCell: {
    display: 'flex',
    gap: '8px',
  },
  divider: {
    margin: '24px 0',
  },
  fieldGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '16px',
  },
  formControl: {
    minWidth: '200px',
    marginBottom: '16px',
  },
  chip: {
    margin: '4px',
  },
  selectedTable: {
    marginBottom: '16px',
  },
  tableSelect: {
    minWidth: '250px',
  },
  paramSection: {
    marginTop: '16px',
    marginBottom: '24px',
    padding: '16px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
  },
  switchContainer: {
    marginBottom: '16px',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  nestedRow: {
    backgroundColor: '#f5f5f5',
  },
  nestedTable: {
    marginLeft: '24px',
    width: 'calc(100% - 24px)',
  },
  childRow: {
    backgroundColor: '#edf7ff',
  },
  expandButton: {
    padding: '4px',
  },
  indent: {
    paddingLeft: '24px',
  },
  levelIndicator: {
    width: '16px',
    height: '16px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '3px',
    backgroundColor: '#1976d2',
    color: 'white',
    fontSize: '10px',
    marginRight: '8px',
  },
  tabsContainer: {
    marginBottom: '24px',
  },
  jsonDisplay: {
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    backgroundColor: '#f8f8f8',
    padding: '16px',
    borderRadius: '4px',
    border: '1px solid #e0e0e0',
    maxHeight: '300px',
    overflow: 'auto',
  },
  jsonTreeContainer: {
    position: 'relative',
    paddingLeft: '16px',
  },
  jsonTreeLine: {
    position: 'absolute',
    left: '8px',
    top: '0',
    width: '1px',
    height: '100%',
    backgroundColor: '#ccc',
  },
  jsonTreeBranch: {
    position: 'absolute',
    left: '8px',
    top: '50%',
    width: '8px',
    height: '1px',
    backgroundColor: '#ccc',
  },
  fieldPath: {
    display: 'flex',
    alignItems: 'center',
  },
  typeChip: {
    height: '24px',
    fontSize: '0.75rem',
    borderRadius: '4px',
    backgroundColor: '#e0e0e0',
    padding: '2px 8px',
    marginLeft: '8px',
  },
  objectType: {
    backgroundColor: '#bbdefb',
    color: '#1565c0',
  },
  arrayType: {
    backgroundColor: '#c8e6c9',
    color: '#2e7d32',
  },
  primitiveType: {
    backgroundColor: '#f5f5f5',
    color: '#424242',
  },
  fieldName: {
    fontWeight: 500,
  },
  arrayIndex: {
    color: '#1976d2',
    fontWeight: 'bold',
    marginRight: '4px',
  },
});

// Parameter types
const paramTypes = [
  { value: 'STRING', label: 'String' },
  { value: 'INTEGER', label: 'Integer' },
  { value: 'FLOAT', label: 'Float' },
  { value: 'BOOLEAN', label: 'Boolean' },
  { value: 'DATE', label: 'Date' },
  { value: 'DATETIME', label: 'Datetime' },
  { value: 'ARRAY', label: 'Array' },
  { value: 'OBJECT', label: 'Object' },
];

// Transform types
const transformTypes = [
  { value: null, label: 'None' },
  { value: 'UPPERCASE', label: 'UPPERCASE' },
  { value: 'LOWERCASE', label: 'lowercase' },
  { value: 'SUBSTRING', label: 'Substring' },
  { value: 'TRIM', label: 'Trim' },
  { value: 'FORMAT_DATE', label: 'Format Date' },
  { value: 'CONCAT', label: 'Concatenate' },
  { value: 'CUSTOM', label: 'Custom Expression' },
];

// Demo nested parameters for translation API
const demoNestedParams = {
  file: { 
    type: 'FILE', 
    required: true, 
    description: '要翻译的音频文件对象(不是文件名)。格式为flac、mp3、mp4、mpeg、mpga、m4a、ogg、wav或webm。' 
  },
  model: { 
    type: 'STRING', 
    required: true, 
    description: '要使用的模型ID，目前只有whisper-1是可用的。' 
  },
  prompt: { 
    type: 'STRING', 
    required: false, 
    description: '一个可选的文本，用于指导模型的风格或继续之前的音频对话。' 
  },
  response_format: { 
    type: 'STRING', 
    required: false, 
    description: '翻译结果的格式，可选值: json、text、srt、verbose_json、vtt。' 
  },
  temperature: { 
    type: 'NUMBER', 
    required: false, 
    description: '默认为0。采样温度介于0和1之间，更高的值如0.8会使输出更随机而较低的值0.2会使其更聚焦和确定性。如果设置为0，模型将使用对数概率自动提高温度直到达到特定阈值。' 
  }
};

// Demo nested response
const demoNestedResponse = {
  text: { 
    type: 'STRING', 
    include: true, 
    description: '翻译后的文本内容' 
  },
  metadata: {
    processing_time: { 
      type: 'FLOAT', 
      include: true, 
      description: '处理音频文件所需的时间（秒）' 
    },
    model_version: { 
      type: 'STRING', 
      include: true, 
      description: '使用的模型版本' 
    },
    audio_details: {
      duration: { 
        type: 'FLOAT', 
        include: true, 
        description: '音频文件的总时长（秒）' 
      },
      channels: { 
        type: 'INTEGER', 
        include: true, 
        description: '音频通道数量' 
      },
      sample_rate: { 
        type: 'INTEGER', 
        include: true, 
        description: '音频采样率' 
      }
    }
  },
  translation_stats: {
    word_count: { 
      type: 'INTEGER', 
      include: true, 
      description: '翻译文本的单词数量' 
    },
    character_count: { 
      type: 'INTEGER', 
      include: true, 
      description: '翻译文本的字符数量' 
    },
    confidence_score: { 
      type: 'FLOAT', 
      include: true, 
      description: '翻译结果的置信度（0-1之间）' 
    }
  }
};

const ParametersAndResponse = ({ tables, selectedTable, onParametersChange, onResponseFieldsChange }) => {
  const classes = useStyles();
  const [currentTable, setCurrentTable] = useState(selectedTable || '');
  const [tableFields, setTableFields] = useState([]);
  const [fieldParams, setFieldParams] = useState({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeEditField, setActiveEditField] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [expandedRows, setExpandedRows] = useState({});
  
  // For demo purposes, use the demo nested data
  const [requestParams, setRequestParams] = useState(demoNestedParams);
  const [responseFields, setResponseFields] = useState(demoNestedResponse);

  // Process tables to extract all fields with their table names
  useEffect(() => {
    if (tables && tables.length > 0) {
      if (!currentTable && tables[0]?.name) {
        setCurrentTable(tables[0].name);
      }

      // Extract all fields from the current table
      const selectedTableObj = tables.find(t => t.name === currentTable);
      if (selectedTableObj) {
        const fields = selectedTableObj.columns.map(column => ({
          id: `${currentTable}.${column}`,
          tableName: currentTable,
          columnName: column,
          dataType: getDataTypeForColumn(column),
          isRequest: false,
          isResponse: false,
          requestSettings: {
            paramName: column,
            type: mapColumnTypeToParamType(column),
            required: column.includes('id'),
            defaultValue: '',
            validations: {}
          },
          responseSettings: {
            include: true,
            alias: column,
            transform: null
          }
        }));
        setTableFields(fields);
        
        // Initialize field parameters
        const params = {};
        fields.forEach(field => {
          params[field.id] = {
            requestSettings: field.requestSettings,
            responseSettings: field.responseSettings
          };
        });
        setFieldParams(params);
      }
    }
  }, [tables, currentTable]);

  // Map columns to their likely data types based on name
  const getDataTypeForColumn = (column) => {
    if (column.includes('id')) return 'INTEGER';
    if (column.includes('date') || column.includes('created_at') || column.includes('updated_at')) return 'DATETIME';
    if (column.includes('count') || column.includes('amount') || column.includes('price')) return 'FLOAT';
    if (column.includes('is_') || column.includes('has_') || column === 'active' || column === 'enabled') return 'BOOLEAN';
    return 'STRING';
  };

  // Map column types to parameter types
  const mapColumnTypeToParamType = (column) => {
    const dataType = getDataTypeForColumn(column);
    switch (dataType) {
      case 'INTEGER': return 'INTEGER';
      case 'FLOAT': return 'FLOAT';
      case 'DATETIME': return 'DATETIME';
      case 'BOOLEAN': return 'BOOLEAN';
      default: return 'STRING';
    }
  };

  const handleTableChange = (e) => {
    setCurrentTable(e.target.value);
  };

  const handleCheckboxChange = (fieldId, type) => {
    setTableFields(prevFields => {
      return prevFields.map(field => {
        if (field.id === fieldId) {
          if (type === 'request') {
            return { ...field, isRequest: !field.isRequest };
          } else {
            return { ...field, isResponse: !field.isResponse };
          }
        }
        return field;
      });
    });
  };

  const handleFieldSettingChange = (fieldId, settingType, setting, value) => {
    setFieldParams(prev => {
      const updatedParams = { ...prev };
      updatedParams[fieldId] = {
        ...updatedParams[fieldId],
        [settingType]: {
          ...updatedParams[fieldId][settingType],
          [setting]: value
        }
      };
      return updatedParams;
    });
  };

  const handleEditField = (fieldId) => {
    setActiveEditField(fieldId);
  };

  const handleSaveField = () => {
    setActiveEditField(null);
    // Generate and pass parameters and response fields to parent
    updateParamsAndResponseFields();
  };
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const toggleExpandRow = (path) => {
    setExpandedRows(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };
  
  const isRowExpanded = (path) => {
    return !!expandedRows[path];
  };

  const updateParamsAndResponseFields = () => {
    // Extract request parameters
    const parameters = tableFields
      .filter(field => field.isRequest)
      .map(field => {
        const settings = fieldParams[field.id].requestSettings;
        return {
          id: field.id,
          name: settings.paramName,
          type: settings.type,
          required: settings.required,
          defaultValue: settings.defaultValue || null,
          validations: settings.validations || {},
          mappedTo: `${field.tableName}.${field.columnName}`
        };
      });
    
    // Extract response fields
    const respFields = tableFields
      .filter(field => field.isResponse)
      .map(field => {
        const settings = fieldParams[field.id].responseSettings;
        return {
          id: field.id,
          sourceField: `${field.tableName}.${field.columnName}`,
          alias: settings.alias || field.columnName,
          transform: settings.transform,
          include: settings.include
        };
      });
    
    // Notify parent components
    if (onParametersChange) {
      onParametersChange(parameters);
    }
    
    if (onResponseFieldsChange) {
      onResponseFieldsChange(respFields);
    }
  };

  const toggleAdvancedMode = () => {
    setShowAdvanced(!showAdvanced);
  };
  
  // Recursive function to render nested parameters in a hierarchical table
  const renderNestedParams = (params, path = '', level = 0, isLastChild = true, parentIsArray = false, arrayIndex = null) => {
    return Object.entries(params).map(([key, value], index, arr) => {
      const isLastItem = index === arr.length - 1;
      const currentPath = path ? `${path}.${key}` : key;
      const isObject = typeof value === 'object' && !value.type && !Array.isArray(value);
      const isArray = Array.isArray(value);
      const hasChildren = isObject || isArray;
      
      // Determine data type display text and style
      let typeText = isObject ? 'Object' : isArray ? 'Array' : value.type;
      let typeClassName = isObject ? classes.objectType : 
                         isArray ? classes.arrayType : classes.primitiveType;
      
      const displayKey = parentIsArray ? `[${arrayIndex}]${key ? '.' + key : ''}` : key;
      
      return React.createElement(
        React.Fragment,
        { key: currentPath },
        React.createElement(
          TableRow,
          { 
            className: level > 0 ? classes.childRow : '' 
          },
          React.createElement(
            TableCell,
            null,
            React.createElement(
              'div',
              { 
                className: classes.jsonTreeContainer,
                style: { marginLeft: `${level * 16}px` }
              },
              level > 0 && React.createElement(
                'div',
                { className: classes.jsonTreeLine,
                  style: { 
                    height: isLastItem && isLastChild ? '50%' : '100%',
                    top: isLastItem && isLastChild ? '0' : 'auto'
                  }
                }
              ),
              level > 0 && React.createElement(
                'div',
                { className: classes.jsonTreeBranch }
              ),
              React.createElement(
                'div',
                { className: classes.fieldPath },
                hasChildren && React.createElement(
                  IconButton,
                  { 
                    className: classes.expandButton,
                    onClick: () => toggleExpandRow(currentPath)
                  },
                  isRowExpanded(currentPath) 
                    ? React.createElement(ExpandLessIcon, { fontSize: 'small' })
                    : React.createElement(ExpandMoreIcon, { fontSize: 'small' })
                ),
                parentIsArray && React.createElement(
                  'span',
                  { className: classes.arrayIndex },
                  `[${arrayIndex}]`
                ),
                React.createElement(
                  'span',
                  { className: classes.fieldName },
                  parentIsArray && key ? `.${key}` : displayKey
                ),
                React.createElement(
                  'span',
                  { className: `${classes.typeChip} ${typeClassName}` },
                  typeText
                )
              )
            )
          ),
          React.createElement(
            TableCell,
            null,
            !isObject && !isArray && value.description ? value.description : '-'
          ),
          React.createElement(
            TableCell,
            { className: classes.checkboxCell },
            !isObject && !isArray && React.createElement(
              Checkbox,
              {
                checked: activeTab === 0 && (value.required || false),
                color: 'primary',
                disabled: activeTab !== 0
              }
            )
          ),
          React.createElement(
            TableCell,
            { className: classes.checkboxCell },
            !isObject && !isArray && React.createElement(
              Checkbox,
              {
                checked: activeTab === 1 && (value.include || false),
                color: 'primary',
                disabled: activeTab !== 1
              }
            )
          ),
          React.createElement(
            TableCell,
            null,
            !isObject && !isArray && React.createElement(
              IconButton,
              {
                size: 'small',
                color: 'primary'
              },
              React.createElement(SettingsIcon, { fontSize: 'small' })
            )
          )
        ),
        // Render children if expanded
        hasChildren && isRowExpanded(currentPath) && (
          isArray 
            ? value.map((item, idx) => 
                renderNestedParams(
                  item, 
                  `${currentPath}[${idx}]`, 
                  level + 1, 
                  idx === value.length - 1,
                  true,
                  idx
                )
              )
            : Object.entries(value).map(([childKey, childValue], childIndex, childArr) => 
                renderNestedParams(
                  { [childKey]: childValue }, 
                  `${currentPath}.${childKey}`, 
                  level + 1, 
                  childIndex === childArr.length - 1,
                  false
                )
              )
        )
      );
    });
  };

  const generateJsonPreview = (obj) => {
    return JSON.stringify(obj, null, 2);
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
        'API Parameters & Response'
      ),
      React.createElement(
        FormControlLabel,
        {
          control: React.createElement(
            Switch,
            {
              checked: showAdvanced,
              onChange: toggleAdvancedMode,
              color: 'primary'
            }
          ),
          label: 'Advanced Mode'
        }
      )
    ),
    
    // Tabs for Request/Response
    React.createElement(
      'div',
      { className: classes.tabsContainer },
      React.createElement(
        Tabs,
        {
          value: activeTab,
          onChange: handleTabChange,
          indicatorColor: 'primary',
          textColor: 'primary',
          variant: 'fullWidth'
        },
        React.createElement(Tab, { label: 'Request Parameters' }),
        React.createElement(Tab, { label: 'Response Fields' })
      )
    ),
    
    // Table selection
    React.createElement(
      'div',
      { className: classes.selectedTable },
      React.createElement(
        FormControl,
        { variant: 'outlined', className: classes.tableSelect },
        React.createElement(
          InputLabel,
          { id: 'table-select-label' },
          'Related Entity'
        ),
        React.createElement(
          Select,
          {
            labelId: 'table-select-label',
            id: 'table-select',
            value: currentTable,
            onChange: handleTableChange,
            label: 'Related Entity',
          },
          tables.map(table => React.createElement(
            MenuItem,
            { key: table.name, value: table.name },
            table.name
          ))
        )
      )
    ),
    
    // Description
    React.createElement(
      Typography,
      { variant: 'body1', paragraph: true },
      activeTab === 0 
        ? 'Configure request parameters with nested JSON structure. Check boxes to include fields in the request.'
        : 'Configure response fields with nested JSON structure. Check boxes to include fields in the response.'
    ),
    
    // Hierarchical Table
    React.createElement(
      TableContainer,
      { component: Paper, className: classes.tableContainer },
      React.createElement(
        Table,
        { size: 'small' },
        React.createElement(
          TableHead,
          null,
          React.createElement(
            TableRow,
            null,
            React.createElement(
              TableCell,
              { style: { width: '40%' } },
              'Field Path'
            ),
            React.createElement(
              TableCell,
              { style: { width: '25%' } },
              'Description'
            ),
            React.createElement(
              TableCell,
              { className: classes.checkboxCell },
              'Required'
            ),
            React.createElement(
              TableCell,
              { className: classes.checkboxCell },
              'Included'
            ),
            React.createElement(
              TableCell,
              { style: { width: '60px' } },
              'Actions'
            )
          )
        ),
        React.createElement(
          TableBody,
          null,
          activeTab === 0 
            ? renderNestedParams(requestParams)
            : renderNestedParams(responseFields)
        )
      )
    ),
    
    // JSON Preview
    showAdvanced && React.createElement(
      React.Fragment,
      null,
      React.createElement(
        Typography,
        { variant: 'h6', gutterBottom: true, style: { marginTop: '24px' } },
        activeTab === 0 ? 'Request JSON Structure' : 'Response JSON Structure'
      ),
      React.createElement(
        'div',
        { className: classes.jsonDisplay },
        activeTab === 0 
          ? generateJsonPreview(requestParams)
          : generateJsonPreview(responseFields)
      )
    ),
    
    // Apply button
    React.createElement(
      Button,
      {
        variant: 'contained',
        color: 'primary',
        onClick: updateParamsAndResponseFields,
        style: { marginTop: '16px' }
      },
      'Apply Configuration'
    ),
    
    // Add new parameter/field button
    React.createElement(
      Button,
      {
        variant: 'outlined',
        color: 'primary',
        startIcon: React.createElement(AddIcon),
        style: { marginTop: '16px', marginLeft: '8px' }
      },
      activeTab === 0 ? 'Add Parameter' : 'Add Response Field'
    )
  );
};

ParametersAndResponse.propTypes = {
  tables: PropTypes.array.isRequired,
  selectedTable: PropTypes.string,
  onParametersChange: PropTypes.func,
  onResponseFieldsChange: PropTypes.func,
};

export default ParametersAndResponse; 