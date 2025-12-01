import React, { useEffect, useState } from 'react';
import { Button, Card, Row, Col, Statistic, Alert, Spin, Space, Divider, Typography, Table, Dropdown } from 'antd';
import { CloudOutlined, SafetyOutlined, ExclamationCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

function N8nPanel() {
  const [status, setStatus] = useState('starting');
  const [countdown, setCountdown] = useState(10);
  const [stats, setStats] = useState({
    workflowCount: 0,
    executionCount: 0,
    failedExecutions: 0,
    credentialsCount: 0,
    loading: true,
    error: null,
  });

  const openUrl = () => {
    window.electronAPI.openUrl('http://localhost:5678');
    setCountdown(10); // Reset countdown after clicking
  };

  const openDataFolder = () => {
    if (window.electronAPI?.openN8nDataFolder) {
      window.electronAPI.openN8nDataFolder();
    }
  };

  const handleOpenSignup = () => {
    window.electronAPI.openUrl('https://n8n.partnerlinks.io/li25lnhmcj8f');
  };

  // Countdown timer for Open n8n button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Check n8n status
  useEffect(() => {
    let intervalId;

    async function checkN8n() {
      try {
        const response = await fetch('http://localhost:5678');
        if (response.ok) {
          setStatus('ready');
          clearInterval(intervalId);
        } else {
          setStatus('loading');
        }
      } catch (err) {
        setStatus('loading');
      }
    }

    intervalId = setInterval(checkN8n, 1000);
    checkN8n();

    return () => clearInterval(intervalId);
  }, []);

  // Fetch workflow and execution stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const fetchOptions = {
          method: 'GET',
          mode: 'no-cors',
          credentials: 'omit',
        };

        const workflowsRes = await fetch('http://127.0.0.1:5678/api/v1/workflows', fetchOptions);
        const executionsRes = await fetch('http://127.0.0.1:5678/api/v1/executions', fetchOptions);
        const credentialsRes = await fetch('http://127.0.0.1:5678/api/v1/credentials', fetchOptions);

        let workflowCount = 0;
        let executionCount = 0;
        let failedExecutions = 0;
        let credentialsCount = 0;

        try {
          const workflowsData = await workflowsRes.clone().json();
          workflowCount = workflowsData.data?.length || 0;
        } catch (e) {
          console.warn('Failed to parse workflows response', e);
        }

        try {
          const executionsData = await executionsRes.clone().json();
          executionCount = executionsData.data?.length || 0;
          // Count failed executions
          failedExecutions = executionsData.data?.filter(exec => 
            exec.status === 'error' || exec.status === 'failed' || exec.finished === false
          ).length || 0;
        } catch (e) {
          console.warn('Failed to parse executions response', e);
        }

        try {
          const credentialsData = await credentialsRes.clone().json();
          credentialsCount = credentialsData.data?.length || 0;
        } catch (e) {
          console.warn('Failed to parse credentials response', e);
        }

        setStats({
          workflowCount,
          executionCount,
          failedExecutions,
          credentialsCount,
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error('Error fetching n8n stats:', err);
        setStats((prev) => ({
          ...prev,
          loading: false,
          error: err.message || 'Unable to connect to n8n',
        }));
      }
    };

    const timer = setTimeout(() => {
      fetchStats();
    }, 2000);

    const interval = setInterval(fetchStats, 30000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const hasWorkflows = stats.workflowCount > 0;

  return (
    <Card style={{ margin: '20px 0', maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto' }}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {/* Stats Section */}
        {stats.loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin size="large" />
          </div>
        ) : stats.error ? (
          <Alert
            message="Unable to Load Stats"
            description="Make sure n8n is running on port 5678"
            type="error"
            showIcon
          />
        ) : (
          <>
            <Alert
              message={
                <span>
                  Workflows are stored only on this PC. Use{' '}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleOpenSignup();
                    }}
                    style={{ textDecoration: 'underline', color: 'inherit', fontWeight: 500 }}
                  >
                    n8n.com
                  </a>{' '}
                  to avoid data loss and access anywhere.
                </span>
              }
              type="warning"
              showIcon
              style={{ marginBottom: '8px' }}
            />
            <Row gutter={16}>
              <Col xs={6} sm={6}>
                <Statistic
                  title="Workflows"
                  value={stats.workflowCount}
                  prefix={<CloudOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col xs={6} sm={6}>
                <Statistic
                  title="Executions"
                  value={stats.executionCount}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col xs={6} sm={6}>
                <Statistic
                  title="Failed"
                  value={stats.failedExecutions}
                  valueStyle={{ color: stats.failedExecutions > 0 ? '#ff4d4f' : '#8c8c8c' }}
                />
              </Col>
              <Col xs={6} sm={6}>
                <Statistic
                  title="Credentials"
                  value={stats.credentialsCount}
                  prefix={<SafetyOutlined />}
                  valueStyle={{ color: stats.credentialsCount > 0 ? '#fa8c16' : '#8c8c8c' }}
                />
              </Col>
            </Row>

            {(stats.failedExecutions > 0 || stats.credentialsCount > 0) && (
              <Alert
                message={
                  stats.failedExecutions > 0 && stats.credentialsCount > 0
                    ? "Critical: Failed executions & credentials at risk"
                    : stats.failedExecutions > 0
                    ? "Failed executions detected"
                    : "Credentials stored locally"
                }
                description={
                  <span>
                    {stats.failedExecutions > 0 && (
                      <>{stats.failedExecutions} execution{stats.failedExecutions !== 1 ? 's' : ''} failed. </>
                    )}
                    {stats.credentialsCount > 0 && (
                      <>{stats.credentialsCount} credential{stats.credentialsCount !== 1 ? 's' : ''} at risk. </>
                    )}
                    Get monitoring, alerts & secure cloud backup on{' '}
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleOpenSignup();
                      }}
                      style={{ textDecoration: 'underline', fontWeight: 500 }}
                    >
                      n8n.com
                    </a>
                  </span>
                }
                type="error"
                icon={<ExclamationCircleOutlined />}
                showIcon
                style={{ marginTop: '16px' }}
              />
            )}

            {hasWorkflows && stats.failedExecutions === 0 && stats.credentialsCount === 0 && (
              <Alert
                message="Protect Your Workflows"
                description={`You have ${stats.workflowCount} workflow${stats.workflowCount !== 1 ? 's' : ''} running locally. Back them up to the cloud to prevent data loss.`}
                type="warning"
                icon={<ExclamationCircleOutlined />}
                showIcon
                style={{ marginTop: '16px' }}
              />
            )}

            <Card type="inner" style={{ background: 'transparent', padding: '0', marginTop: '0', border: 'none' }}>
              <Table
                dataSource={[
                  {
                    key: '1',
                    feature: 'Cloud Backup',
                    local: <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: '22px' }} />,
                    cloud: <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '22px' }} />,
                  },
                  {
                    key: '2',
                    feature: 'Access Anywhere',
                    local: <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: '22px' }} />,
                    cloud: <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '22px' }} />,
                  },
                  {
                    key: '3',
                    feature: 'Team Collaboration',
                    local: <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: '22px' }} />,
                    cloud: <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '22px' }} />,
                  },
                  {
                    key: '4',
                    feature: 'Advanced Features',
                    local: <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: '22px' }} />,
                    cloud: <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '22px' }} />,
                  },
                  {
                    key: '5',
                    feature: 'Data Loss Protection',
                    local: <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: '22px' }} />,
                    cloud: <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '22px' }} />,
                  },
                ]}
                columns={[
                  {
                    title: '',
                    dataIndex: 'feature',
                    key: 'feature',
                    width: 200,
                    render: (text) => <span style={{ fontSize: '15px', fontWeight: '500', color: '#262626' }}>{text}</span>,
                  },
                  {
                    title: 'Local n8n',
                    dataIndex: 'local',
                    key: 'local',
                    align: 'center',
                    width: 250,
                    render: (icon) => <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>{icon}</div>,
                  },
                  {
                    title: 'n8n.com',
                    dataIndex: 'cloud',
                    key: 'cloud',
                    align: 'center',
                    width: 250,
                    render: (icon) => <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>{icon}</div>,
                  },
                ]}
                pagination={false}
                size="small"
                bordered
                style={{ marginBottom: '0' }}
                showHeader={true}
              />

              {/* Buttons - positioned to align with table columns using absolute pixel widths */}
              <div style={{ display: 'flex', paddingLeft: '0', paddingRight: '0' }}>
                <div style={{ width: '200px' }}></div>
                <div style={{ width: '250px', paddingRight: '12px' }}>
                  <Dropdown.Button
                    type="default"
                    size="large"
                    onClick={openUrl}
                    menu={{
                      items: [
                        {
                          key: 'open-data-folder',
                          label: 'Open n8n data folder',
                          onClick: openDataFolder,
                        },
                      ],
                    }}
                    disabled={status !== 'ready' || countdown > 0}
                    style={{
                      width: '100%',
                      height: '44px',
                      fontSize: '14px',
                      fontWeight: '500',
                    }}
                    buttonsRender={([leftButton, rightButton]) => [
                      React.cloneElement(leftButton, { style: { ...leftButton.props.style, flex: 1 } }),
                      rightButton,
                    ]}
                  >
                    {status !== 'ready' || countdown > 0 ? (
                      <Spin size="small" />
                    ) : (
                      'Open Local n8n'
                    )}
                  </Dropdown.Button>
                </div>
                <div style={{ width: '250px', paddingLeft: '12px' }}>
                  <Button
                    type="primary"
                    size="large"
                    block
                    onClick={handleOpenSignup}
                    style={{ 
                      height: '44px',
                      fontSize: '14px',
                      fontWeight: '500',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                      borderColor: 'transparent' 
                    }}
                  >
                    Sign Up n8n.com Free
                  </Button>
                </div>
              </div>
            </Card>
          </>
        )}
      </Space>
    </Card>
  );
}

export default N8nPanel;
