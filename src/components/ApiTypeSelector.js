import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Paper,
  Typography,
  Divider,
  TextField,
  Button,
  IconButton,
  Box,
  ClickAwayListener,
  Popper,
  Grow,
  MenuList,
  MenuItem
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CheckIcon from '@material-ui/icons/Check';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles({
  root: {
    marginBottom: '24px',
  },
  dropdownButton: {
    width: '100%',
    textAlign: 'left',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 12px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    backgroundColor: 'white',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  },
  dropdownButtonLabel: {
    flexGrow: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  dropdownMenu: {
    zIndex: 1300,
    width: '600px',
    maxWidth: '95vw',
    backgroundColor: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',
    padding: '16px',
    marginTop: '8px',
  },
  menuHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    padding: '0 8px',
  },
  cascaderContainer: {
    display: 'flex',
    alignItems: 'stretch',
    height: '300px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  cascaderPanel: {
    width: '200px',
    borderRight: '1px solid #e0e0e0',
    overflow: 'auto',
    backgroundColor: '#f9f9f9',
  },
  cascaderItem: {
    padding: '12px 16px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#f0f0f0',
    },
  },
  selectedItem: {
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    fontWeight: '500',
    '&:hover': {
      backgroundColor: '#bbdefb',
    },
  },
  itemLabel: {
    flexGrow: 1,
  },
  itemIcon: {
    opacity: 0.6,
  },
  selectedItemIcon: {
    color: '#1976d2',
  },
  urlContainer: {
    marginTop: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  urlField: {
    flexGrow: 1,
  },
  breadcrumbs: {
    padding: '12px 16px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    marginBottom: '16px',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  breadcrumbItem: {
    color: '#1976d2',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
  },
  breadcrumbArrow: {
    margin: '0 8px',
    opacity: 0.6,
  },
  emptyPanel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#757575',
    fontStyle: 'italic',
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    marginTop: '16px',
  }
});

// Demo API categories - in a real application, this would likely come from a backend
const apiCategories = [
  {
    id: '1',
    label: 'Custom: 1',
    children: [
      {
        id: '1-1',
        label: 'Custom: 1-1',
        children: [
          { id: '1-1-1', label: 'Custom: 1-1-1', path: '/api/v1/custom/level1/level1-1' }
        ]
      },
      { id: '1-2', label: 'Custom: 1-2', children: [] },
      { id: '1-3', label: 'Custom: 1-3', children: [] },
      { id: '1-4', label: 'Custom: 1-4', children: [] }
    ]
  },
  {
    id: '2',
    label: 'Custom: 2',
    children: [
      { id: '2-1', label: 'Custom: 2-1', children: [] },
      { 
        id: '2-2', 
        label: 'Custom: 2-2', 
        children: [
          { id: '2-2-1', label: 'Custom: 2-2-1', path: '/api/v2/custom/level2/level2-1' },
          { id: '2-2-2', label: 'Custom: 2-2-2', path: '/api/v2/custom/level2/level2-2' }
        ] 
      }
    ]
  },
  {
    id: '3',
    label: 'Custom: 3',
    children: []
  }
];

