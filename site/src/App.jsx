import React from "react";
import { Helmet } from "react-helmet";
import { Card, Typography, List, Space, Button, Row, Col, Badge } from "antd";
import {
  WindowsOutlined,
  AppleOutlined,
  CloudOutlined,
  RocketOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Link, Text } = Typography;

export default function App() {
  return (
    <>
      <Helmet>
        <title>n8n Desktop App | AutomateJoy | Easy Automation for Mac & Windows</title>
        <meta
          name="description"
          content="Experience n8n without the hassle. AutomateJoy provides a simple desktop app for Mac and Windows, making open-source workflow automation easy and accessible for everyone."
        />
      </Helmet>

      <div style={{ maxWidth: 720, margin: "2rem auto", padding: "0 1rem" }}>
        <Title level={1} style={{ textAlign: "center" }}>
          <Space>
            <RocketOutlined />
            Automate with n8n
            <RocketOutlined />
          </Space>
        </Title>

        <Card style={{ marginBottom: 24 }}>
          <Title level={4}>What’s n8n?</Title>
          <Paragraph style={{ lineHeight: '1.6' }}>
            n8n is like your personal automation wizard{" "}
            <RocketOutlined /> — it connects all your apps and services together,
            so boring, repetitive tasks just… disappear. AutomateJoy makes this powerful
            open-source workflow automation tool available as a simple desktop app for Mac and Windows,
            so you don't need to be tech-savvy to get started. Think Zapier, but
            open-source and way more flexible.
          </Paragraph>
        </Card>

        <Card style={{ marginBottom: 24 }}>
          <Title level={4}>How to try it</Title>
          <List>
            <List.Item style={{ lineHeight: '1.6' }}>
              <CloudOutlined style={{ marginRight: 8 }} />
              <Link href="https://n8n.io" target="_blank" rel="noreferrer">
                Try the free cloud trial on n8n.io
              </Link>
            </List.Item>
            <List.Item style={{ lineHeight: '1.6' }}>
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
                href="https://github.com/newcl/AutomateJoy/releases/latest/download/AutomateJoy-Setup-1.0.0.exe"
                target="_blank"
                rel="noreferrer"
                size="large"
              >
                Windows
              </Button>
            </Col>
            <Col>
            <Badge count="Coming Soon" color="#faad14" offset={[10, 0]}>
            <Button
                type="primary"
                icon={<AppleOutlined />}
                href="https://github.com/newcl/AutomateJoy/releases/latest/download/AutomateJoy-1.0.0.dmg"
                target="_blank"
                rel="noreferrer"
                size="large"
                disabled
              >
                Mac
              </Button>
    </Badge>
              
            </Col>
          </Row>
        </div>

        <footer style={{ textAlign: "center", marginTop: 48, color: "#888" }}>
          Made with ❤️ and a bit of ☕ by AutomateJoy
        </footer>
      </div>
    </>
  );
}