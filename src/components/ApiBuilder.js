import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Divider,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: theme.spacing(3),
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(3),
  },
  button: {
    marginLeft: theme.spacing(1),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  table: {
    minWidth: 650,
  },
  sqlPreview: {
    padding: theme.spacing(2),
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
  },
}));

const steps = ['选择数据源', '选择数据表', '定义请求参数', '生成SQL查询', '生成API详情'];

const ApiBuilder = ({ onApiCreated }) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [dataSource, setDataSource] = useState('');
  const [selectedTables, setSelectedTables] = useState([]);
  const [parameters, setParameters] = useState([]);
  const [sqlQuery, setSqlQuery] = useState('');
  const [apiDetails, setApiDetails] = useState({
    name: '',
    endpoint: '',
    method: 'GET',
    description: '',
  });

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Final step - create API
      const newApi = {
        ...apiDetails,
        dataSource,
        selectedTables,
        parameters,
        sqlQuery,
        lineage: {
          upstream: selectedTables.map(table => ({
            type: 'data',
            source: `${dataSource}.${table}`,
          })),
          downstream: [],
        },
      };
      onApiCreated(newApi);
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleTableSelect = (table) => {
    setSelectedTables((prev) =>
      prev.includes(table)
        ? prev.filter((t) => t !== table)
        : [...prev, table]
    );
  };

  const handleParameterAdd = () => {
    setParameters((prev) => [
      ...prev,
      {
        name: '',
        type: 'string',
        required: false,
        description: '',
      },
    ]);
  };

  const handleParameterChange = (index, field, value) => {
    setParameters((prev) =>
      prev.map((param, i) =>
        i === index ? { ...param, [field]: value } : param
      )
    );
  };

  const generateSqlQuery = () => {
    // Simple SQL generation based on selected tables and parameters
    const tableList = selectedTables.join(', ');
    const whereClause = parameters
      .filter((p) => p.name)
      .map((p) => `${p.name} = :${p.name}`)
      .join(' AND ');
    
    const query = `SELECT * FROM ${tableList}${whereClause ? ` WHERE ${whereClause}` : ''}`;
    setSqlQuery(query);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <FormControl className={classes.formControl}>
            <InputLabel>数据源</InputLabel>
            <Select
              value={dataSource}
              onChange={(e) => setDataSource(e.target.value)}
            >
              <MenuItem value="mysql">MySQL</MenuItem>
              <MenuItem value="postgresql">PostgreSQL</MenuItem>
              <MenuItem value="oracle">Oracle</MenuItem>
              <MenuItem value="sqlserver">SQL Server</MenuItem>
            </Select>
          </FormControl>
        );
      case 1:
        return (
          <TableContainer component={Paper}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>选择</TableCell>
                  <TableCell>表名</TableCell>
                  <TableCell>描述</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {['users', 'orders', 'products', 'categories'].map((table) => (
                  <TableRow key={table}>
                    <TableCell>
                      <Checkbox
                        checked={selectedTables.includes(table)}
                        onChange={() => handleTableSelect(table)}
                      />
                    </TableCell>
                    <TableCell>{table}</TableCell>
                    <TableCell>{`${table} 表描述`}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );
      case 2:
        return (
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleParameterAdd}
              className={classes.button}
            >
              添加参数
            </Button>
            {parameters.map((param, index) => (
              <Grid container spacing={2} key={index}>
                <Grid item xs={3}>
                  <TextField
                    label="参数名"
                    value={param.name}
                    onChange={(e) =>
                      handleParameterChange(index, 'name', e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={3}>
                  <FormControl className={classes.formControl}>
                    <InputLabel>类型</InputLabel>
                    <Select
                      value={param.type}
                      onChange={(e) =>
                        handleParameterChange(index, 'type', e.target.value)
                      }
                    >
                      <MenuItem value="string">字符串</MenuItem>
                      <MenuItem value="number">数字</MenuItem>
                      <MenuItem value="boolean">布尔值</MenuItem>
                      <MenuItem value="date">日期</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="描述"
                    value={param.description}
                    onChange={(e) =>
                      handleParameterChange(index, 'description', e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={3}>
                  <Checkbox
                    checked={param.required}
                    onChange={(e) =>
                      handleParameterChange(index, 'required', e.target.checked)
                    }
                    label="必填"
                  />
                </Grid>
              </Grid>
            ))}
          </div>
        );
      case 3:
        return (
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={generateSqlQuery}
              className={classes.button}
            >
              生成SQL
            </Button>
            <Paper className={classes.sqlPreview}>
              <Typography variant="body1">{sqlQuery}</Typography>
            </Paper>
          </div>
        );
      case 4:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="API名称"
                value={apiDetails.name}
                onChange={(e) =>
                  setApiDetails({ ...apiDetails, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="端点URL"
                value={apiDetails.endpoint}
                onChange={(e) =>
                  setApiDetails({ ...apiDetails, endpoint: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl className={classes.formControl}>
                <InputLabel>HTTP方法</InputLabel>
                <Select
                  value={apiDetails.method}
                  onChange={(e) =>
                    setApiDetails({ ...apiDetails, method: e.target.value })
                  }
                >
                  <MenuItem value="GET">GET</MenuItem>
                  <MenuItem value="POST">POST</MenuItem>
                  <MenuItem value="PUT">PUT</MenuItem>
                  <MenuItem value="DELETE">DELETE</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="描述"
                value={apiDetails.description}
                onChange={(e) =>
                  setApiDetails({ ...apiDetails, description: e.target.value })
                }
              />
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} className={classes.stepper}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {renderStepContent(activeStep)}
        <div className={classes.buttons}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            className={classes.button}
          >
            上一步
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            className={classes.button}
          >
            {activeStep === steps.length - 1 ? '完成' : '下一步'}
          </Button>
        </div>
      </div>
    </div>
  );
};

ApiBuilder.propTypes = {
  onApiCreated: PropTypes.func.isRequired,
};

export default ApiBuilder; 