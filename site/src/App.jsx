import React from "react";
import { Helmet } from "react-helmet";
import { Card, Typography, List, Space, Button, Row, Col, Image } from "antd";
import {
  WindowsOutlined,
  AppleOutlined,
  CloudOutlined,
  RocketOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Link, Text } = Typography;

import imgReady from "./assets/automatejoy-ready.png";
import imgInstall from "./assets/automatejoy-install.png";

const images = [
  {
    src: imgInstall,
    title: "AutomateJoy — Install Progress",
    // desc: "Shows the loading progress during installation."
  },
  {
    src: imgReady,
    title: "AutomateJoy — Ready Screen",
    // desc: "Displayed when the app is ready for browser launch."
  }
];

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
          <Paragraph style={{ lineHeight: '1.7', fontSize: '18px' }}>
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
            <List.Item style={{ lineHeight: '1.7', fontSize: '18px' }}>
              <Space>
              <CloudOutlined />
              <Link href="https://n8n.partnerlinks.io/li25lnhmcj8f" target="_blank" rel="noreferrer">
                Try the free cloud trial on n8n.io
              </Link>
              </Space>
            
            </List.Item>
            <List.Item style={{ lineHeight: '1.7', fontSize: '18px' }}>
              <WindowsOutlined style={{ marginRight: 8 }} />
              Or download installers below, just click and start building !
            </List.Item>
          </List>
        </Card>

        {/* <Row gutter={[24, 24]} justify="center">
        {images.map((img, idx) => (
          <Col xs={24} sm={12} md={8} key={idx}>
            <Image
                  // alt={img.title}
                  src={img.src}
                  style={{
                    borderRadius: "16px",
                    width: "300px",
                    height: "300px"
                  }}
                  preview={true}
                />
          </Col>
        ))}
      </Row> */}

      

      
      

        <div style={{ textAlign: "center" }}>
          
          <Row justify="center" gutter={[16, 16]}>
            <Col>
              <Button
                type="primary"
                icon={<WindowsOutlined />}
                href="https://github.com/newcl/AutomateJoy/releases/download/v1.0.0-win-x64/AutomateJoy-Setup-1.0.0-win-x64.exe"
                target="_blank"
                rel="noreferrer"
                size="large"
              >
                Windows X64
              </Button>
            </Col>
            <Col>
            
            <Button
                type="primary"
                icon={<AppleOutlined />}
                href="https://github.com/newcl/AutomateJoy/releases/download/v1.0.1-mac-arm64/AutomateJoy-1.0.1-mac-arm64-arm64.dmg"
                target="_blank"
                rel="noreferrer"
                size="large"
                
              >
                Mac (Apple Silicon)
              </Button>
    
              
            </Col>
            <Col>
            
            <Button
                type="primary"
                icon={<AppleOutlined />}
                href="https://github.com/newcl/AutomateJoy/releases/download/v1.0.0-mac-x64/AutomateJoy-1.0.0-mac-x64.dmg"
                target="_blank"
                rel="noreferrer"
                size="large"
                
              >
                Mac (Intel X64)
              </Button>
    
              
            </Col>
          </Row>
        </div>

        <div style={{ textAlign: "center" }}>
          <Space style={{ marginTop: 24 }}>
            <Title level={4}>Screenshots</Title>
            </Space>
        
<Row gutter={[24, 24]} justify="center">
        {images.map((img, idx) => (
          <Col xs={24} sm={12} md={80} key={idx}>
            <Image
                  alt={img.title}
                  src={img.src}
                  style={{
                    borderRadius: "8px",
                  }}
                  preview={true}
                />
          </Col>
        ))}
      </Row>
      </div>

        {/* Feedback Button - fixed to right side, larger and visually pleasing */}
      <div style={{ position: "fixed", top: "60%", right: 24, zIndex: 1000 }}>
        <Button
          type="primary"
          href="mailto:chenliang.info@gmail.com?subject=AutomateJoy%20Feedback"
          style={{
            boxShadow: "0 4px 16px #8883",
            borderRadius: 32,
            padding: "18px 32px",
            fontWeight: 600,
            fontSize: "1.15rem",
            background: "linear-gradient(90deg, #36d1c4 0%, #5b86e5 100%)",
            border: "none",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}
          icon={<span style={{fontSize: "1.5rem"}}>💬</span>}
        >
          Send Feedback
        </Button>
      </div>

        <footer style={{ textAlign: "center", marginTop: 48, color: "#888" }}>
          Made with ❤️ and a bit of ☕ by AutomateJoy
        </footer>
      </div>
    </>
  );
}