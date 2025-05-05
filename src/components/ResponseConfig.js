import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Checkbox,
  FormControlLabel,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  Grid
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import CodeIcon from '@material-ui/icons/Code';

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
    marginTop: '16px',
    marginBottom: '24px',
  },
  fieldCell: {
    display: 'flex',
    alignItems: 'center',
  },
  nestedField: {
    marginLeft: '24px',
    display: 'flex',
    alignItems: 'center',
  },
  actionButtons: {
    display: 'flex',
    gap: '8px',
  },
  transformationChip: {
    margin: '0 4px 4px 0',
    backgroundColor: '#e3f2fd',
  },
  preview: {
    padding: '16px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    marginTop: '24px',
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
  },
  previewTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  transformationSection: {
    marginTop: '16px',
  },
  divider: {
    margin: '16px 0',
  },
  formControl: {
    minWidth: '200px',
    marginBottom: '16px',
  },
});

const transformationTypes = [
  { value: 'format', label: 'Format' },
  { value: 'toUpperCase', label: 'To Upper Case' },
  { value: 'toLowerCase', label: 'To Lower Case' },
  { value: 'numberFormat', label: 'Number Format' },
  { value: 'dateFormat', label: 'Date Format' },
  { value: 'substring', label: 'Substring' },
  { value: 'custom', label: 'Custom Function' },
];

