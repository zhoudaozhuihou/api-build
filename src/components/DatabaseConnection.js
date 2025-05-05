import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  Paper, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Typography, 
  IconButton,
  Snackbar 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';

const useStyles = makeStyles({
  root: {
    padding: '24px',
    marginBottom: '24px',
  },
  form: {
    marginTop: '16px',
  },
  formControl: {
    minWidth: '120px',
    marginBottom: '16px',
  },
  inputField: {
    marginBottom: '16px',
  },
  buttonGroup: {
    marginTop: '16px',
    display: 'flex',
    gap: '8px',
  },
  connectionList: {
    marginTop: '24px',
  },
  connectionItem: {
    padding: '16px',
    marginBottom: '8px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  }
});

const databaseTypes = [
  { value: 'mysql', label: 'MySQL' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'mssql', label: 'Microsoft SQL Server' },
  { value: 'oracle', label: 'Oracle' },
  { value: 'mongodb', label: 'MongoDB' },
];

const initialConnectionState = {
  name: '',
  type: 'mysql',
  host: '',
  port: '',
  username: '',
  password: '',
  database: '',
};

// Sample database connections
const sampleConnections = [
  {
    name: 'Production MySQL',
    type: 'mysql',
    host: 'production-db.example.com',
    port: '3306',
    username: 'app_user',
    password: '********',
    database: 'blog_app_prod',
    status: 'connected'
  },
  {
    name: 'Development PostgreSQL',
    type: 'postgresql',
    host: 'localhost',
    port: '5432',
    username: 'dev_user',
    password: '********',
    database: 'blog_app_dev',
    status: 'connected'
  },
  {
    name: 'Testing SQL Server',
    type: 'mssql',
    host: 'test-db.example.com',
    port: '1433',
    username: 'test_user',
    password: '********',
    database: 'blog_app_test',
    status: 'disconnected'
  }
];

const DatabaseConnection = ({ onConnectionSelect }) => {
  const classes = useStyles();
  const [connection, setConnection] = useState(initialConnectionState);
  const [savedConnections, setSavedConnections] = useState(sampleConnections);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedConnection, setSelectedConnection] = useState(sampleConnections[0]);

  // Set default selected connection on component mount
  React.useEffect(() => {
    if (savedConnections.length > 0 && onConnectionSelect) {
      setSelectedConnection(savedConnections[0]);
      onConnectionSelect(savedConnections[0]);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConnection(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!connection.name || !connection.host || !connection.port || !connection.username || !connection.database) {
      setSnackbarMessage('Please fill all required fields');
      setSnackbarOpen(true);
      return;
    }

    const newConnections = [...savedConnections];
    const existingIndex = newConnections.findIndex(conn => conn.name === connection.name);

    if (existingIndex >= 0) {
      newConnections[existingIndex] = connection;
    } else {
      newConnections.push(connection);
    }

    setSavedConnections(newConnections);
    setConnection(initialConnectionState);
    setSnackbarMessage('Connection saved successfully');
    setSnackbarOpen(true);
  };

  const handleTestConnection = () => {
    // In a real app, this would test the connection to the database
    setSnackbarMessage('Connection test successful');
    setSnackbarOpen(true);
  };

  const handleSelectConnection = (conn) => {
    setConnection(conn);
    setSelectedConnection(conn);
    if (onConnectionSelect) {
      onConnectionSelect(conn);
    }
  };

  const handleDeleteConnection = (indexToDelete) => {
    const newConnections = savedConnections.filter((_, index) => index !== indexToDelete);
    setSavedConnections(newConnections);
    setSnackbarMessage('Connection deleted');
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      Paper,
      { className: classes.root },
      React.createElement(
        'div',
        { className: classes.header },
        React.createElement(
          Typography,
          { variant: 'h5', component: 'h2' },
          'Database Connection'
        )
      ),
      React.createElement(
        'form',
        { className: classes.form },
        React.createElement(
          TextField,
          {
            name: 'name',
            label: 'Connection Name',
            value: connection.name,
            onChange: handleChange,
            fullWidth: true,
            className: classes.inputField,
            variant: 'outlined',
            required: true,
          }
        ),
        React.createElement(
          FormControl,
          { variant: 'outlined', fullWidth: true, className: classes.inputField },
          React.createElement(
            InputLabel,
            { id: 'database-type-label' },
            'Database Type'
          ),
          React.createElement(
            Select,
            {
              labelId: 'database-type-label',
              id: 'database-type',
              name: 'type',
              value: connection.type,
              onChange: handleChange,
              label: 'Database Type',
            },
            databaseTypes.map(type => React.createElement(
              MenuItem,
              { key: type.value, value: type.value },
              type.label
            ))
          )
        ),
        React.createElement(
          TextField,
          {
            name: 'host',
            label: 'Host',
            value: connection.host,
            onChange: handleChange,
            fullWidth: true,
            className: classes.inputField,
            variant: 'outlined',
            required: true,
          }
        ),
        React.createElement(
          TextField,
          {
            name: 'port',
            label: 'Port',
            value: connection.port,
            onChange: handleChange,
            fullWidth: true,
            className: classes.inputField,
            variant: 'outlined',
            required: true,
          }
        ),
        React.createElement(
          TextField,
          {
            name: 'username',
            label: 'Username',
            value: connection.username,
            onChange: handleChange,
            fullWidth: true,
            className: classes.inputField,
            variant: 'outlined',
            required: true,
          }
        ),
        React.createElement(
          TextField,
          {
            name: 'password',
            label: 'Password',
            type: 'password',
            value: connection.password,
            onChange: handleChange,
            fullWidth: true,
            className: classes.inputField,
            variant: 'outlined',
          }
        ),
        React.createElement(
          TextField,
          {
            name: 'database',
            label: 'Database',
            value: connection.database,
            onChange: handleChange,
            fullWidth: true,
            className: classes.inputField,
            variant: 'outlined',
            required: true,
          }
        ),
        React.createElement(
          'div',
          { className: classes.buttonGroup },
          React.createElement(
            Button,
            {
              variant: 'contained',
              color: 'primary',
              onClick: handleSave,
              className: 'mr-2',
              startIcon: React.createElement(AddIcon),
            },
            'Save Connection'
          ),
          React.createElement(
            Button,
            {
              variant: 'outlined',
              color: 'primary',
              onClick: handleTestConnection,
              startIcon: React.createElement(CheckIcon),
            },
            'Test Connection'
          )
        )
      ),
      savedConnections.length > 0 && React.createElement(
        'div',
        { className: classes.connectionList },
        React.createElement(
          Typography,
          { variant: 'h6', component: 'h3', className: 'mb-4' },
          'Saved Connections'
        ),
        savedConnections.map((conn, index) => React.createElement(
          Paper,
          { 
            key: index, 
            className: `${classes.connectionItem} ${selectedConnection && selectedConnection.name === conn.name ? 'bg-blue-50 border border-blue-500' : ''}` 
          },
          React.createElement(
            'div',
            { className: 'flex justify-between items-center' },
            React.createElement(
              'div',
              null,
              React.createElement(
                Typography,
                { variant: 'subtitle1', component: 'h4', className: 'font-bold' },
                conn.name
              ),
              React.createElement(
                Typography,
                { variant: 'body2', className: 'text-gray-600' },
                `${conn.type} | ${conn.host}:${conn.port} | ${conn.database}`
              )
            ),
            React.createElement(
              'div',
              null,
              React.createElement(
                Button,
                {
                  variant: 'outlined',
                  color: 'primary',
                  size: 'small',
                  onClick: () => handleSelectConnection(conn),
                  className: 'mr-2',
                },
                'Select'
              ),
              React.createElement(
                IconButton,
                {
                  size: 'small',
                  onClick: () => handleDeleteConnection(index),
                  className: 'text-red-500',
                },
                React.createElement(DeleteIcon)
              )
            )
          )
        ))
      )
    ),
    React.createElement(
      Snackbar,
      {
        open: snackbarOpen,
        autoHideDuration: 3000,
        onClose: handleCloseSnackbar,
        message: snackbarMessage,
      }
    )
  );
};

DatabaseConnection.propTypes = {
  onConnectionSelect: PropTypes.func,
};

export default DatabaseConnection; 