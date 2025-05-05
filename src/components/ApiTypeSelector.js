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
    maxHeight: '300px',
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#f1f1f1',
      borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#c1c1c1',
      borderRadius: '3px',
      '&:hover': {
        backgroundColor: '#a8a8a8',
      },
    },
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
    label: '认证与安全',
    children: [
      { id: '1-1', label: '用户认证', 
        children: [
          { id: '1-1-1', label: '用户登录', path: '/api/v1/auth/login' },
          { id: '1-1-2', label: '用户注册', path: '/api/v1/auth/register' },
          { id: '1-1-3', label: '刷新令牌', path: '/api/v1/auth/refresh-token' },
          { id: '1-1-4', label: '密码重置', path: '/api/v1/auth/reset-password' },
          { id: '1-1-5', label: '邮箱验证', path: '/api/v1/auth/verify-email' },
          { id: '1-1-6', label: '发送验证码', path: '/api/v1/auth/send-code' },
          { id: '1-1-7', label: '验证码校验', path: '/api/v1/auth/verify-code' }
        ] 
      },
      { id: '1-2', label: 'OAuth集成', 
        children: [
          { id: '1-2-1', label: 'Google OAuth', path: '/api/v1/oauth/google' },
          { id: '1-2-2', label: 'Facebook OAuth', path: '/api/v1/oauth/facebook' },
          { id: '1-2-3', label: 'GitHub OAuth', path: '/api/v1/oauth/github' },
          { id: '1-2-4', label: 'LinkedIn OAuth', path: '/api/v1/oauth/linkedin' },
          { id: '1-2-5', label: 'Twitter OAuth', path: '/api/v1/oauth/twitter' }
        ] 
      },
      { id: '1-3', label: '权限管理', 
        children: [
          { id: '1-3-1', label: '角色列表', path: '/api/v1/roles' },
          { id: '1-3-2', label: '权限列表', path: '/api/v1/permissions' },
          { id: '1-3-3', label: '用户角色分配', path: '/api/v1/user-roles' },
          { id: '1-3-4', label: '角色权限分配', path: '/api/v1/role-permissions' }
        ] 
      }
    ]
  },
  {
    id: '2',
    label: '内容管理',
    children: [
      { id: '2-1', label: '文章管理', 
        children: [
          { id: '2-1-1', label: '文章列表', path: '/api/v1/articles' },
          { id: '2-1-2', label: '创建文章', path: '/api/v1/articles/create' },
          { id: '2-1-3', label: '更新文章', path: '/api/v1/articles/update' },
          { id: '2-1-4', label: '删除文章', path: '/api/v1/articles/delete' },
          { id: '2-1-5', label: '文章分类', path: '/api/v1/article-categories' },
          { id: '2-1-6', label: '文章标签', path: '/api/v1/article-tags' },
          { id: '2-1-7', label: '文章评论', path: '/api/v1/article-comments' },
          { id: '2-1-8', label: '文章点赞', path: '/api/v1/article-likes' }
        ] 
      },
      { id: '2-2', label: '媒体管理', 
        children: [
          { id: '2-2-1', label: '上传图片', path: '/api/v1/media/upload-image' },
          { id: '2-2-2', label: '上传视频', path: '/api/v1/media/upload-video' },
          { id: '2-2-3', label: '上传音频', path: '/api/v1/media/upload-audio' },
          { id: '2-2-4', label: '媒体库', path: '/api/v1/media/library' },
          { id: '2-2-5', label: '媒体处理', path: '/api/v1/media/process' }
        ] 
      }
    ]
  },
  {
    id: '3',
    label: '用户管理',
    children: [
      { id: '3-1', label: '用户资料', 
        children: [
          { id: '3-1-1', label: '获取用户信息', path: '/api/v1/users/profile' },
          { id: '3-1-2', label: '更新用户信息', path: '/api/v1/users/update' },
          { id: '3-1-3', label: '用户偏好设置', path: '/api/v1/users/preferences' },
          { id: '3-1-4', label: '用户头像', path: '/api/v1/users/avatar' }
        ] 
      },
      { id: '3-2', label: '用户关系', 
        children: [
          { id: '3-2-1', label: '用户关注', path: '/api/v1/user-follows' },
          { id: '3-2-2', label: '用户好友', path: '/api/v1/user-friends' },
          { id: '3-2-3', label: '用户黑名单', path: '/api/v1/user-blacklist' }
        ] 
      }
    ]
  },
  {
    id: '4',
    label: '数据分析',
    children: [
      { id: '4-1', label: '用户行为', 
        children: [
          { id: '4-1-1', label: '页面访问', path: '/api/v1/analytics/page-views' },
          { id: '4-1-2', label: '用户点击', path: '/api/v1/analytics/user-clicks' },
          { id: '4-1-3', label: '停留时间', path: '/api/v1/analytics/time-spent' },
          { id: '4-1-4', label: '转化率', path: '/api/v1/analytics/conversion-rate' },
          { id: '4-1-5', label: '跳出率', path: '/api/v1/analytics/bounce-rate' }
        ] 
      },
      { id: '4-2', label: '报表导出', 
        children: [
          { id: '4-2-1', label: '日报表', path: '/api/v1/reports/daily' },
          { id: '4-2-2', label: '周报表', path: '/api/v1/reports/weekly' },
          { id: '4-2-3', label: '月报表', path: '/api/v1/reports/monthly' },
          { id: '4-2-4', label: '自定义报表', path: '/api/v1/reports/custom' }
        ] 
      }
    ]
  },
  {
    id: '5',
    label: '支付系统',
    children: [
      { id: '5-1', label: '支付方式', 
        children: [
          { id: '5-1-1', label: '支付宝', path: '/api/v1/payment/alipay' },
          { id: '5-1-2', label: '微信支付', path: '/api/v1/payment/wechat' },
          { id: '5-1-3', label: '银联支付', path: '/api/v1/payment/unionpay' },
          { id: '5-1-4', label: 'PayPal', path: '/api/v1/payment/paypal' },
          { id: '5-1-5', label: 'Stripe', path: '/api/v1/payment/stripe' }
        ] 
      },
      { id: '5-2', label: '交易管理', 
        children: [
          { id: '5-2-1', label: '交易记录', path: '/api/v1/transactions' },
          { id: '5-2-2', label: '退款处理', path: '/api/v1/refunds' },
          { id: '5-2-3', label: '支付回调', path: '/api/v1/payment-callbacks' }
        ] 
      }
    ]
  },
  {
    id: '6',
    label: '消息通知',
    children: [
      { id: '6-1', label: '站内通知', 
        children: [
          { id: '6-1-1', label: '系统通知', path: '/api/v1/notifications/system' },
          { id: '6-1-2', label: '用户通知', path: '/api/v1/notifications/user' },
          { id: '6-1-3', label: '消息设置', path: '/api/v1/notifications/settings' }
        ] 
      },
      { id: '6-2', label: '外部通知', 
        children: [
          { id: '6-2-1', label: '邮件发送', path: '/api/v1/notifications/email' },
          { id: '6-2-2', label: '短信发送', path: '/api/v1/notifications/sms' },
          { id: '6-2-3', label: '推送通知', path: '/api/v1/notifications/push' }
        ] 
      }
    ]
  },
  {
    id: '7',
    label: 'OpenAI API',
    children: [
      { id: '7-1', label: '文本处理', 
        children: [
          { id: '7-1-1', label: '文本补全', path: '/api/v1/openai/completions' },
          { id: '7-1-2', label: '文本嵌入', path: '/api/v1/openai/embeddings' },
          { id: '7-1-3', label: '文本编辑', path: '/api/v1/openai/edits' }
        ] 
      },
      { id: '7-2', label: '图像处理', 
        children: [
          { id: '7-2-1', label: '图像生成', path: '/api/v1/openai/images/generations' },
          { id: '7-2-2', label: '图像编辑', path: '/api/v1/openai/images/edits' },
          { id: '7-2-3', label: '图像变体', path: '/api/v1/openai/images/variations' }
        ] 
      },
      { id: '7-3', label: '音频处理', 
        children: [
          { id: '7-3-1', label: '音频转录', path: '/api/v1/openai/audio/transcriptions' },
          { id: '7-3-2', label: '音频翻译', path: '/api/v1/audio/translations' }
        ] 
      }
    ]
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