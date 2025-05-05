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
  Divider
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LinkIcon from '@material-ui/icons/Link';
import AddIcon from '@material-ui/icons/Add';
import VisibilityIcon from '@material-ui/icons/Visibility';

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
  { value: 'ONE_TO_ONE', label: 'ONE-TO-ONE' },
  { value: 'ONE_TO_MANY', label: 'ONE-TO-MANY' },
  { value: 'MANY_TO_MANY', label: 'MANY-TO-MANY' },
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

const TableRelationships = ({ selectedConnection }) => {
  const classes = useStyles();
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedTables, setSelectedTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [currentTableData, setCurrentTableData] = useState(null);
  const [relationships, setRelationships] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [relationshipForm, setRelationshipForm] = useState({
    sourceTable: '',
    sourceColumn: '',
    relationshipType: 'ONE_TO_MANY',
    targetTable: '',
    targetColumn: '',
  });

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

  const handleAddRelationship = () => {
    const { sourceTable, sourceColumn, relationshipType, targetTable, targetColumn } = relationshipForm;
    
    if (!sourceTable || !sourceColumn || !relationshipType || !targetTable || !targetColumn) {
      alert('Please fill all fields');
      return;
    }
    
    const newRelationship = {
      id: Date.now(),  // Simple way to generate a unique ID
      sourceTable,
      sourceColumn,
      relationshipType,
      targetTable,
      targetColumn,
    };
    
    setRelationships([...relationships, newRelationship]);
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

  return React.createElement(
    Paper,
    { className: classes.root },
    React.createElement(
      'div',
      { className: classes.header },
      React.createElement(
        Typography,
        { variant: 'h5', component: 'h2' },
        'Table Relationships'
      ),
      React.createElement(
        Button,
        {
          variant: 'contained',
          color: 'primary',
          startIcon: React.createElement(LinkIcon),
          onClick: handleOpenDialog,
          disabled: selectedTables.length < 2,
        },
        'Define Relationship'
      )
    ),
    
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
    
    currentTableData && React.createElement(
      'div',
      { className: classes.previewTable },
      React.createElement(
        Typography,
        { variant: 'h6', component: 'h3', gutterBottom: true },
        `Table Structure: ${currentTableData.name}`
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
              React.createElement(
                TableCell,
                { fontWeight: 'bold' },
                'Column'
              ),
              React.createElement(
                TableCell,
                { fontWeight: 'bold' },
                'Type'
              )
            )
          ),
          React.createElement(
            TableBody,
            null,
            currentTableData.columns.map(column => React.createElement(
              TableRow,
              { key: column },
              React.createElement(
                TableCell,
                null,
                column
              ),
              React.createElement(
                TableCell,
                null,
                column.includes('id') ? 'INTEGER' : 
                column.includes('created_at') ? 'TIMESTAMP' : 'VARCHAR'
              )
            ))
          )
        )
      ),
      
      React.createElement(
        'div',
        { className: classes.previewTable },
        React.createElement(
          Typography,
          { variant: 'h6', component: 'h3', gutterBottom: true },
          'Preview Data'
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
                currentTableData.columns.map(column => React.createElement(
                  TableCell,
                  { key: column },
                  column
                ))
              )
            ),
            React.createElement(
              TableBody,
              null,
              generatePreviewData(currentTableData.name).map((row, rowIndex) => React.createElement(
                TableRow,
                { key: rowIndex },
                currentTableData.columns.map(column => React.createElement(
                  TableCell,
                  { key: `${rowIndex}-${column}` },
                  row[column]
                ))
              ))
            )
          )
        )
      )
    ),
    
    React.createElement(
      Divider,
      { className: classes.divider }
    ),
    
    React.createElement(
      'div',
      { className: classes.relationshipsContainer },
      React.createElement(
        Typography,
        { variant: 'h6', component: 'h3', gutterBottom: true },
        'Defined Relationships'
      ),
      relationships.length === 0 ? React.createElement(
        Typography,
        { variant: 'body2', color: 'textSecondary' },
        'No relationships defined yet. Use the "Define Relationship" button to create one.'
      ) : relationships.map(rel => React.createElement(
        'div',
        { key: rel.id, className: classes.relationshipItem },
        React.createElement(
          'div',
          null,
          React.createElement(
            Typography,
            { variant: 'subtitle2' },
            `${rel.sourceTable}.${rel.sourceColumn}`
          )
        ),
        React.createElement(
          'div',
          { className: classes.relationshipType },
          rel.relationshipType
        ),
        React.createElement(
          'div',
          null,
          React.createElement(
            Typography,
            { variant: 'subtitle2' },
            `${rel.targetTable}.${rel.targetColumn}`
          )
        )
      ))
    ),
    
    React.createElement(
      Dialog,
      {
        open: dialogOpen,
        onClose: handleCloseDialog,
        'aria-labelledby': 'relationship-dialog-title',
        maxWidth: 'sm',
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
              .filter(table => table !== relationshipForm.sourceTable)
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
    )
  );
};

TableRelationships.propTypes = {
  selectedConnection: PropTypes.object,
};

export default TableRelationships; 