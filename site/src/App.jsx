import React, { useState } from "react";
import { Card, Typography, Button, InputNumber, Table, Row, Col, Divider, Badge, Slider } from "antd";
import { WindowsOutlined, AppleOutlined, CloudOutlined, RocketOutlined, TrophyOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

// --- Static Data ---
const cloudPlans = [
  { name: "Starter", executions: 2500, priceEUR: 20, priceUSD: 24 },
  { name: "Pro", executions: 10000, priceEUR: 50, priceUSD: 60 },
  { name: "Business", executions: 40000, priceEUR: 667, priceUSD: 800 },
];

function getCloudPlanCost(execCount) {
  const plan = cloudPlans.find((p) => execCount <= p.executions);
  if (!plan) return { name: "Enterprise", monthly: null, yearly: null };
  return {
    name: plan.name,
    monthly: plan.priceUSD,
    yearly: plan.priceUSD * 12,
  };
}

function getSelfHostCost({ compute, db, bandwidthGb, bandwidthPrice }) {
  const monthly = compute + db + bandwidthGb * bandwidthPrice;
  return { monthly, yearly: monthly * 12 };
}

export default function N8nDecisionPage() {
  // --- State ---
  const [executions, setExecutions] = useState(2500);
  const [compute, setCompute] = useState(10);
  const [db, setDb] = useState(5);
  const [bandwidthGb, setBandwidthGb] = useState(100);
  const [bandwidthPrice, setBandwidthPrice] = useState(0.01);

  // --- Calculations ---
  const cloudCost = getCloudPlanCost(executions);
  const selfHostCost = getSelfHostCost({ compute, db, bandwidthGb, bandwidthPrice });

  let winner;
  if (!cloudCost.monthly) {
    winner = "Self-Hosting (Enterprise scale required on n8n.com)";
  } else if (cloudCost.monthly < selfHostCost.monthly) {
    winner = `n8n Cloud (${cloudCost.name} Plan)`;
  } else {
    winner = "Self-Hosting";
  }

  // --- Table for Self-Host cost breakdown ---
  const selfHostData = [
    { key: "1", service: "Compute", cost: `$${compute.toFixed(2)}` },
    { key: "2", service: "Database", cost: `$${db.toFixed(2)}` },
    { key: "3", service: "Bandwidth", cost: `$${(bandwidthGb * bandwidthPrice).toFixed(2)}` },
    { key: "4", service: "Total", cost: `$${selfHostCost.monthly.toFixed(2)}` },
  ];

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: 24 }}>
      {/* Hero Section */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <Title level={1} style={{ fontSize: "2.8rem", color: "#1890ff", marginBottom: 0 }}>
          <RocketOutlined style={{ marginRight: 12, color: "#ff9800" }} />
          Try n8n Instantly
          <RocketOutlined style={{ marginLeft: 12, color: "#ff9800" }} />
        </Title>
        <Paragraph style={{ fontSize: "1.25rem", color: "#595959", marginTop: 8 }}>
          Choose the easiest way to get started, then compare options for production.
        </Paragraph>
      </div>

      {/* Quick Start Panel */}
      <Card style={{ marginBottom: 32, background: "#f6faff", border: "1px solid #e6f7ff" }}>
        <Title level={3} style={{ color: "#1890ff" }}>Quickly Try Out n8n</Title>
        <Paragraph style={{ marginBottom: 0 }}>
          Download the installer for your platform or try the official cloud for free.
        </Paragraph>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center", marginTop: "24px", marginBottom: "8px" }}>
          <Button type="primary" style={{ minWidth: 170 }} icon={<AppleOutlined />} href="https://github.com/newcl/AutomateJoy/releases/download/v1.0.1-mac-arm64/AutomateJoy-1.0.1-mac-arm64.dmg" target="_blank" rel="noreferrer">Mac (Apple Silicon)</Button>
          <Button type="primary" style={{ minWidth: 170 }} icon={<AppleOutlined />} href="https://github.com/newcl/AutomateJoy/releases/download/v1.0.0-mac-x64/AutomateJoy-1.0.0-mac-x64.dmg" target="_blank" rel="noreferrer">Mac (Intel X64)</Button>
          <Button type="primary" style={{ minWidth: 170 }} icon={<WindowsOutlined />} href="https://github.com/newcl/AutomateJoy/releases/download/v1.0.0-win-x64/AutomateJoy-Setup-1.0.0-win-x64.exe" target="_blank" rel="noreferrer">Windows X64</Button>
          <Button type="primary" style={{ minWidth: 170, background: "linear-gradient(90deg, #ff9800 0%, #ff5722 100%)", border: "none", color: "#fff", boxShadow: "0 2px 8px rgba(255, 152, 0, 0.15)", fontWeight: 600, position: "relative" }} href="https://n8n.partnerlinks.io/li25lnhmcj8f" target="_blank" rel="noreferrer" icon={<span style={{marginRight:4}}>🌐</span>}>
            Free Trial on n8n.com
            <span style={{ position: "absolute", top: 6, right: 12, fontSize: 12, color: "#fff", background: "#ff5722", borderRadius: 6, padding: "2px 8px", fontWeight: 500 }}>External</span>
          </Button>
        </div>
      </Card>

      {/* Comparison Panel with Trophy at Top-Right Corner and Dynamic Effect */}
      <Card style={{ marginBottom: 32, background: "#fffbe6", border: "1px solid #ffe58f" }}>
        <Title level={3} style={{ color: "#faad14" }}>Self-Host vs n8n.com Cloud: Which is Best for You?</Title>
        <Row gutter={32}>
          <Col xs={24} md={12} style={{ position: "relative" }}>
            <div style={{ position: "relative" }}>
              {winner.includes("Cloud") && (
                <span style={{ position: "absolute", top: -24, right: -24, zIndex: 2, animation: "trophyBounce 1s infinite alternate" }}>
                  <TrophyOutlined style={{ fontSize: 56, color: "#1890ff", filter: "drop-shadow(0 2px 8px #1890ff88)" }} />
                </span>
              )}
              <Card bordered={false} style={{ background: "#f0f5ff", marginBottom: 16 }}>
                <Title level={4} style={{ color: "#2f54eb" }}><CloudOutlined /> n8n.com Cloud</Title>
                <Paragraph>Managed, hassle-free, support included.</Paragraph>
                {/* Simple executions slider with K notation and extended range */}
                <div style={{ marginBottom: 12 }}>
                  <span>Executions/month: </span>
                  <Slider
                    min={0}
                    max={100000}
                    step={1000}
                    value={executions}
                    onChange={setExecutions}
                    marks={{
                      0: '0K',
                      2500: '2.5K',
                      10000: '10K',
                      40000: '40K',
                      100000: '100K'
                    }}
                    tooltip={{ formatter: (val) => `${(val/1000).toFixed(1)}K executions` }}
                    style={{ width: 280 }}
                  />
                  <span style={{ marginLeft: 12, fontWeight: 500 }}>{executions >= 1000 ? `${(executions/1000).toFixed(1)}K` : executions} executions</span>
                </div>
                {cloudCost.monthly ? (
                  <Paragraph>
                    <Badge color="#faad14" text={`Plan: ${cloudCost.name}`} />
                    <br />
                    <b>${cloudCost.monthly}/mo</b> (<b>${cloudCost.yearly}/yr</b>)
                  </Paragraph>
                ) : (
                  <Paragraph style={{ color: "red" }}>
                    Above 40,000 executions/month → Enterprise Plan required (custom pricing)
                  </Paragraph>
                )}
              </Card>
            </div>
          </Col>
          <Col xs={24} md={12} style={{ position: "relative" }}>
            <div style={{ position: "relative" }}>
              {winner === "Self-Hosting" && (
                <span style={{ position: "absolute", top: -24, right: -24, zIndex: 2, animation: "trophyBounce 1s infinite alternate" }}>
                  <TrophyOutlined style={{ fontSize: 56, color: "#cf1322", filter: "drop-shadow(0 2px 8px #cf132288)" }} />
                </span>
              )}
              <Card bordered={false} style={{ background: "#fff1f0", marginBottom: 16 }}>
                <Title level={4} style={{ color: "#cf1322" }}><WindowsOutlined /> Self-Hosting</Title>
                <Paragraph>Full control, privacy, advanced users.</Paragraph>
                <div style={{ marginBottom: 12 }}>
                  <span>Compute ($/mo): </span>
                  <InputNumber min={0} value={compute} onChange={setCompute} style={{ width: 80 }} />
                  <br />
                  <span>Database ($/mo): </span>
                  <InputNumber min={0} value={db} onChange={setDb} style={{ width: 80 }} />
                  <br />
                  <span>Bandwidth (GB): </span>
                  <InputNumber min={0} value={bandwidthGb} onChange={setBandwidthGb} style={{ width: 80 }} />
                  <br />
                  <span>Bandwidth Price ($/GB): </span>
                  <InputNumber min={0} step={0.01} value={bandwidthPrice} onChange={setBandwidthPrice} style={{ width: 80 }} />
                </div>
                <Table
                  dataSource={selfHostData}
                  columns={[
                    { title: "Service", dataIndex: "service", key: "service" },
                    { title: "Cost (monthly)", dataIndex: "cost", key: "cost" },
                  ]}
                  pagination={false}
                  size="small"
                  style={{ marginTop: 8 }}
                />
              </Card>
            </div>
          </Col>
        </Row>
        <style>{`
          @keyframes trophyBounce {
            0% { transform: scale(1) translateY(0); }
            100% { transform: scale(1.15) translateY(-8px); }
          }
        `}</style>
      </Card>

      {/* Footer */}
      <footer style={{ textAlign: "center", marginTop: 48, color: "#888" }}>
        Made with ❤️ and a bit of ☕ by AutomateJoy
      </footer>
    </div>
  );
}
