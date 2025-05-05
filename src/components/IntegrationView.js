import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Paper,
  Typography,
  Button,
  Tabs,
  Tab,
  TextField,
  Box,
  Divider,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  Chip,
  Snackbar,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import GetAppIcon from '@material-ui/icons/GetApp';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import CloseIcon from '@material-ui/icons/Close';
import CodeIcon from '@material-ui/icons/Code';
import SettingsIcon from '@material-ui/icons/Settings';
import DescriptionIcon from '@material-ui/icons/Description';
import HttpIcon from '@material-ui/icons/Http';
import ApiTypeSelector from './ApiTypeSelector';
import ParametersAndResponse from './ParametersAndResponse';

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
  tabPanel: {
    padding: '16px 0',
  },
  configSummary: {
    marginBottom: '24px',
    backgroundColor: '#f5f5f5',
    padding: '16px',
    borderRadius: '4px',
  },
  summaryItem: {
    marginBottom: '8px',
  },
  configCard: {
    marginBottom: '16px',
  },
  buttonContainer: {
    display: 'flex',
    gap: '8px',
    marginTop: '16px',
  },
  codeBlock: {
    backgroundColor: '#f5f5f5',
    padding: '16px',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '14px',
    whiteSpace: 'pre-wrap',
    overflowX: 'auto',
    marginTop: '16px',
    marginBottom: '16px',
  },
  docSection: {
    backgroundColor: '#f5f5f5',
    padding: '16px',
    borderRadius: '4px',
    marginTop: '16px',
  },
  paramField: {
    marginBottom: '16px',
  },
  chip: {
    margin: '0 4px 4px 0',
  },
  methodChip: {
    minWidth: '80px',
    justifyContent: 'center',
  },
  jsonEditor: {
    fontFamily: 'monospace',
    fontSize: '14px',
  },
  saveConfigDialog: {
    padding: '16px',
  },
  divider: {
    margin: '24px 0',
  },
  apiTypeSelector: {
    marginBottom: '24px',
  },
  section: {
    marginBottom: '24px',
  },
  urlField: {
    marginTop: '16px',
    marginBottom: '24px',
  },
  formControl: {
    minWidth: '200px',
    marginBottom: '16px',
    marginRight: '16px',
  },
  statusChip: {
    backgroundColor: '#4caf50',
    color: 'white',
    fontWeight: 'bold',
  },
  endpointContainer: {
    backgroundColor: '#f5f5f5',
    padding: '16px',
    borderRadius: '4px',
    fontFamily: 'monospace',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    padding: '16px',
    borderRadius: '4px',
    marginBottom: '24px',
  },
  authenticationSection: {
    backgroundColor: '#f5f5f5',
    padding: '16px',
    borderRadius: '4px',
    marginBottom: '24px',
  },
  authKey: {
    fontFamily: 'monospace',
    fontWeight: 'bold',
    marginRight: '8px',
  },
  authValue: {
    fontFamily: 'monospace',
  },
  responseContainer: {
    backgroundColor: '#f9f9f9',
    padding: '16px',
    borderRadius: '4px',
    marginTop: '24px',
  },
  responseHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px',
  },
  contentTypeChip: {
    backgroundColor: '#3f51b5',
    color: 'white',
    marginLeft: '8px',
  }
});

const TabPanel = ({ children, value, index }) => {
  return value === index ? (
    <div className="py-4">
      {children}
    </div>
  ) : null;
};

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

// Demo tables for API integration configuration
const tables = [
  {
    name: 'translations',
    displayName: '音频翻译',
    description: '将音频文件翻译成文本',
    columns: [
      'file',
      'model',
      'prompt',
      'response_format',
      'temperature'
    ]
  }
];

