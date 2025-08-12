import React from "react";
import { Card, Typography, List, Space, Button, Row, Col } from "antd";
import {
  WindowsOutlined,
  AppleOutlined,
  CloudOutlined,
  RocketOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Link, Text } = Typography;

export default function App() {
  return (
    <div style={{ maxWidth: 720, margin: "2rem auto", padding: "0 1rem" }}>
      <Title level={2} style={{ textAlign: "center" }}>
        <Space>
          <RocketOutlined />
          Automate with n8n
          <RocketOutlined />
        </Space>
      </Title>

      <Card style={{ marginBottom: 24 }}>
        <Title level={4}>What’s n8n?</Title>
        <Paragraph>
          n8n is like your personal automation wizard{" "}
          <RocketOutlined /> — it connects all your apps and services together,
          so boring repetitive tasks just… disappear. Think Zapier, but
          open-source and way more flexible.
        </Paragraph>
      </Card>

      <Card style={{ marginBottom: 24 }}>
        <Title level={4}>How to try it</Title>
        <List>
          <List.Item>
            <CloudOutlined style={{ marginRight: 8 }} />
            <Link href="https://n8n.io" target="_blank" rel="noreferrer">
              Try the free cloud trial on n8n.io
            </Link>
          </List.Item>
          <List.Item>
            <WindowsOutlined style={{ marginRight: 8 }} />
            Or run it locally with <Text strong>my Electron app</Text> (Windows +
            Mac). It’s still under construction, but you can already download
            the latest version below.
          </List.Item>
        </List>
      </Card>

      <div style={{ textAlign: "center" }}>
        <Title level={4}>Download</Title>
        <Row justify="center" gutter={[16, 16]}>
          <Col>
            <Button
              type="primary"
              icon={<WindowsOutlined />}
              href="https://github.com/newcl/pody/releases/latest/download/AutomateJoy-Setup-1.0.0.exe"
              target="_blank"
              rel="noreferrer"
              size="large"
            >
              Windows
            </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<AppleOutlined />}
              href="https://github.com/newcl/pody/releases/latest/download/AutomateJoy-1.0.0.dmg"
              target="_blank"
              rel="noreferrer"
              size="large"
            >
              Mac
            </Button>
          </Col>
        </Row>
      </div>

      <footer style={{ textAlign: "center", marginTop: 48, color: "#888" }}>
        Made with ❤️ and a bit of ☕ by AutomateJoy
      </footer>
    </div>
  );
}