const ApiTypeSelector = ({ onTypeSelected, initialUrl = '/api/v1/' }) => {
  const classes = useStyles();
  const [apiUrl, setApiUrl] = useState(initialUrl);
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [tempUrl, setTempUrl] = useState(initialUrl);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const anchorRef = useRef(null);
  
  // Current selection state
  const [selection, setSelection] = useState({
    level1: null,
    level2: null,
    level3: null,
    items: []
  });

  // Display label for the button
  const getDisplayLabel = () => {
    if (selection.items.length === 0) {
      return 'Select API Type';
    }
    
    return selection.items.map(item => item.label).join(' > ');
  };

  // Initialize panels data
  const [panels, setPanels] = useState([
    { level: 1, items: apiCategories, selectedId: null },
    { level: 2, items: [], selectedId: null },
    { level: 3, items: [], selectedId: null }
  ]);

  const handleSelectItem = (level, item) => {
    // Update selection
    const newSelection = { ...selection };
    
    // Clear all selections after the current level
    for (let i = level; i <= 3; i++) {
      const levelKey = `level${i}`;
      newSelection[levelKey] = i === level ? item : null;
    }
    
    // Update selection path
    const newItems = [];
    for (let i = 1; i <= level; i++) {
      const levelKey = `level${i}`;
      if (i === level) {
        newItems.push(item);
      } else if (newSelection[levelKey]) {
        newItems.push(newSelection[levelKey]);
      }
    }
    newSelection.items = newItems;
    setSelection(newSelection);
    
    // Update panels
    const newPanels = [...panels];
    // Update selected item in current level
    newPanels[level - 1] = {
      ...newPanels[level - 1],
      selectedId: item.id
    };
    
    // Update items in next level if available
    if (item.children && item.children.length > 0 && level < 3) {
      newPanels[level] = {
        level: level + 1,
        items: item.children,
        selectedId: null
      };
      
      // Clear any subsequent levels
      for (let i = level + 1; i < 3; i++) {
        newPanels[i] = {
          level: i + 1,
          items: [],
          selectedId: null
        };
      }
    } else {
      // Clear all subsequent levels
      for (let i = level; i < 3; i++) {
        newPanels[i] = {
          level: i + 1,
          items: [],
          selectedId: null
        };
      }
      
      // If this is a leaf node (no children), update URL
      if (!item.children || item.children.length === 0) {
        const newUrl = item.path || `/api/${item.id.toLowerCase().replace(/\s+/g, '-')}`;
        setApiUrl(newUrl);
        setTempUrl(newUrl);
        
        if (onTypeSelected) {
          onTypeSelected(item, newUrl);
        }
        
        // Close dropdown menu when a leaf node is selected
        setDropdownOpen(false);
      }
    }
    
    setPanels(newPanels);
  };

  const handleEditUrl = () => {
    setIsEditingUrl(true);
    setTempUrl(apiUrl);
  };

  const handleSaveUrl = () => {
    setApiUrl(tempUrl);
    setIsEditingUrl(false);
    
    // Get the deepest selected item
    const selectedItem = selection.level3 || selection.level2 || selection.level1;
    if (selectedItem && onTypeSelected) {
      onTypeSelected(selectedItem, tempUrl);
    }
  };

  const handleUrlChange = (e) => {
    setTempUrl(e.target.value);
  };

  const handleToggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleCloseDropdown = () => {
    setDropdownOpen(false);
  };

  const handleApplySelection = () => {
    // Get the deepest selected item
    const selectedItem = selection.level3 || selection.level2 || selection.level1;
    if (selectedItem && onTypeSelected) {
      onTypeSelected(selectedItem, apiUrl);
    }
    setDropdownOpen(false);
  };

  const renderCascaderPanel = (level, items, selectedId) => {
    return React.createElement(
      'div',
      { className: classes.cascaderPanel, key: `panel-${level}` },
      items.length > 0 
        ? items.map((item) => React.createElement(
            'div',
            { 
              key: item.id,
              className: `${classes.cascaderItem} ${selectedId === item.id ? classes.selectedItem : ''}`,
              onClick: () => handleSelectItem(level, item)
            },
            React.createElement(
              'span',
              { className: classes.itemLabel },
              item.label
            ),
            item.children && item.children.length > 0 && React.createElement(
              ChevronRightIcon,
              { className: `${classes.itemIcon} ${selectedId === item.id ? classes.selectedItemIcon : ''}`, fontSize: 'small' }
            ),
            selectedId === item.id && !item.children && React.createElement(
              CheckIcon,
              { className: classes.selectedItemIcon, fontSize: 'small' }
            )
          ))
        : React.createElement(
            'div',
            { className: classes.emptyPanel },
            level === 1 
              ? 'No categories available' 
              : level === 2 
                ? 'Select a category from level 1' 
                : 'Select a subcategory from level 2'
          )
    );
  };

  return React.createElement(
    'div',
    { className: classes.root },
    // Dropdown Trigger Button
    React.createElement(
      'div',
      { 
        className: classes.dropdownButton,
        onClick: handleToggleDropdown,
        ref: anchorRef
      },
      React.createElement(
        'span',
        { className: classes.dropdownButtonLabel },
        getDisplayLabel()
      ),
      React.createElement(ArrowDropDownIcon)
    ),
    
    // API URL Display/Editor (outside dropdown)
    React.createElement(
      'div',
      { className: classes.urlContainer },
      isEditingUrl
        ? React.createElement(
            React.Fragment,
            null,
            React.createElement(
              TextField,
              {
                className: classes.urlField,
                label: 'API URL',
                value: tempUrl,
                onChange: handleUrlChange,
                variant: 'outlined',
                size: 'small'
              }
            ),
            React.createElement(
              Button,
              {
                variant: 'contained',
                color: 'primary',
                onClick: handleSaveUrl,
                size: 'small',
                startIcon: React.createElement(SaveIcon)
              },
              'Save'
            )
          )
        : React.createElement(
            React.Fragment,
            null,
            React.createElement(
              TextField,
              {
                className: classes.urlField,
                label: 'API URL',
                value: apiUrl,
                variant: 'outlined',
                size: 'small',
                disabled: true
              }
            ),
            React.createElement(
              IconButton,
              {
                onClick: handleEditUrl,
                color: 'primary',
                size: 'small'
              },
              React.createElement(EditIcon)
            )
          )
    ),
    
    // Dropdown Menu
    React.createElement(
      Popper,
      {
        open: dropdownOpen,
        anchorEl: anchorRef.current,
        role: undefined,
        transition: true,
        disablePortal: true,
        placement: 'bottom',
        modifiers: {
          flip: {
            enabled: true,
          },
          preventOverflow: {
            enabled: true,
            boundariesElement: 'window',
          },
          offset: {
            enabled: true,
            offset: '0, 4',
          },
        },
        style: { 
          width: anchorRef.current ? anchorRef.current.clientWidth : 'auto', 
          zIndex: 1300
        }
      },
      ({ TransitionProps }) => React.createElement(
        Grow,
        {
          ...TransitionProps,
          style: { transformOrigin: 'top left' }
        },
        React.createElement(
          Paper,
          { className: classes.dropdownMenu },
          React.createElement(
            ClickAwayListener,
            { onClickAway: handleCloseDropdown },
            React.createElement(
              'div',
              null,
              // Header
              React.createElement(
                'div',
                { className: classes.menuHeader },
                React.createElement(
                  Typography,
                  { variant: 'h6' },
                  'Select API Type'
                ),
                React.createElement(
                  IconButton,
                  { 
                    size: 'small',
                    onClick: handleCloseDropdown
                  },
                  React.createElement(CloseIcon, { fontSize: 'small' })
                )
              ),
              
              // Selection breadcrumbs
              selection.items.length > 0 && React.createElement(
                'div',
                { className: classes.breadcrumbs },
                'Selected: ',
                selection.items.map((item, index) => React.createElement(
                  React.Fragment,
                  { key: item.id },
                  index > 0 && React.createElement(
                    ChevronRightIcon,
                    { fontSize: 'small', className: classes.breadcrumbArrow }
                  ),
                  React.createElement(
                    'span',
                    { className: classes.breadcrumbItem },
                    item.label
                  )
                ))
              ),
              
              // Cascading panels
              React.createElement(
                'div',
                { className: classes.cascaderContainer },
                panels.map(panel => renderCascaderPanel(panel.level, panel.items, panel.selectedId))
              ),
              
              // Action buttons
              React.createElement(
                'div',
                { className: classes.actionButtons },
                React.createElement(
                  Button,
                  {
                    variant: 'outlined',
                    onClick: handleCloseDropdown,
                    size: 'small'
                  },
                  'Cancel'
                ),
                React.createElement(
                  Button,
                  {
                    variant: 'contained',
                    color: 'primary',
                    onClick: handleApplySelection,
                    size: 'small',
                    disabled: selection.items.length === 0
                  },
                  'Apply'
                )
              )
            )
          )
        )
      )
    )
  );
};

ApiTypeSelector.propTypes = {
  onTypeSelected: PropTypes.func,
  initialUrl: PropTypes.string
};

export default ApiTypeSelector; 