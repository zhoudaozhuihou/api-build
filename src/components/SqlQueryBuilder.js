import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Box,
  Divider,
  Snackbar
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import TuneIcon from '@material-ui/icons/Tune';
import CodeIcon from '@material-ui/icons/Code';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { green, red, orange } from '@material-ui/core/colors';

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
  sqlEditor: {
    fontFamily: 'monospace',
    marginTop: '16px',
  },
  selectField: {
    marginBottom: '16px',
  },
  queryResultTable: {
    marginTop: '24px',
  },
  optimizationTip: {
    padding: '8px 16px',
    marginBottom: '8px',
    backgroundColor: '#fff3e0',
    borderLeft: `4px solid ${orange[700]}`,
    display: 'flex',
    alignItems: 'center',
  },
  optimizationIcon: {
    marginRight: '12px',
    color: orange[700],
  },
  fieldSelector: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '16px',
  },
  selectedField: {
    margin: '0 4px 4px 0',
  },
  validationSuccess: {
    color: green[700],
    display: 'flex',
    alignItems: 'center',
  },
  validationError: {
    color: red[700],
    display: 'flex',
    alignItems: 'center',
  },
  statusIcon: {
    marginRight: '8px',
  },
  formControl: {
    minWidth: '200px',
    marginBottom: '16px',
  },
  buttonGroup: {
    marginTop: '16px',
    display: 'flex',
    gap: '8px',
  },
  resultDetails: {
    padding: '16px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    marginTop: '16px',
  },
  divider: {
    margin: '16px 0',
  },
  conditionRow: {
    marginBottom: '16px',
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  orderByRow: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    marginBottom: '12px',
  },
});

// Helper function to generate SQL based on user selections
const generateSql = (selections) => {
  const { tables, selectedFields, whereConditions, groupBy, orderBy, limit } = selections;
  
  if (!tables.length || !selectedFields.length) {
    return '';
  }
  
  let sql = 'SELECT ';
  
  // Fields
  sql += selectedFields.map(field => `${field.table}.${field.name}`).join(', ');
  
  // Tables
  sql += '\nFROM ' + tables[0];
  
  // Joins (if multiple tables)
  if (tables.length > 1) {
    for (let i = 1; i < tables.length; i++) {
      // For demo purposes, we'll use simple joins based on table1_id = table2.id pattern
      // In a real app, you'd use the actual relationships defined by the user
      const leftTable = tables[i-1];
      const rightTable = tables[i];
      sql += `\nJOIN ${rightTable} ON ${leftTable}.${rightTable.slice(0, -1)}_id = ${rightTable}.id`;
    }
  }
  
  // Where conditions
  if (whereConditions.length > 0) {
    sql += '\nWHERE ';
    sql += whereConditions.map(condition => {
      let value = condition.value;
      if (typeof value === 'string' && !value.startsWith('(') && condition.operator !== 'IN') {
        value = `'${value}'`;
      }
      return `${condition.table}.${condition.field} ${condition.operator} ${value}`;
    }).join('\nAND ');
  }
  
  // Group By
  if (groupBy.length > 0) {
    sql += '\nGROUP BY ';
    sql += groupBy.map(group => `${group.table}.${group.field}`).join(', ');
  }
  
  // Order By
  if (orderBy.length > 0) {
    sql += '\nORDER BY ';
    sql += orderBy.map(order => `${order.table}.${order.field} ${order.direction}`).join(', ');
  }
  
  // Limit
  if (limit > 0) {
    sql += `\nLIMIT ${limit}`;
  }
  
  return sql;
};

const TabPanel = ({ children, value, index }) => {
  return value === index ? React.createElement('div', { className: 'py-4' }, children) : null;
};

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

const operators = [
  { value: '=', label: '=' },
  { value: '<>', label: '≠' },
  { value: '>', label: '>' },
  { value: '<', label: '<' },
  { value: '>=', label: '≥' },
  { value: '<=', label: '≤' },
  { value: 'LIKE', label: 'LIKE' },
  { value: 'IN', label: 'IN' },
  { value: 'BETWEEN', label: 'BETWEEN' },
  { value: 'IS NULL', label: 'IS NULL' },
  { value: 'IS NOT NULL', label: 'IS NOT NULL' },
];

