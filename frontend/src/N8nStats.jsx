import React, { useState, useEffect } from 'react';
import './N8nStats.css';

export function N8nStats() {
  const [stats, setStats] = useState({
    workflowCount: 0,
    executionCount: 0,
    loading: true,
    error: null,
  });

  const handleOpenSignup = () => {
    window.electronAPI.openUrl('https://n8n.partnerlinks.io/li25lnhmcj8f');
  };

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

        // no-cors mode returns opaque responses; check status directly
        let workflowCount = 0;
        let executionCount = 0;

        try {
          const workflowsData = await workflowsRes.clone().json();
          workflowCount = workflowsData.data?.length || 0;
        } catch (e) {
          console.warn('Failed to parse workflows response', e);
        }

        try {
          const executionsData = await executionsRes.clone().json();
          executionCount = executionsData.data?.length || 0;
        } catch (e) {
          console.warn('Failed to parse executions response', e);
        }

        setStats({
          workflowCount,
          executionCount,
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

    // Add a small delay to ensure n8n is started
    const timer = setTimeout(() => {
      fetchStats();
    }, 2000);

    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  if (stats.loading) {
    return <div className="stats-container stats-loading">Loading stats...</div>;
  }

  if (stats.error) {
    return (
      <div className="stats-container stats-error">
        <div>Unable to load stats</div>
        <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.7 }}>
          Make sure n8n is running on port 5678
        </div>
      </div>
    );
  }

  const hasWorkflows = stats.workflowCount > 0;

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h3>Your Workflows</h3>
      </div>

      <div className="stats-content">
        <div className="stat-item">
          <div className="stat-value">{stats.workflowCount}</div>
          <div className="stat-label">Workflow{stats.workflowCount !== 1 ? 's' : ''}</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{stats.executionCount}</div>
          <div className="stat-label">Execution{stats.executionCount !== 1 ? 's' : ''}</div>
        </div>
      </div>

      {hasWorkflows && (
        <div className="warning-banner">
          <div className="warning-icon">⚠️</div>
          <div className="warning-content">
            <div className="warning-title">Protect Your Workflows</div>
            <div className="warning-text">
              You have {stats.workflowCount} workflow{stats.workflowCount !== 1 ? 's' : ''} running locally.
              Back them up to the cloud to prevent data loss.
            </div>
          </div>
        </div>
      )}

      <div className="cta-section">
        <div className="cta-title">Sign Up Free on n8n.com</div>
        <div className="cta-benefits">
          <div className="benefit-item">✓ Cloud backup for all workflows</div>
          <div className="benefit-item">✓ Access from anywhere</div>
          <div className="benefit-item">✓ Advanced collaboration features</div>
          <div className="benefit-item">✓ Team management</div>
        </div>
        <button
          onClick={handleOpenSignup}
          className="cta-button"
        >
          Get Started Free
        </button>
      </div>
    </div>
  );
}