// Demo nested parameters for translation API
const translationRequestParams = {
  file: { 
    type: 'FILE', 
    required: true, 
    description: '要翻译的音频文件对象(不是文件名)' 
  },
  model: { 
    type: 'STRING', 
    required: true, 
    description: '要使用的模型ID，目前只有whisper-1是可用的' 
  },
  prompt: { 
    type: 'STRING', 
    required: false, 
    description: '一个可选的文本，用于指导模型的风格或继续之前的音频对话' 
  },
  response_format: { 
    type: 'STRING', 
    required: false, 
    description: '翻译结果的格式，可选值: json, text, srt, verbose_json, vtt' 
  },
  temperature: { 
    type: 'NUMBER', 
    required: false, 
    description: '默认为0，采样温度介于0和1之间，更高的值如0.8会使输出更随机而较低的值0.2会使其更聚焦和确定性' 
  }
};

// Demo response fields
const translationResponseFields = {
  text: { 
    type: 'STRING', 
    include: true, 
    description: '翻译后的文本' 
  }
};

// 添加一个格式化嵌套JSON示例的函数
const formatNestedJsonExample = (obj, indent = 0) => {
  const indentation = '  '.repeat(indent);
  let result = '{\n';
  
  Object.entries(obj).forEach(([key, value], index, arr) => {
    const isLast = index === arr.length - 1;
    const comma = isLast ? '' : ',';
    
    if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
      // 处理嵌套对象
      result += `${indentation}  "${key}": ${formatNestedJsonExample(value, indent + 1)}${comma}\n`;
    } else if (Array.isArray(value)) {
      // 处理数组
      result += `${indentation}  "${key}": [\n`;
      value.forEach((item, i) => {
        const itemComma = i === value.length - 1 ? '' : ',';
        if (typeof item === 'object' && item !== null) {
          result += `${indentation}    ${formatNestedJsonExample(item, indent + 2)}${itemComma}\n`;
        } else {
          const itemValue = typeof item === 'string' ? `"${item}"` : item;
          result += `${indentation}    ${itemValue}${itemComma}\n`;
        }
      });
      result += `${indentation}  ]${comma}\n`;
    } else {
      // 处理基本类型
      const displayValue = typeof value === 'string' ? `"${value}"` : value;
      result += `${indentation}  "${key}": ${displayValue}${comma}\n`;
    }
  });
  
  result += `${indentation}}`;
  return result;
};

// 为OpenAI翻译API创建一个更丰富的嵌套响应示例
const sampleOpenAITranslationResponse = {
  text: '这是翻译后的文本内容示例。这可能是一段很长的文本，取决于输入的音频长度。',
  metadata: {
    processing_time: 0.8723,
    model_version: 'whisper-1-2023-10-15',
    audio_details: {
      duration: 12.5,
      channels: 2,
      sample_rate: 44100
    }
  },
  translation_stats: {
    word_count: 24,
    character_count: 42,
    confidence_score: 0.92
  }
};

