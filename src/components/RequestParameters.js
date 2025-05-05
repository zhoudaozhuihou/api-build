import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Switch,
  FormControlLabel
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

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
  formControl: {
    minWidth: '200px',
    marginBottom: '16px',
  },
  chipContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '8px',
  },
  chip: {
    margin: '0 4px 4px 0',
  },
  tableContainer: {
    marginTop: '24px',
  },
  actionButtons: {
    display: 'flex',
    gap: '8px',
  },
  dialogContent: {
    minHeight: '400px',
  },
  validationSection: {
    marginTop: '24px',
    padding: '16px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
  },
  mappingSection: {
    marginTop: '24px',
  },
});

const parameterTypes = [
  { value: 'string', label: 'String' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'date', label: 'Date' },
  { value: 'array', label: 'Array' },
  { value: 'object', label: 'Object' },
];

const validationTypes = [
  { value: 'required', label: 'Required' },
  { value: 'min', label: 'Min Length/Value' },
  { value: 'max', label: 'Max Length/Value' },
  { value: 'pattern', label: 'Pattern/Regex' },
  { value: 'email', label: 'Email' },
  { value: 'enum', label: 'Enum (Allowed Values)' },
];

const initialParameterState = {
  name: '',
  type: 'string',
  description: '',
  required: false,
  defaultValue: '',
  validationRules: [],
  mappedToField: '',
  transformations: [],
};

