import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { 
  Container, 
  Typography, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel, 
  Button,
  AppBar,
  Toolbar,
  Box,
  Divider,
  Tabs,
  Tab
} from '@material-ui/core';
import './App.css';
import ApiBuilder from './components/ApiBuilder';
import ApiLineageManager from './components/ApiLineageManager';
import PropTypes from 'prop-types';

// Import all components
import DatabaseConnection from './components/DatabaseConnection';
import TableRelationships from './components/TableRelationships';
import ParametersAndResponse from './components/ParametersAndResponse';
import SqlQueryBuilder from './components/SqlQueryBuilder';
import IntegrationView from './components/IntegrationView';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    marginBottom: theme.spacing(3),
  },
  title: {
    flexGrow: 1,
  },
  container: {
    padding: theme.spacing(3),
  },
  tabPanel: {
    padding: theme.spacing(3),
  },
  paper: {
    padding: '24px',
  },
  stepper: {
    marginBottom: '32px',
  },
  stepContent: {
    marginTop: '32px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '32px',
  },
  subtitleContainer: {
    marginBottom: '24px',
    padding: '16px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
  },
}));

// Step titles
const steps = [
  'Database Connection',
  'Table Relationships',
  'Parameters & Response',
  'SQL Query Builder',
  'API Integration',
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

function App() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [dbConnection, setDbConnection] = useState({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    database: 'blog_app_demo',
    username: 'demo_user',
    password: '********',
    ssl: false,
    status: 'connected'
  });
  const [selectedTables, setSelectedTables] = useState(['users', 'posts', 'comments', 'categories']);
  const [tableRelationships, setTableRelationships] = useState([
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
      sourceTable: 'categories',
      sourceColumn: 'id',
      relationshipType: 'MANY_TO_MANY',
      targetTable: 'posts',
      targetColumn: 'id',
    }
  ]);
  const [requestParameters, setRequestParameters] = useState([
    {
      id: 'param_1',
      name: 'user_id',
      type: 'INTEGER',
      required: true,
      defaultValue: null,
      validations: {
        min: 1,
        max: null
      },
      mappedTo: 'users.id'
    },
    {
      id: 'param_2',
      name: 'status',
      type: 'STRING',
      required: false,
      defaultValue: 'active',
      validations: {
        enum: ['active', 'draft', 'archived']
      },
      mappedTo: 'posts.status'
    },
    {
      id: 'param_3',
      name: 'limit',
      type: 'INTEGER',
      required: false,
      defaultValue: 10,
      validations: {
        min: 1,
        max: 50
      },
      mappedTo: null
    }
  ]);
  const [responseFields, setResponseFields] = useState([
    {
      id: 'field_1',
      sourceField: 'posts.id',
      alias: 'post_id',
      transform: null,
      include: true
    },
    {
      id: 'field_2',
      sourceField: 'posts.title',
      alias: 'title',
      transform: null,
      include: true
    },
    {
      id: 'field_3',
      sourceField: 'posts.content',
      alias: 'content',
      transform: 'SUBSTRING(content, 1, 100)',
      include: true
    },
    {
      id: 'field_4',
      sourceField: 'users.username',
      alias: 'author',
      transform: null,
      include: true
    },
    {
      id: 'field_5',
      sourceField: 'categories.name',
      alias: 'category',
      transform: null,
      include: true
    }
  ]);
  const [sqlQuery, setSqlQuery] = useState(`SELECT
  posts.id AS post_id,
  posts.title,
  SUBSTRING(posts.content, 1, 100) AS content,
  users.username AS author,
  categories.name AS category
FROM posts
JOIN users ON posts.user_id = users.id
JOIN post_categories ON posts.id = post_categories.post_id
JOIN categories ON post_categories.category_id = categories.id
WHERE users.id = :user_id
AND (:status IS NULL OR posts.status = :status)
ORDER BY posts.created_at DESC
LIMIT :limit;`);
  const [mockTables, setMockTables] = useState([
    { name: 'users', columns: ['id', 'username', 'email', 'created_at', 'last_login', 'status', 'profile_image'] },
    { name: 'posts', columns: ['id', 'user_id', 'title', 'content', 'created_at', 'updated_at', 'status', 'view_count', 'featured'] },
    { name: 'comments', columns: ['id', 'post_id', 'user_id', 'content', 'created_at', 'is_approved'] },
    { name: 'categories', columns: ['id', 'name', 'description', 'slug', 'parent_id'] },
    { name: 'post_categories', columns: ['post_id', 'category_id', 'is_primary'] },
  ]);
  const [tabValue, setTabValue] = useState(0);
  const [apis, setApis] = useState([]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleDbConnectionSelect = (connection) => {
    setDbConnection(connection);
  };

  const handleTablesSelect = (tables) => {
    setSelectedTables(tables);
  };

  const handleRelationshipsChange = (relationships) => {
    setTableRelationships(relationships);
  };

  const handleParametersChange = (parameters) => {
    setRequestParameters(parameters);
  };

  const handleResponseFieldsChange = (fields) => {
    setResponseFields(fields);
  };

  const handleSqlQueryChange = (query) => {
    setSqlQuery(query);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleApiCreated = (newApi) => {
    setApis((prevApis) => [...prevApis, newApi]);
    setTabValue(1); // Switch to lineage view after API creation
  };

  // Render the current step content
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return React.createElement(
          DatabaseConnection,
          { onConnectionSelect: handleDbConnectionSelect }
        );
      case 1:
        return React.createElement(
          TableRelationships,
          { 
            selectedConnection: dbConnection,
            onTablesSelect: handleTablesSelect,
            onRelationshipsChange: handleRelationshipsChange
          }
        );
      case 2:
        return React.createElement(
          ParametersAndResponse,
          { 
            tables: mockTables,
            selectedTable: selectedTables && selectedTables.length > 0 ? selectedTables[0] : '',
            onParametersChange: handleParametersChange,
            onResponseFieldsChange: handleResponseFieldsChange
          }
        );
      case 3:
        return React.createElement(
          SqlQueryBuilder,
          { 
            selectedConnection: dbConnection,
            onSqlQueryChange: handleSqlQueryChange
          }
        );
      case 4:
        return React.createElement(
          IntegrationView,
          { 
            connection: dbConnection,
            tables: selectedTables,
            relationships: tableRelationships,
            parameters: requestParameters,
            responseFields: responseFields,
            sqlQuery: sqlQuery
          }
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            API低代码平台
          </Typography>
        </Toolbar>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="simple tabs example">
          <Tab label="API构建" />
          <Tab label="API血缘" />
        </Tabs>
      </AppBar>

      <Container maxWidth="lg" className={classes.container}>
        <TabPanel value={tabValue} index={0}>
          <Paper elevation={3} className={classes.paper}>
            <Stepper activeStep={activeStep} className={classes.stepper}>
              {steps.map((label) => (
                <Step key={label} />
              ))}
            </Stepper>
            <div className={classes.subtitleContainer}>
              <Typography variant="h5" component="h2" align="center" gutterBottom>
                {steps[activeStep]}
              </Typography>
              <Typography variant="body1" align="center" color="textSecondary">
                {activeStep === 0 ? 'Configure your database connection settings' :
                activeStep === 1 ? 'Define relationships between database tables' :
                activeStep === 2 ? 'Configure request parameters and response fields' :
                activeStep === 3 ? 'Build and optimize SQL queries' :
                'Review and finalize your API configuration'}
              </Typography>
            </div>
            <div className={classes.stepContent}>
              {getStepContent(activeStep)}
            </div>
            <Divider style={{ margin: '32px 0 24px' }} />
            <div className={classes.buttonContainer}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={activeStep === steps.length - 1}
              >
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </Paper>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <ApiLineageManager apis={apis} />
        </TabPanel>
      </Container>
    </div>
  );
}

export default App; 