const IntegrationView = ({ onSave }) => {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const [configName, setConfigName] = useState('My API Configuration');
  const [configJson, setConfigJson] = useState('');
  const [apiEndpoint, setApiEndpoint] = useState('https://api.openai.com/v1/audio/translations');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedApiType, setSelectedApiType] = useState(null);
  const [httpMethod, setHttpMethod] = useState('POST');
  const [requestFormat, setRequestFormat] = useState('multipart/form-data');
  const [responseFormat, setResponseFormat] = useState('application/json');
  const [selectedTable, setSelectedTable] = useState('translations');
  const [parameters, setParameters] = useState([]);
  const [responseFields, setResponseFields] = useState([]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleApiTypeSelected = (apiType, url) => {
    setSelectedApiType(apiType);
    setApiEndpoint(url);
  };
  
  const handleUrlChange = (e) => {
    setApiEndpoint(e.target.value);
  };
  
  const handleHttpMethodChange = (e) => {
    setHttpMethod(e.target.value);
  };
  
  const handleRequestFormatChange = (e) => {
    setRequestFormat(e.target.value);
  };
  
  const handleParametersChange = (params) => {
    setParameters(params);
  };
  
  const handleResponseFieldsChange = (fields) => {
    setResponseFields(fields);
  };
  
  const handleSaveIntegration = () => {
    // Create an integration configuration object
    const integrationConfig = {
      apiUrl: apiEndpoint,
      httpMethod,
      requestFormat,
      responseFormat,
      selectedTable,
      parameters,
      responseFields
    };
    
    // Notify parent component with the configuration
    if (onSave) {
      onSave(integrationConfig);
    }
  };
  
  // Generate API config JSON
  const generateConfigJson = () => {
    // In a real app, this would include all the actual configurations
    const config = {
      name: configName,
      database: {
        connection: selectedApiType ? {
          type: selectedApiType.type,
          host: selectedApiType.host,
          port: selectedApiType.port,
          database: selectedApiType.database,
        } : null,
      },
      tables: tables || [],
      relationships: [],
      parameters: parameters || [],
      response: {
        fields: responseFields || [],
      },
      sql: '',
      endpoint: apiEndpoint,
      method: httpMethod,
      apiType: selectedApiType ? selectedApiType.id : null
    };
    
    return JSON.stringify(config, null, 2);
  };
  
  // Export configuration
  const handleExportConfig = () => {
    const jsonContent = generateConfigJson();
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${configName.replace(/\s+/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setSnackbarMessage('Configuration exported successfully');
    setSnackbarOpen(true);
  };
  
  // Save configuration (in a real app, this would send to the server)
  const handleSaveConfig = () => {
    const jsonContent = generateConfigJson();
    setConfigJson(jsonContent); // In a real app, we'd send this to the API
    
    setSnackbarMessage('Configuration saved successfully');
    setSnackbarOpen(true);
  };
  
  // Copy docs to clipboard
  const handleCopyDocs = () => {
    const docsText = document.getElementById('api-docs-text').innerText;
    navigator.clipboard.writeText(docsText).then(() => {
      setSnackbarMessage('Documentation copied to clipboard');
      setSnackbarOpen(true);
    });
  };
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
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
        'API Integration'
      )
    ),
    
    React.createElement(
      TextField,
      {
        label: 'Configuration Name',
        value: configName,
        onChange: (e) => setConfigName(e.target.value),
        fullWidth: true,
        variant: 'outlined',
        margin: 'normal'
      }
    ),
    
    React.createElement(
      'div',
      { className: classes.configSummary },
      React.createElement(
        Typography,
        { variant: 'h6', gutterBottom: true },
        'Configuration Summary'
      ),
      React.createElement(
        Grid,
        { container: true, spacing: 2 },
        React.createElement(
          Grid,
          { item: true, xs: 12, sm: 6 },
          React.createElement(
            'div',
            { className: classes.summaryItem },
            React.createElement(
              Typography,
              { variant: 'subtitle2' },
              'Database'
            ),
            React.createElement(
              Typography,
              { variant: 'body2' },
              selectedApiType 
                ? `${selectedApiType.type} @ ${selectedApiType.host}:${selectedApiType.port}/${selectedApiType.database}`
                : 'Not configured'
            )
          ),
          React.createElement(
            'div',
            { className: classes.summaryItem },
            React.createElement(
              Typography,
              { variant: 'subtitle2' },
              'Tables'
            ),
            React.createElement(
              Typography,
              { variant: 'body2' },
              tables && tables.length > 0 
                ? tables.map(table => table.displayName).join(', ')
                : 'None selected'
            )
          )
        ),
        React.createElement(
          Grid,
          { item: true, xs: 12, sm: 6 },
          React.createElement(
            'div',
            { className: classes.summaryItem },
            React.createElement(
              Typography,
              { variant: 'subtitle2' },
              'Parameters'
            ),
            React.createElement(
              Typography,
              { variant: 'body2' },
              parameters && parameters.length > 0 
                ? `${parameters.length} parameter(s) configured`
                : 'No parameters'
            )
          ),
          React.createElement(
            'div',
            { className: classes.summaryItem },
            React.createElement(
              Typography,
              { variant: 'subtitle2' },
              'Response Fields'
            ),
            React.createElement(
              Typography,
              { variant: 'body2' },
              responseFields && responseFields.length > 0 
                ? `${responseFields.length} field(s) configured`
                : 'No response fields'
            )
          )
        )
      )
    ),
    
    React.createElement(
      Tabs,
      {
        value: tabValue,
        onChange: handleTabChange,
        indicatorColor: 'primary',
        textColor: 'primary',
      },
      React.createElement(
        Tab,
        { icon: React.createElement(DescriptionIcon), label: 'Documentation' }
      ),
      React.createElement(
        Tab,
        { icon: React.createElement(CodeIcon), label: 'Configuration' }
      )
    ),
    
    // Documentation Tab
    React.createElement(
      TabPanel,
      { value: tabValue, index: 0 },
      React.createElement(
        'div',
        { className: classes.apiTypeSelector },
        React.createElement(
          ApiTypeSelector,
          {
            onTypeSelected: handleApiTypeSelected,
            initialUrl: apiEndpoint
          }
        )
      ),
      React.createElement(
        'div',
        { className: classes.docSection },
        React.createElement(
          Typography,
          { variant: 'h6', gutterBottom: true },
          'HTTP Method'
        ),
        React.createElement(
          'div',
          null,
          ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map(method => React.createElement(
            Chip,
            {
              key: method,
              label: method,
              onClick: () => handleHttpMethodChange({ target: { value: method } }),
              color: httpMethod === method ? 'primary' : 'default',
              className: `${classes.chip} ${classes.methodChip}`,
            }
          ))
        )
      ),
      React.createElement(
        'div',
        { className: classes.docSection, id: 'api-docs-text' },
        React.createElement(
          Typography,
          { variant: 'h6', gutterBottom: true },
          'API Documentation'
        ),
        React.createElement(
          Typography,
          { variant: 'subtitle1', gutterBottom: true },
          `Endpoint: ${apiEndpoint}`
        ),
        React.createElement(
          Typography,
          { variant: 'subtitle1', gutterBottom: true },
          `Method: ${httpMethod}`
        ),
        parameters && parameters.length > 0 && React.createElement(
          React.Fragment,
          null,
          React.createElement(
            Typography,
            { variant: 'subtitle1', gutterBottom: true, style: { marginTop: '16px' } },
            'Request Parameters'
          ),
          React.createElement(
            'div',
            { className: classes.codeBlock },
            '{\n' +
              parameters.map(param => `  "${param.name}": ${param.type === 'STRING' ? '"value"' : 'value'} ${param.required ? '// required' : '// optional'}`).join(',\n') +
              '\n}'
          )
        ),
        responseFields && responseFields.length > 0 && React.createElement(
          React.Fragment,
          null,
          React.createElement(
            Typography,
            { variant: 'subtitle1', gutterBottom: true, style: { marginTop: '16px' } },
            'Response Format'
          ),
          React.createElement(
            'div',
            { className: classes.codeBlock },
            '{\n  "data": {\n' +
              responseFields.map(field => `    "${field.alias}": ${field.sourceField.includes('id') ? '1' : '"example"'}`).join(',\n') +
              '\n  },\n  "status": "success"\n}'
          )
        )
      ),
      React.createElement(
        'div',
        { className: classes.buttonContainer },
        React.createElement(
          Button,
          {
            variant: 'contained',
            color: 'primary',
            startIcon: React.createElement(FileCopyIcon),
            onClick: handleCopyDocs
          },
          'Copy Documentation'
        )
      )
    ),
    
    // Configuration Tab
    React.createElement(
      TabPanel,
      { value: tabValue, index: 1 },
      React.createElement(
        Typography,
        { variant: 'subtitle1', gutterBottom: true },
        'API Configuration JSON'
      ),
      React.createElement(
        'div',
        { className: classes.codeBlock },
        generateConfigJson()
      ),
      React.createElement(
        'div',
        { className: classes.buttonContainer },
        React.createElement(
          Button,
          {
            variant: 'contained',
            color: 'primary',
            startIcon: React.createElement(SaveIcon),
            onClick: handleSaveConfig,
            className: 'mr-2'
          },
          'Save Configuration'
        ),
        React.createElement(
          Button,
          {
            variant: 'outlined',
            color: 'primary',
            startIcon: React.createElement(GetAppIcon),
            onClick: handleExportConfig
          },
          'Export Configuration'
        )
      )
    ),
    
    React.createElement(
      Snackbar,
      {
        open: snackbarOpen,
        autoHideDuration: 3000,
        onClose: handleCloseSnackbar,
        message: snackbarMessage,
        action: React.createElement(
          IconButton,
          {
            size: 'small',
            color: 'inherit',
            onClick: handleCloseSnackbar
          },
          React.createElement(CloseIcon, { fontSize: 'small' })
        )
      }
    ),
    
    React.createElement(
      'div',
      { className: classes.section },
      React.createElement(
        Typography,
        { variant: 'h6', gutterBottom: true },
        'API 类型'
      ),
      React.createElement(
        ApiTypeSelector,
        { 
          onTypeSelected: handleApiTypeSelected,
          initialUrl: apiEndpoint
        }
      )
    ),
    
    React.createElement(
      'div',
      { className: classes.endpointContainer },
      React.createElement(
        Chip,
        { label: httpMethod, className: classes.methodChip }
      ),
      React.createElement(
        Typography,
        { variant: 'body1', component: 'span', style: { fontFamily: 'monospace' } },
        apiEndpoint
      )
    ),
    
    React.createElement(
      'div',
      { className: classes.authenticationSection },
      React.createElement(
        Typography,
        { variant: 'h6', gutterBottom: true },
        '请求参数'
      ),
      React.createElement(
        Typography,
        { variant: 'subtitle2', gutterBottom: true },
        'Authorization'
      ),
      React.createElement(
        Box,
        { display: 'flex', alignItems: 'center', mb: 2 },
        React.createElement(
          'span',
          { className: classes.authKey },
          'Authorization:'
        ),
        React.createElement(
          'span',
          { className: classes.authValue },
          'Bearer *******************'
        )
      ),
      React.createElement(
        Typography,
        { variant: 'subtitle2', gutterBottom: true },
        'Body 参数'
      ),
      React.createElement(
        Box,
        { display: 'flex', alignItems: 'center', mb: 1 },
        React.createElement(
          'span',
          { className: classes.authKey },
          'Content-Type:'
        ),
        React.createElement(
          'span',
          { className: classes.authValue },
          requestFormat
        )
      )
    ),
    
    React.createElement(
      ParametersAndResponse,
      {
        tables: tables,
        selectedTable: selectedTable,
        onParametersChange: handleParametersChange,
        onResponseFieldsChange: handleResponseFieldsChange
      }
    ),
    
    React.createElement(
      'div',
      { className: classes.responseContainer },
      React.createElement(
        'div',
        { className: classes.responseHeader },
        React.createElement(
          Chip,
          { label: '成功(200)', className: classes.statusChip }
        ),
        React.createElement(
          Typography,
          { variant: 'body1', component: 'span', style: { marginLeft: '12px' } },
          '内容格式:'
        ),
        React.createElement(
          Chip,
          { label: responseFormat, className: classes.contentTypeChip }
        )
      ),
      React.createElement(
        'div',
        { 
          style: { 
            backgroundColor: '#f5f5f5', 
            padding: '16px', 
            borderRadius: '4px',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            overflowX: 'auto'
          } 
        },
        formatNestedJsonExample(sampleOpenAITranslationResponse)
      )
    ),
    
    React.createElement(
      Box,
      { mt: 3, display: 'flex', justifyContent: 'flex-end' },
      React.createElement(
        Button,
        {
          variant: 'contained',
          color: 'primary',
          onClick: handleSaveIntegration
        },
        '保存集成'
      )
    )
  );
};

IntegrationView.propTypes = {
  onSave: PropTypes.func
};

export default IntegrationView; 