const RequestParameters = ({ tables, selectedTable }) => {
  const classes = useStyles();
  const [parameters, setParameters] = useState([]);
  const [currentParameter, setCurrentParameter] = useState(initialParameterState);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  const [currentValidation, setCurrentValidation] = useState({
    type: 'required',
    value: '',
  });

  const handleOpenDialog = (index = -1) => {
    if (index >= 0) {
      // Edit existing parameter
      setCurrentParameter(parameters[index]);
      setEditIndex(index);
    } else {
      // Create new parameter
      setCurrentParameter(initialParameterState);
      setEditIndex(-1);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrentParameter(initialParameterState);
    setEditIndex(-1);
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    const newValue = name === 'required' ? checked : value;
    setCurrentParameter(prev => ({ ...prev, [name]: newValue }));
  };

  const handleSaveParameter = () => {
    if (!currentParameter.name) {
      alert('Parameter name is required');
      return;
    }

    const newParameters = [...parameters];
    
    if (editIndex >= 0) {
      // Update existing parameter
      newParameters[editIndex] = currentParameter;
    } else {
      // Add new parameter
      newParameters.push(currentParameter);
    }
    
    setParameters(newParameters);
    handleCloseDialog();
  };

  const handleDeleteParameter = (index) => {
    const newParameters = parameters.filter((_, i) => i !== index);
    setParameters(newParameters);
  };

  const handleOpenValidationDialog = () => {
    setCurrentValidation({
      type: 'required',
      value: '',
    });
    setValidationDialogOpen(true);
  };

  const handleCloseValidationDialog = () => {
    setValidationDialogOpen(false);
  };

  const handleValidationChange = (e) => {
    const { name, value } = e.target;
    setCurrentValidation(prev => ({ ...prev, [name]: value }));
  };

  const handleAddValidation = () => {
    // If it's a 'required' validation, we don't need a value
    if (currentValidation.type !== 'required' && !currentValidation.value) {
      alert('Validation value is required');
      return;
    }

    // Don't add duplicate validations
    const exists = currentParameter.validationRules.some(rule => rule.type === currentValidation.type);
    if (exists) {
      alert(`A validation of type ${currentValidation.type} already exists`);
      return;
    }

    const newValidationRules = [...currentParameter.validationRules, currentValidation];
    setCurrentParameter(prev => ({ ...prev, validationRules: newValidationRules }));
    setValidationDialogOpen(false);
  };

  const handleRemoveValidation = (index) => {
    const newValidationRules = currentParameter.validationRules.filter((_, i) => i !== index);
    setCurrentParameter(prev => ({ ...prev, validationRules: newValidationRules }));
  };

  // Get available fields from selected table
  const getAvailableFields = () => {
    if (!tables || !selectedTable) return [];
    
    const table = tables.find(t => t.name === selectedTable);
    return table ? table.columns : [];
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
        'Request Parameters'
      ),
      React.createElement(
        Button,
        {
          variant: 'contained',
          color: 'primary',
          startIcon: React.createElement(AddIcon),
          onClick: () => handleOpenDialog(),
        },
        'Add Parameter'
      )
    ),
    
    parameters.length === 0 ? React.createElement(
      Typography,
      { variant: 'body2', color: 'textSecondary' },
      'No parameters defined yet. Click "Add Parameter" to create one.'
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
            React.createElement(TableCell, null, 'Name'),
            React.createElement(TableCell, null, 'Type'),
            React.createElement(TableCell, null, 'Required'),
            React.createElement(TableCell, null, 'Default Value'),
            React.createElement(TableCell, null, 'Validation Rules'),
            React.createElement(TableCell, null, 'Mapped Field'),
            React.createElement(TableCell, null, 'Actions')
          )
        ),
        React.createElement(
          TableBody,
          null,
          parameters.map((param, index) => React.createElement(
            TableRow,
            { key: index },
            React.createElement(TableCell, null, param.name),
            React.createElement(TableCell, null, param.type),
            React.createElement(
              TableCell,
              null,
              param.required ? 'Yes' : 'No'
            ),
            React.createElement(TableCell, null, param.defaultValue || '-'),
            React.createElement(
              TableCell,
              null,
              param.validationRules.length > 0 ? React.createElement(
                'div',
                { className: classes.chipContainer },
                param.validationRules.map((rule, ruleIndex) => React.createElement(
                  Chip,
                  {
                    key: ruleIndex,
                    label: rule.type === 'required' ? 'Required' : `${rule.type}:${rule.value}`,
                    size: 'small',
                    className: classes.chip,
                  }
                ))
              ) : '-'
            ),
            React.createElement(
              TableCell,
              null,
              param.mappedToField || '-'
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
                    onClick: () => handleDeleteParameter(index),
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
    
    // Parameter Dialog
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
        editIndex >= 0 ? 'Edit Parameter' : 'Add Parameter'
      ),
      React.createElement(
        DialogContent,
        { className: classes.dialogContent },
        React.createElement(
          Grid,
          { container: true, spacing: 2 },
          React.createElement(
            Grid,
            { item: true, xs: 12, sm: 6 },
            React.createElement(
              TextField,
              {
                name: 'name',
                label: 'Parameter Name',
                value: currentParameter.name,
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
              FormControl,
              { variant: 'outlined', fullWidth: true, margin: 'normal' },
              React.createElement(
                InputLabel,
                { id: 'parameter-type-label' },
                'Parameter Type'
              ),
              React.createElement(
                Select,
                {
                  labelId: 'parameter-type-label',
                  id: 'parameter-type',
                  name: 'type',
                  value: currentParameter.type,
                  onChange: handleInputChange,
                  label: 'Parameter Type',
                },
                parameterTypes.map(type => React.createElement(
                  MenuItem,
                  { key: type.value, value: type.value },
                  type.label
                ))
              )
            )
          ),
          React.createElement(
            Grid,
            { item: true, xs: 12 },
            React.createElement(
              TextField,
              {
                name: 'description',
                label: 'Description',
                value: currentParameter.description,
                onChange: handleInputChange,
                fullWidth: true,
                margin: 'normal',
                variant: 'outlined',
                multiline: true,
                rows: 2,
              }
            )
          ),
          React.createElement(
            Grid,
            { item: true, xs: 12, sm: 6 },
            React.createElement(
              FormControlLabel,
              {
                control: React.createElement(
                  Switch,
                  {
                    checked: currentParameter.required,
                    onChange: handleInputChange,
                    name: 'required',
                    color: 'primary',
                  }
                ),
                label: 'Required',
              }
            )
          ),
          React.createElement(
            Grid,
            { item: true, xs: 12, sm: 6 },
            React.createElement(
              TextField,
              {
                name: 'defaultValue',
                label: 'Default Value',
                value: currentParameter.defaultValue,
                onChange: handleInputChange,
                fullWidth: true,
                margin: 'normal',
                variant: 'outlined',
              }
            )
          )
        ),
        
        // Validation Rules Section
        React.createElement(
          'div',
          { className: classes.validationSection },
          React.createElement(
            'div',
            { className: classes.header },
            React.createElement(
              Typography,
              { variant: 'h6', component: 'h3' },
              'Validation Rules'
            ),
            React.createElement(
              Button,
              {
                variant: 'outlined',
                color: 'primary',
                startIcon: React.createElement(AddIcon),
                onClick: handleOpenValidationDialog,
                size: 'small',
              },
              'Add Validation'
            )
          ),
          currentParameter.validationRules.length === 0 ? React.createElement(
            Typography,
            { variant: 'body2', color: 'textSecondary' },
            'No validation rules defined yet.'
          ) : React.createElement(
            'div',
            { className: classes.chipContainer },
            currentParameter.validationRules.map((rule, index) => React.createElement(
              Chip,
              {
                key: index,
                label: rule.type === 'required' ? 'Required' : `${rule.type}: ${rule.value}`,
                onDelete: () => handleRemoveValidation(index),
                className: classes.chip,
              }
            ))
          )
        ),
        
        // Field Mapping Section
        React.createElement(
          'div',
          { className: classes.mappingSection },
          React.createElement(
            Typography,
            { variant: 'h6', component: 'h3', gutterBottom: true },
            'Map to Database Field'
          ),
          React.createElement(
            FormControl,
            { variant: 'outlined', fullWidth: true, margin: 'normal' },
            React.createElement(
              InputLabel,
              { id: 'mapped-field-label' },
              'Mapped Field'
            ),
            React.createElement(
              Select,
              {
                labelId: 'mapped-field-label',
                id: 'mapped-field',
                name: 'mappedToField',
                value: currentParameter.mappedToField,
                onChange: handleInputChange,
                label: 'Mapped Field',
              },
              React.createElement(
                MenuItem,
                { value: '' },
                '<None>'
              ),
              getAvailableFields().map(field => React.createElement(
                MenuItem,
                { key: field, value: field },
                field
              ))
            )
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
            onClick: handleSaveParameter,
            color: 'primary',
            variant: 'contained',
          },
          'Save Parameter'
        )
      )
    ),
    
    // Validation Dialog
    React.createElement(
      Dialog,
      {
        open: validationDialogOpen,
        onClose: handleCloseValidationDialog,
        maxWidth: 'sm',
        fullWidth: true,
      },
      React.createElement(
        DialogTitle,
        null,
        'Add Validation Rule'
      ),
      React.createElement(
        DialogContent,
        null,
        React.createElement(
          FormControl,
          { variant: 'outlined', fullWidth: true, margin: 'normal' },
          React.createElement(
            InputLabel,
            { id: 'validation-type-label' },
            'Validation Type'
          ),
          React.createElement(
            Select,
            {
              labelId: 'validation-type-label',
              id: 'validation-type',
              name: 'type',
              value: currentValidation.type,
              onChange: handleValidationChange,
              label: 'Validation Type',
            },
            validationTypes.map(type => React.createElement(
              MenuItem,
              { key: type.value, value: type.value },
              type.label
            ))
          )
        ),
        currentValidation.type !== 'required' && React.createElement(
          TextField,
          {
            name: 'value',
            label: 'Validation Value',
            value: currentValidation.value,
            onChange: handleValidationChange,
            fullWidth: true,
            margin: 'normal',
            variant: 'outlined',
            helperText: currentValidation.type === 'pattern' ? 'Enter a regular expression' : 
                       currentValidation.type === 'enum' ? 'Enter comma-separated values' : 
                       currentValidation.type === 'min' || currentValidation.type === 'max' ? 'Enter a numeric value' : '',
          }
        )
      ),
      React.createElement(
        DialogActions,
        null,
        React.createElement(
          Button,
          { onClick: handleCloseValidationDialog, color: 'default' },
          'Cancel'
        ),
        React.createElement(
          Button,
          {
            onClick: handleAddValidation,
            color: 'primary',
            variant: 'contained',
          },
          'Add Validation'
        )
      )
    )
  );
};

RequestParameters.propTypes = {
  tables: PropTypes.array,
  selectedTable: PropTypes.string,
};

RequestParameters.defaultProps = {
  tables: [],
  selectedTable: '',
};

export default RequestParameters; 