const ResponseConfig = ({ tables, selectedTable }) => {
  const classes = useStyles();
  const [responseFields, setResponseFields] = useState([]);
  const [availableFields, setAvailableFields] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [transformationDialogOpen, setTransformationDialogOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [currentField, setCurrentField] = useState({
    name: '',
    sourceField: '',
    alias: '',
    include: true,
    transformations: [],
    nested: false,
    parent: null,
  });
  const [currentTransformation, setCurrentTransformation] = useState({
    type: 'format',
    value: '',
  });

  // Get available fields from selected table in a real app
  useEffect(() => {
    if (tables && selectedTable) {
      const table = tables.find(t => t.name === selectedTable);
      if (table) {
        setAvailableFields(table.columns.map(column => ({
          name: column,
          table: selectedTable,
        })));
      }
    }
  }, [tables, selectedTable]);

  // Mock data for demo
  useEffect(() => {
    if (!tables || !selectedTable) {
      // Mock data for demo
      setAvailableFields([
        { name: 'id', table: 'users' },
        { name: 'username', table: 'users' },
        { name: 'email', table: 'users' },
        { name: 'created_at', table: 'users' },
        { name: 'posts', table: 'users', isRelationship: true },
      ]);
    }
  }, [tables, selectedTable]);

  const handleOpenDialog = (index = -1) => {
    if (index >= 0) {
      // Edit existing field
      setCurrentField(responseFields[index]);
      setEditIndex(index);
    } else {
      // Add new field
      setCurrentField({
        name: '',
        sourceField: '',
        alias: '',
        include: true,
        transformations: [],
        nested: false,
        parent: null,
      });
      setEditIndex(-1);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    const newValue = name === 'include' ? checked : value;
    setCurrentField(prev => ({ ...prev, [name]: newValue }));
    
    // Auto-fill alias with sourceField if it's empty
    if (name === 'sourceField' && !currentField.alias && !currentField.name) {
      setCurrentField(prev => ({ 
        ...prev, 
        alias: value.split('.').pop(),
        name: value,
      }));
    }
  };

  const handleNestedChange = (e) => {
    const { checked } = e.target;
    setCurrentField(prev => ({ ...prev, nested: checked }));
  };

  const handleSaveField = () => {
    if (!currentField.name) {
      alert('Field name is required');
      return;
    }

    const newResponseFields = [...responseFields];
    
    if (editIndex >= 0) {
      // Update existing field
      newResponseFields[editIndex] = currentField;
    } else {
      // Add new field
      newResponseFields.push(currentField);
    }
    
    setResponseFields(newResponseFields);
    handleCloseDialog();
  };

  const handleDeleteField = (index) => {
    // Also remove any child fields if this is a parent
    const parentField = responseFields[index];
    const newResponseFields = responseFields.filter((field, i) => {
      if (i === index) return false;
      if (parentField.nested && field.parent === parentField.name) return false;
      return true;
    });
    
    setResponseFields(newResponseFields);
  };

  const handleOpenTransformationDialog = () => {
    setCurrentTransformation({
      type: 'format',
      value: '',
    });
    setTransformationDialogOpen(true);
  };

  const handleCloseTransformationDialog = () => {
    setTransformationDialogOpen(false);
  };

  const handleTransformationChange = (e) => {
    const { name, value } = e.target;
    setCurrentTransformation(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTransformation = () => {
    if (!currentTransformation.value && currentTransformation.type !== 'toUpperCase' && currentTransformation.type !== 'toLowerCase') {
      alert('Transformation value is required');
      return;
    }
    
    const newTransformations = [...currentField.transformations, currentTransformation];
    setCurrentField(prev => ({ ...prev, transformations: newTransformations }));
    setTransformationDialogOpen(false);
  };

  const handleRemoveTransformation = (index) => {
    const newTransformations = currentField.transformations.filter((_, i) => i !== index);
    setCurrentField(prev => ({ ...prev, transformations: newTransformations }));
  };

  const generateResponsePreview = () => {
    if (responseFields.length === 0) {
      return '{}';
    }

    // Build a response structure
    const response = {};
    
    responseFields.forEach(field => {
      if (!field.include) return;
      
      const fieldName = field.alias || field.name.split('.').pop();
      
      if (field.nested) {
        // This is a parent object
        response[fieldName] = {};
      } else if (field.parent) {
        // This is a child field
        const parentField = responseFields.find(f => f.name === field.parent);
        if (parentField) {
          const parentName = parentField.alias || parentField.name.split('.').pop();
          if (!response[parentName]) {
            response[parentName] = {};
          }
          response[parentName][fieldName] = getExampleValue(field);
        }
      } else {
        // Regular field
        response[fieldName] = getExampleValue(field);
      }
    });
    
    return JSON.stringify(response, null, 2);
  };

  const getExampleValue = (field) => {
    const fieldName = field.name.toLowerCase();
    
    // Apply transformations if any
    let value = fieldName.includes('id') ? 1 :
               fieldName.includes('name') ? 'John Doe' :
               fieldName.includes('email') ? 'john@example.com' :
               fieldName.includes('date') || fieldName.includes('created') ? '2023-05-04T12:00:00Z' :
               fieldName.includes('count') ? 42 :
               fieldName.includes('price') ? 99.99 :
               fieldName.includes('active') ? true :
               'Sample Value';
               
    // Apply transformations
    field.transformations.forEach(transform => {
      if (transform.type === 'toUpperCase' && typeof value === 'string') {
        value = value.toUpperCase();
      } else if (transform.type === 'toLowerCase' && typeof value === 'string') {
        value = value.toLowerCase();
      } else if (transform.type === 'dateFormat' && (typeof value === 'string' && value.includes('T'))) {
        // Simple date format transformation
        value = value.split('T')[0];
      }
      // Other transformations would be applied here
    });
    
    return value;
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
        'Response Configuration'
      ),
      React.createElement(
        Button,
        {
          variant: 'contained',
          color: 'primary',
          startIcon: React.createElement(AddIcon),
          onClick: () => handleOpenDialog(),
        },
        'Add Response Field'
      )
    ),
    
    // Response fields table
    responseFields.length === 0 ? React.createElement(
      Typography,
      { variant: 'body2', color: 'textSecondary' },
      'No response fields configured yet. Click "Add Response Field" to define your API response structure.'
    ) : React.createElement(
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
            React.createElement(TableCell, null, 'Include'),
            React.createElement(TableCell, null, 'Field Name'),
            React.createElement(TableCell, null, 'Source Field'),
            React.createElement(TableCell, null, 'Alias'),
            React.createElement(TableCell, null, 'Transformations'),
            React.createElement(TableCell, null, 'Actions')
          )
        ),
        React.createElement(
          TableBody,
          null,
          responseFields.map((field, index) => React.createElement(
            TableRow,
            { key: index },
            React.createElement(
              TableCell,
              null,
              React.createElement(
                Checkbox,
                {
                  checked: field.include,
                  color: 'primary',
                  disabled: true,
                }
              )
            ),
            React.createElement(
              TableCell,
              null,
              field.parent ? React.createElement(
                'div',
                { className: classes.nestedField },
                React.createElement(ArrowRightIcon, { fontSize: 'small' }),
                field.name.split('.').pop()
              ) : React.createElement(
                'div',
                { className: classes.fieldCell },
                field.name.split('.').pop(),
                field.nested && React.createElement(
                  Chip,
                  { 
                    size: 'small',
                    label: 'Object',
                    className: 'ml-2',
                    variant: 'outlined',
                  }
                )
              )
            ),
            React.createElement(
              TableCell,
              null,
              field.sourceField || '-'
            ),
            React.createElement(
              TableCell,
              null,
              field.alias || '-'
            ),
            React.createElement(
              TableCell,
              null,
              field.transformations.length > 0 ? React.createElement(
                'div',
                { className: 'flex flex-wrap' },
                field.transformations.map((transform, tIndex) => React.createElement(
                  Chip,
                  {
                    key: tIndex,
                    label: `${transform.type}${transform.value ? `: ${transform.value}` : ''}`,
                    size: 'small',
                    className: classes.transformationChip,
                  }
                ))
              ) : '-'
            ),
            React.createElement(
              TableCell,
              null,
              React.createElement(
                'div',
                { className: classes.actionButtons },
                React.createElement(
                  IconButton,
                  {
                    size: 'small',
                    onClick: () => handleOpenDialog(index),
                    color: 'primary',
                  },
                  React.createElement(EditIcon)
                ),
                React.createElement(
                  IconButton,
                  {
                    size: 'small',
                    onClick: () => handleDeleteField(index),
                    color: 'secondary',
                  },
                  React.createElement(DeleteIcon)
                )
              )
            )
          ))
        )
      )
    ),
    
    // Response Preview
    responseFields.length > 0 && React.createElement(
      'div',
      { className: classes.preview },
      React.createElement(
        'div',
        { className: classes.previewTitle },
        React.createElement(
          Typography,
          { variant: 'h6', component: 'h3' },
          'Response Preview'
        ),
        React.createElement(
          CodeIcon,
          { color: 'action' }
        )
      ),
      React.createElement(
        'pre',
        null,
        generateResponsePreview()
      )
    ),
    
    // Field Dialog
    React.createElement(
      Dialog,
      {
        open: dialogOpen,
        onClose: handleCloseDialog,
        maxWidth: 'md',
        fullWidth: true,
      },
      React.createElement(
        DialogTitle,
        null,
        editIndex >= 0 ? 'Edit Response Field' : 'Add Response Field'
      ),
      React.createElement(
        DialogContent,
        null,
        React.createElement(
          Grid,
          { container: true, spacing: 2 },
          React.createElement(
            Grid,
            { item: true, xs: 12, sm: 6 },
            React.createElement(
              FormControl,
              { variant: 'outlined', fullWidth: true, margin: 'normal' },
              React.createElement(
                InputLabel,
                { id: 'source-field-label' },
                'Source Field'
              ),
              React.createElement(
                Select,
                {
                  labelId: 'source-field-label',
                  id: 'source-field',
                  name: 'sourceField',
                  value: currentField.sourceField,
                  onChange: handleInputChange,
                  label: 'Source Field',
                  disabled: currentField.nested,
                },
                React.createElement(
                  MenuItem,
                  { value: '' },
                  '<None>'
                ),
                availableFields.map(field => React.createElement(
                  MenuItem,
                  { key: `${field.table}.${field.name}`, value: `${field.table}.${field.name}` },
                  `${field.table}.${field.name}`
                ))
              )
            )
          ),
          React.createElement(
            Grid,
            { item: true, xs: 12, sm: 6 },
            React.createElement(
              TextField,
              {
                name: 'name',
                label: 'Field Name',
                value: currentField.name,
                onChange: handleInputChange,
                fullWidth: true,
                margin: 'normal',
                variant: 'outlined',
                required: true,
              }
            )
          ),
          React.createElement(
            Grid,
            { item: true, xs: 12, sm: 6 },
            React.createElement(
              TextField,
              {
                name: 'alias',
                label: 'Field Alias (optional)',
                value: currentField.alias,
                onChange: handleInputChange,
                fullWidth: true,
                margin: 'normal',
                variant: 'outlined',
                helperText: 'Leave empty to use the original field name',
              }
            )
          ),
          React.createElement(
            Grid,
            { item: true, xs: 12, sm: 6 },
            React.createElement(
              FormControl,
              { fullWidth: true, margin: 'normal' },
              React.createElement(
                FormControlLabel,
                {
                  control: React.createElement(
                    Checkbox,
                    {
                      checked: currentField.include,
                      onChange: handleInputChange,
                      name: 'include',
                      color: 'primary',
                    }
                  ),
                  label: 'Include in response',
                }
              )
            )
          ),
          React.createElement(
            Grid,
            { item: true, xs: 12 },
            React.createElement(
              FormControl,
              { fullWidth: true, margin: 'normal' },
              React.createElement(
                FormControlLabel,
                {
                  control: React.createElement(
                    Checkbox,
                    {
                      checked: currentField.nested,
                      onChange: handleNestedChange,
                      name: 'nested',
                      color: 'primary',
                    }
                  ),
                  label: 'This is a nested object',
                }
              )
            )
          ),
          !currentField.nested && !currentField.parent && availableFields.some(f => f.isRelationship) && React.createElement(
            Grid,
            { item: true, xs: 12 },
            React.createElement(
              FormControl,
              { variant: 'outlined', fullWidth: true, margin: 'normal' },
              React.createElement(
                InputLabel,
                { id: 'parent-field-label' },
                'Parent Object (for nested fields)'
              ),
              React.createElement(
                Select,
                {
                  labelId: 'parent-field-label',
                  id: 'parent-field',
                  name: 'parent',
                  value: currentField.parent || '',
                  onChange: handleInputChange,
                  label: 'Parent Object (for nested fields)',
                },
                React.createElement(
                  MenuItem,
                  { value: '' },
                  '<None>'
                ),
                responseFields
                  .filter(field => field.nested)
                  .map(field => React.createElement(
                    MenuItem,
                    { key: field.name, value: field.name },
                    field.alias || field.name
                  ))
              )
            )
          )
        ),
        
        !currentField.nested && React.createElement(
          'div',
          { className: classes.transformationSection },
          React.createElement(
            Divider,
            { className: classes.divider }
          ),
          React.createElement(
            'div',
            { className: classes.header },
            React.createElement(
              Typography,
              { variant: 'h6', component: 'h3' },
              'Field Transformations'
            ),
            React.createElement(
              Button,
              {
                variant: 'outlined',
                color: 'primary',
                startIcon: React.createElement(AddIcon),
                onClick: handleOpenTransformationDialog,
                size: 'small',
              },
              'Add Transformation'
            )
          ),
          currentField.transformations.length === 0 ? React.createElement(
            Typography,
            { variant: 'body2', color: 'textSecondary' },
            'No transformations defined yet.'
          ) : React.createElement(
            'div',
            { className: 'flex flex-wrap' },
            currentField.transformations.map((transform, index) => React.createElement(
              Chip,
              {
                key: index,
                label: `${transform.type}${transform.value ? `: ${transform.value}` : ''}`,
                onDelete: () => handleRemoveTransformation(index),
                className: classes.transformationChip,
                style: { margin: '0 8px 8px 0' },
              }
            ))
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
            onClick: handleSaveField,
            color: 'primary',
            variant: 'contained',
          },
          'Save Field'
        )
      )
    ),
    
    // Transformation Dialog
    React.createElement(
      Dialog,
      {
        open: transformationDialogOpen,
        onClose: handleCloseTransformationDialog,
        maxWidth: 'sm',
        fullWidth: true,
      },
      React.createElement(
        DialogTitle,
        null,
        'Add Field Transformation'
      ),
      React.createElement(
        DialogContent,
        null,
        React.createElement(
          FormControl,
          { variant: 'outlined', fullWidth: true, margin: 'normal' },
          React.createElement(
            InputLabel,
            { id: 'transformation-type-label' },
            'Transformation Type'
          ),
          React.createElement(
            Select,
            {
              labelId: 'transformation-type-label',
              id: 'transformation-type',
              name: 'type',
              value: currentTransformation.type,
              onChange: handleTransformationChange,
              label: 'Transformation Type',
            },
            transformationTypes.map(type => React.createElement(
              MenuItem,
              { key: type.value, value: type.value },
              type.label
            ))
          )
        ),
        (currentTransformation.type !== 'toUpperCase' && currentTransformation.type !== 'toLowerCase') && React.createElement(
          TextField,
          {
            name: 'value',
            label: 'Transformation Value',
            value: currentTransformation.value,
            onChange: handleTransformationChange,
            fullWidth: true,
            margin: 'normal',
            variant: 'outlined',
            helperText: 
              currentTransformation.type === 'format' ? 'Format string (e.g., "{0} {1}")' :
              currentTransformation.type === 'numberFormat' ? 'Number format (e.g., "0,0.00")' :
              currentTransformation.type === 'dateFormat' ? 'Date format (e.g., "YYYY-MM-DD")' :
              currentTransformation.type === 'substring' ? 'Start,end (e.g., "0,5")' :
              currentTransformation.type === 'custom' ? 'JavaScript function body' : '',
          }
        )
      ),
      React.createElement(
        DialogActions,
        null,
        React.createElement(
          Button,
          { onClick: handleCloseTransformationDialog, color: 'default' },
          'Cancel'
        ),
        React.createElement(
          Button,
          {
            onClick: handleAddTransformation,
            color: 'primary',
            variant: 'contained',
          },
          'Add Transformation'
        )
      )
    )
  );
};

ResponseConfig.propTypes = {
  tables: PropTypes.array,
  selectedTable: PropTypes.string,
};

ResponseConfig.defaultProps = {
  tables: [],
  selectedTable: '',
};

export default ResponseConfig; 