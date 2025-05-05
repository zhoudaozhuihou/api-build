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
  IconButton
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

const IntegrationView = ({
  connection,
  tables,
  relationships,
  parameters,
  responseFields,
  sqlQuery
}) => {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const [configName, setConfigName] = useState('My API Configuration');
  const [configJson, setConfigJson] = useState('');
  const [apiEndpoint, setApiEndpoint] = useState('/api/v1/custom');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedApiType, setSelectedApiType] = useState(null);
  const [httpMethod, setHttpMethod] = useState('POST');
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle API type selection
  const handleApiTypeSelected = (category, url) => {
    setSelectedApiType(category);
    setApiEndpoint(url);
  };
  
  // Generate API config JSON
  const generateConfigJson = () => {
    // In a real app, this would include all the actual configurations
    const config = {
      name: configName,
      database: {
        connection: connection ? {
          type: connection.type,
          host: connection.host,
          port: connection.port,
          database: connection.database,
        } : null,
      },
      tables: tables || [],
      relationships: relationships || [],
      parameters: parameters || [],
      response: {
        fields: responseFields || [],
      },
      sql: sqlQuery || '',
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
  
  const handleMethodChange = (method) => {
    setHttpMethod(method);
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
              connection 
                ? `${connection.type} @ ${connection.host}:${connection.port}/${connection.database}`
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
                ? tables.join(', ')
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
              onClick: () => handleMethodChange(method),
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
    )
  );
};

IntegrationView.propTypes = {
  connection: PropTypes.object,
  tables: PropTypes.array,
  relationships: PropTypes.array,
  parameters: PropTypes.array,
  responseFields: PropTypes.array,
  sqlQuery: PropTypes.string
};

export default IntegrationView; 