// Mock data
const mockTables = [
  { name: 'users', columns: ['id', 'username', 'email', 'created_at'] },
  { name: 'posts', columns: ['id', 'user_id', 'title', 'content', 'created_at'] },
  { name: 'comments', columns: ['id', 'post_id', 'user_id', 'content', 'created_at'] },
];

const SqlQueryBuilder = ({ selectedConnection }) => {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const [availableTables, setAvailableTables] = useState([]);
  const [availableFields, setAvailableFields] = useState([]);
  const [customSql, setCustomSql] = useState('');
  const [queryResults, setQueryResults] = useState(null);
  const [queryStatus, setQueryStatus] = useState({ valid: false, message: '' });
  const [optimizationTips, setOptimizationTips] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Visual query builder state
  const [selections, setSelections] = useState({
    tables: [],
    selectedFields: [],
    whereConditions: [],
    groupBy: [],
    orderBy: [],
    limit: 100,
  });
  
  // Mock data for demo
  useEffect(() => {
    // In a real app, this would fetch from the database
    if (selectedConnection) {
      setAvailableTables(mockTables.map(t => t.name));
      
      // Flatten fields from all tables for easier selection
      const fields = mockTables.flatMap(table => 
        table.columns.map(column => ({
          name: column,
          table: table.name,
        }))
      );
      
      setAvailableFields(fields);
    }
  }, [selectedConnection]);
  
  // Generate SQL when selections change
  useEffect(() => {
    if (tabValue === 0) { // Only in visual builder mode
      const generatedSql = generateSql(selections);
      setCustomSql(generatedSql);
      
      // Basic validation
      if (generatedSql) {
        setQueryStatus({ valid: true, message: 'Query looks valid' });
      } else {
        setQueryStatus({ valid: false, message: 'Select at least one table and field' });
      }
    }
  }, [selections, tabValue]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleCustomSqlChange = (e) => {
    setCustomSql(e.target.value);
    // Basic validation
    if (e.target.value.trim()) {
      // This is a simplistic validation - in a real app, you'd parse and validate the SQL
      const hasSelect = e.target.value.toUpperCase().includes('SELECT');
      const hasFrom = e.target.value.toUpperCase().includes('FROM');
      
      if (hasSelect && hasFrom) {
        setQueryStatus({ valid: true, message: 'Query syntax looks valid' });
      } else {
        setQueryStatus({ valid: false, message: 'Invalid SQL query syntax' });
      }
    } else {
      setQueryStatus({ valid: false, message: '' });
    }
  };
  
  const handleAddTable = (e) => {
    const tableName = e.target.value;
    if (tableName && !selections.tables.includes(tableName)) {
      setSelections({
        ...selections,
        tables: [...selections.tables, tableName],
      });
    }
  };
  
  const handleRemoveTable = (tableName) => {
    setSelections({
      ...selections,
      tables: selections.tables.filter(t => t !== tableName),
      // Also remove fields from this table
      selectedFields: selections.selectedFields.filter(f => f.table !== tableName),
      whereConditions: selections.whereConditions.filter(c => c.table !== tableName),
      groupBy: selections.groupBy.filter(g => g.table !== tableName),
      orderBy: selections.orderBy.filter(o => o.table !== tableName),
    });
  };
  
  const handleAddField = (field) => {
    if (!selections.selectedFields.some(f => f.table === field.table && f.name === field.name)) {
      setSelections({
        ...selections,
        selectedFields: [...selections.selectedFields, field],
      });
    }
  };
  
  const handleRemoveField = (field) => {
    setSelections({
      ...selections,
      selectedFields: selections.selectedFields.filter(
        f => !(f.table === field.table && f.name === field.name)
      ),
    });
  };
  
  const handleAddCondition = () => {
    if (selections.tables.length === 0) {
      setSnackbarMessage('Please select at least one table first');
      setSnackbarOpen(true);
      return;
    }
    
    const newCondition = {
      table: selections.tables[0],
      field: mockTables.find(t => t.name === selections.tables[0]).columns[0],
      operator: '=',
      value: '',
    };
    
    setSelections({
      ...selections,
      whereConditions: [...selections.whereConditions, newCondition],
    });
  };
  
  const handleUpdateCondition = (index, field, value) => {
    const newConditions = [...selections.whereConditions];
    newConditions[index] = { ...newConditions[index], [field]: value };
    setSelections({
      ...selections,
      whereConditions: newConditions,
    });
  };
  
  const handleRemoveCondition = (index) => {
    setSelections({
      ...selections,
      whereConditions: selections.whereConditions.filter((_, i) => i !== index),
    });
  };
  
  const handleAddOrderBy = () => {
    if (selections.selectedFields.length === 0) {
      setSnackbarMessage('Please select at least one field first');
      setSnackbarOpen(true);
      return;
    }
    
    // Use the first selected field as default
    const field = selections.selectedFields[0];
    
    setSelections({
      ...selections,
      orderBy: [...selections.orderBy, {
        table: field.table,
        field: field.name,
        direction: 'ASC',
      }],
    });
  };
  
  const handleUpdateOrderBy = (index, field, value) => {
    const newOrderBy = [...selections.orderBy];
    newOrderBy[index] = { ...newOrderBy[index], [field]: value };
    setSelections({
      ...selections,
      orderBy: newOrderBy,
    });
  };
  
  const handleRemoveOrderBy = (index) => {
    setSelections({
      ...selections,
      orderBy: selections.orderBy.filter((_, i) => i !== index),
    });
  };
  
  const handleAddGroupBy = (field) => {
    if (!selections.groupBy.some(g => g.table === field.table && g.field === field.name)) {
      setSelections({
        ...selections,
        groupBy: [...selections.groupBy, { table: field.table, field: field.name }],
      });
    }
  };
  
  const handleRemoveGroupBy = (groupBy) => {
    setSelections({
      ...selections,
      groupBy: selections.groupBy.filter(
        g => !(g.table === groupBy.table && g.field === groupBy.field)
      ),
    });
  };
  
  const handleLimitChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setSelections({
      ...selections,
      limit: isNaN(value) ? 0 : value,
    });
  };
  
  const executeQuery = () => {
    // In a real app, this would send the SQL to the server
    // For demo, we'll generate mock data
    
    if (!queryStatus.valid) {
      setSnackbarMessage('Please fix query errors before executing');
      setSnackbarOpen(true);
      return;
    }
    
    // Generate mock data based on selected fields
    const fields = tabValue === 0 
      ? selections.selectedFields.map(f => `${f.table}.${f.name}`) 
      : ['id', 'name', 'value', 'created_at']; // Fallback for custom SQL
    
    const rows = [];
    for (let i = 1; i <= 10; i++) {
      const row = {};
      fields.forEach(field => {
        const fieldName = field.split('.').pop();
        if (fieldName.includes('id')) {
          row[field] = i;
        } else if (fieldName.includes('name') || fieldName.includes('title')) {
          row[field] = `Sample ${fieldName} ${i}`;
        } else if (fieldName.includes('email')) {
          row[field] = `user${i}@example.com`;
        } else if (fieldName.includes('content')) {
          row[field] = `This is sample content ${i}`;
        } else if (fieldName.includes('date') || fieldName.includes('created')) {
          row[field] = new Date().toISOString();
        } else {
          row[field] = `Value ${i}`;
        }
      });
      rows.push(row);
    }
    
    setQueryResults({
      fields,
      rows,
      executionTime: Math.floor(Math.random() * 100) + 10, // Mock execution time in ms
      rowsAffected: rows.length,
    });
    
    // Generate optimization tips
    const tips = [];
    
    // Check if there's a WHERE clause in visual builder or if custom SQL contains WHERE
    if ((tabValue === 0 && selections.whereConditions.length === 0) || 
        (tabValue === 1 && !customSql.toUpperCase().includes('WHERE'))) {
      tips.push('Consider adding a WHERE clause to limit the result set');
    }
    
    // Check for LIMIT in custom SQL
    if (tabValue === 1 && !customSql.toUpperCase().includes('LIMIT')) {
      tips.push('Add a LIMIT clause to prevent returning too many rows');
    }
    
    // Check for index use (simplified demo)
    if ((tabValue === 0 && selections.whereConditions.some(c => !c.field.includes('id'))) ||
        (tabValue === 1 && customSql.includes('WHERE') && !customSql.includes('.id'))) {
      tips.push('Consider using indexed columns in your WHERE clause for better performance');
    }
    
    setOptimizationTips(tips);
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
        'SQL Query Builder'
      ),
      React.createElement(
        Button,
        {
          variant: 'contained',
          color: 'primary',
          startIcon: React.createElement(PlayArrowIcon),
          onClick: executeQuery,
          disabled: !queryStatus.valid,
        },
        'Run Query'
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
      React.createElement(Tab, { label: 'Visual Builder' }),
      React.createElement(Tab, { label: 'SQL Editor' })
    ),
    
    // Visual Builder Tab
    React.createElement(
      TabPanel,
      { value: tabValue, index: 0 },
      React.createElement(
        Grid,
        { container: true, spacing: 3 },
        React.createElement(
          Grid,
          { item: true, xs: 12, md: 6 },
          React.createElement(
            Typography,
            { variant: 'h6', gutterBottom: true },
            'Tables'
          ),
          React.createElement(
            FormControl,
            { variant: 'outlined', className: classes.formControl },
            React.createElement(
              InputLabel,
              { id: 'table-select-label' },
              'Add Table'
            ),
            React.createElement(
              Select,
              {
                labelId: 'table-select-label',
                id: 'table-select',
                value: '',
                onChange: handleAddTable,
                label: 'Add Table',
              },
              availableTables
                .filter(table => !selections.tables.includes(table))
                .map(table => React.createElement(
                  MenuItem,
                  { key: table, value: table },
                  table
                ))
            )
          ),
          selections.tables.length > 0 && React.createElement(
            'div',
            { className: classes.fieldSelector },
            selections.tables.map(table => React.createElement(
              Chip,
              {
                key: table,
                label: table,
                onDelete: () => handleRemoveTable(table),
                className: classes.selectedField,
                color: 'primary',
              }
            ))
          )
        ),
        React.createElement(
          Grid,
          { item: true, xs: 12, md: 6 },
          React.createElement(
            Typography,
            { variant: 'h6', gutterBottom: true },
            'Fields'
          ),
          selections.tables.length > 0 ? React.createElement(
            'div',
            null,
            React.createElement(
              Typography,
              { variant: 'subtitle2', gutterBottom: true },
              'Available Fields'
            ),
            React.createElement(
              'div',
              { className: classes.fieldSelector },
              availableFields
                .filter(field => selections.tables.includes(field.table))
                .filter(field => !selections.selectedFields.some(
                  f => f.table === field.table && f.name === field.name
                ))
                .map((field, index) => React.createElement(
                  Chip,
                  {
                    key: `${field.table}.${field.name}-${index}`,
                    label: `${field.table}.${field.name}`,
                    onClick: () => handleAddField(field),
                    variant: 'outlined',
                    className: classes.selectedField,
                  }
                ))
            ),
            React.createElement(
              Typography,
              { variant: 'subtitle2', gutterBottom: true },
              'Selected Fields'
            ),
            selections.selectedFields.length > 0 ? React.createElement(
              'div',
              { className: classes.fieldSelector },
              selections.selectedFields.map((field, index) => React.createElement(
                Chip,
                {
                  key: `selected-${field.table}.${field.name}-${index}`,
                  label: `${field.table}.${field.name}`,
                  onDelete: () => handleRemoveField(field),
                  color: 'primary',
                  className: classes.selectedField,
                }
              ))
            ) : React.createElement(
              Typography,
              { variant: 'body2', color: 'textSecondary' },
              'No fields selected'
            )
          ) : React.createElement(
            Typography,
            { variant: 'body2', color: 'textSecondary' },
            'Please select at least one table first'
          )
        )
      ),
      
      React.createElement(Divider, { className: classes.divider }),
      
      // WHERE Section
      React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: classes.header },
          React.createElement(
            Typography,
            { variant: 'h6' },
            'WHERE Conditions'
          ),
          React.createElement(
            Button,
            {
              variant: 'outlined',
              color: 'primary',
              size: 'small',
              startIcon: React.createElement(AddIcon),
              onClick: handleAddCondition,
              disabled: selections.tables.length === 0,
            },
            'Add Condition'
          )
        ),
        selections.whereConditions.length > 0 ? React.createElement(
          'div',
          null,
          selections.whereConditions.map((condition, index) => React.createElement(
            'div',
            { key: index, className: classes.conditionRow },
            React.createElement(
              FormControl,
              { variant: 'outlined', style: { minWidth: '120px' } },
              React.createElement(
                InputLabel,
                { id: `table-label-${index}` },
                'Table'
              ),
              React.createElement(
                Select,
                {
                  labelId: `table-label-${index}`,
                  value: condition.table,
                  onChange: (e) => handleUpdateCondition(index, 'table', e.target.value),
                  label: 'Table',
                },
                selections.tables.map(table => React.createElement(
                  MenuItem,
                  { key: table, value: table },
                  table
                ))
              )
            ),
            React.createElement(
              FormControl,
              { variant: 'outlined', style: { minWidth: '120px' } },
              React.createElement(
                InputLabel,
                { id: `field-label-${index}` },
                'Field'
              ),
              React.createElement(
                Select,
                {
                  labelId: `field-label-${index}`,
                  value: condition.field,
                  onChange: (e) => handleUpdateCondition(index, 'field', e.target.value),
                  label: 'Field',
                },
                mockTables
                  .find(t => t.name === condition.table)?.columns
                  .map(column => React.createElement(
                    MenuItem,
                    { key: column, value: column },
                    column
                  ))
              )
            ),
            React.createElement(
              FormControl,
              { variant: 'outlined', style: { minWidth: '120px' } },
              React.createElement(
                InputLabel,
                { id: `operator-label-${index}` },
                'Operator'
              ),
              React.createElement(
                Select,
                {
                  labelId: `operator-label-${index}`,
                  value: condition.operator,
                  onChange: (e) => handleUpdateCondition(index, 'operator', e.target.value),
                  label: 'Operator',
                },
                operators.map(op => React.createElement(
                  MenuItem,
                  { key: op.value, value: op.value },
                  op.label
                ))
              )
            ),
            condition.operator !== 'IS NULL' && condition.operator !== 'IS NOT NULL' && React.createElement(
              TextField,
              {
                variant: 'outlined',
                label: 'Value',
                value: condition.value,
                onChange: (e) => handleUpdateCondition(index, 'value', e.target.value),
                style: { flexGrow: 1 },
              }
            ),
            React.createElement(
              IconButton,
              {
                color: 'secondary',
                onClick: () => handleRemoveCondition(index),
              },
              React.createElement(DeleteIcon)
            )
          ))
        ) : React.createElement(
          Typography,
          { variant: 'body2', color: 'textSecondary' },
          'No conditions defined'
        )
      ),
      
      React.createElement(Divider, { className: classes.divider }),
      
      // GROUP BY Section
      React.createElement(
        'div',
        null,
        React.createElement(
          Typography,
          { variant: 'h6', gutterBottom: true },
          'GROUP BY'
        ),
        selections.selectedFields.length > 0 ? React.createElement(
          'div',
          null,
          React.createElement(
            Typography,
            { variant: 'subtitle2', gutterBottom: true },
            'Available Fields'
          ),
          React.createElement(
            'div',
            { className: classes.fieldSelector },
            selections.selectedFields
              .filter(field => !selections.groupBy.some(
                g => g.table === field.table && g.field === field.name
              ))
              .map((field, index) => React.createElement(
                Chip,
                {
                  key: `group-available-${index}`,
                  label: `${field.table}.${field.name}`,
                  onClick: () => handleAddGroupBy(field),
                  variant: 'outlined',
                  className: classes.selectedField,
                }
              ))
          ),
          React.createElement(
            Typography,
            { variant: 'subtitle2', gutterBottom: true },
            'Grouped Fields'
          ),
          selections.groupBy.length > 0 ? React.createElement(
            'div',
            { className: classes.fieldSelector },
            selections.groupBy.map((group, index) => React.createElement(
              Chip,
              {
                key: `group-selected-${index}`,
                label: `${group.table}.${group.field}`,
                onDelete: () => handleRemoveGroupBy(group),
                color: 'primary',
                className: classes.selectedField,
              }
            ))
          ) : React.createElement(
            Typography,
            { variant: 'body2', color: 'textSecondary' },
            'No grouping applied'
          )
        ) : React.createElement(
          Typography,
          { variant: 'body2', color: 'textSecondary' },
          'Select fields first to enable grouping'
        )
      ),
      
      React.createElement(Divider, { className: classes.divider }),
      
      // ORDER BY Section
      React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: classes.header },
          React.createElement(
            Typography,
            { variant: 'h6' },
            'ORDER BY'
          ),
          React.createElement(
            Button,
            {
              variant: 'outlined',
              color: 'primary',
              size: 'small',
              startIcon: React.createElement(AddIcon),
              onClick: handleAddOrderBy,
              disabled: selections.selectedFields.length === 0,
            },
            'Add Ordering'
          )
        ),
        selections.orderBy.length > 0 ? React.createElement(
          'div',
          null,
          selections.orderBy.map((order, index) => React.createElement(
            'div',
            { key: index, className: classes.orderByRow },
            React.createElement(
              FormControl,
              { variant: 'outlined', style: { minWidth: '120px' } },
              React.createElement(
                InputLabel,
                { id: `order-table-label-${index}` },
                'Table'
              ),
              React.createElement(
                Select,
                {
                  labelId: `order-table-label-${index}`,
                  value: order.table,
                  onChange: (e) => handleUpdateOrderBy(index, 'table', e.target.value),
                  label: 'Table',
                },
                selections.tables.map(table => React.createElement(
                  MenuItem,
                  { key: table, value: table },
                  table
                ))
              )
            ),
            React.createElement(
              FormControl,
              { variant: 'outlined', style: { minWidth: '120px' } },
              React.createElement(
                InputLabel,
                { id: `order-field-label-${index}` },
                'Field'
              ),
              React.createElement(
                Select,
                {
                  labelId: `order-field-label-${index}`,
                  value: order.field,
                  onChange: (e) => handleUpdateOrderBy(index, 'field', e.target.value),
                  label: 'Field',
                },
                mockTables
                  .find(t => t.name === order.table)?.columns
                  .map(column => React.createElement(
                    MenuItem,
                    { key: column, value: column },
                    column
                  ))
              )
            ),
            React.createElement(
              FormControl,
              { variant: 'outlined', style: { minWidth: '120px' } },
              React.createElement(
                InputLabel,
                { id: `direction-label-${index}` },
                'Direction'
              ),
              React.createElement(
                Select,
                {
                  labelId: `direction-label-${index}`,
                  value: order.direction,
                  onChange: (e) => handleUpdateOrderBy(index, 'direction', e.target.value),
                  label: 'Direction',
                },
                React.createElement(
                  MenuItem,
                  { value: 'ASC' },
                  React.createElement(
                    'div',
                    { style: { display: 'flex', alignItems: 'center' } },
                    React.createElement(ArrowUpwardIcon, { fontSize: 'small', style: { marginRight: '8px' } }),
                    'Ascending'
                  )
                ),
                React.createElement(
                  MenuItem,
                  { value: 'DESC' },
                  React.createElement(
                    'div',
                    { style: { display: 'flex', alignItems: 'center' } },
                    React.createElement(ArrowDownwardIcon, { fontSize: 'small', style: { marginRight: '8px' } }),
                    'Descending'
                  )
                )
              )
            ),
            React.createElement(
              IconButton,
              {
                color: 'secondary',
                onClick: () => handleRemoveOrderBy(index),
              },
              React.createElement(DeleteIcon)
            )
          ))
        ) : React.createElement(
          Typography,
          { variant: 'body2', color: 'textSecondary' },
          'No ordering defined'
        )
      ),
      
      React.createElement(Divider, { className: classes.divider }),
      
      // LIMIT Section
      React.createElement(
        'div',
        null,
        React.createElement(
          Typography,
          { variant: 'h6', gutterBottom: true },
          'LIMIT'
        ),
        React.createElement(
          TextField,
          {
            type: 'number',
            label: 'Maximum rows',
            variant: 'outlined',
            value: selections.limit,
            onChange: handleLimitChange,
            InputProps: { inputProps: { min: 1 } },
            style: { width: '200px' },
          }
        )
      )
    ),
    
    // SQL Editor Tab
    React.createElement(
      TabPanel,
      { value: tabValue, index: 1 },
      React.createElement(
        TextField,
        {
          label: 'SQL Query',
          multiline: true,
          rows: 10,
          variant: 'outlined',
          fullWidth: true,
          value: customSql,
          onChange: handleCustomSqlChange,
          className: classes.sqlEditor,
        }
      )
    ),
    
    // Query Validation
    React.createElement(
      'div',
      { className: classes.resultDetails, style: { marginTop: '24px' } },
      React.createElement(
        Typography,
        { variant: 'subtitle1', gutterBottom: true },
        'Query Validation'
      ),
      queryStatus.valid ? React.createElement(
        'div',
        { className: classes.validationSuccess },
        React.createElement(CheckCircleIcon, { className: classes.statusIcon }),
        queryStatus.message
      ) : React.createElement(
        'div',
        { className: classes.validationError },
        React.createElement(ErrorIcon, { className: classes.statusIcon }),
        queryStatus.message || 'Enter a valid SQL query'
      )
    ),
    
    // Query Results
    queryResults && React.createElement(
      'div',
      { className: classes.queryResultTable },
      React.createElement(
        'div',
        { className: classes.header },
        React.createElement(
          Typography,
          { variant: 'h6' },
          'Query Results'
        ),
        React.createElement(
          'div',
          null,
          React.createElement(
            Chip,
            {
              label: `${queryResults.rowsAffected} rows`,
              color: 'primary',
              size: 'small',
              className: 'mr-2',
            }
          ),
          React.createElement(
            Chip,
            {
              label: `${queryResults.executionTime} ms`,
              variant: 'outlined',
              size: 'small',
            }
          )
        )
      ),
      React.createElement(
        TableContainer,
        { component: Paper },
        React.createElement(
          Table,
          { size: 'small' },
          React.createElement(
            TableHead,
            null,
            React.createElement(
              TableRow,
              null,
              queryResults.fields.map((field, index) => React.createElement(
                TableCell,
                { key: index },
                field
              ))
            )
          ),
          React.createElement(
            TableBody,
            null,
            queryResults.rows.map((row, rowIndex) => React.createElement(
              TableRow,
              { key: rowIndex },
              queryResults.fields.map((field, colIndex) => React.createElement(
                TableCell,
                { key: colIndex },
                row[field]
              ))
            ))
          )
        )
      ),
      
      // Optimization Tips
      optimizationTips.length > 0 && React.createElement(
        'div',
        { className: classes.resultDetails },
        React.createElement(
          'div',
          { className: classes.header },
          React.createElement(
            Typography,
            { variant: 'subtitle1' },
            'Query Optimization Tips'
          ),
          React.createElement(TuneIcon, { color: 'action' })
        ),
        optimizationTips.map((tip, index) => React.createElement(
          'div',
          { key: index, className: classes.optimizationTip },
          React.createElement(TuneIcon, { className: classes.optimizationIcon }),
          React.createElement(Typography, { variant: 'body2' }, tip)
        ))
      )
    ),
    
    // Snackbar for notifications
    React.createElement(
      Snackbar,
      {
        open: snackbarOpen,
        autoHideDuration: 4000,
        onClose: handleCloseSnackbar,
        message: snackbarMessage,
      }
    )
  );
};

SqlQueryBuilder.propTypes = {
  selectedConnection: PropTypes.object,
};

export default SqlQueryBuilder; 