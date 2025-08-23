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
import { CoffeeOutlined } from "@ant-design/icons";
import BuyMeACoffeeButton from "./BMC";

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
        {/* Hero Section with SEO-friendly messaging */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Title level={1} style={{ fontSize: "2.8rem", color: "#1890ff", marginBottom: 0 }}>
            <RocketOutlined style={{ marginRight: 12, color: "#ff9800" }} />
            Try n8n Instantly
            <RocketOutlined style={{ marginLeft: 12, color: "#ff9800" }} />
          </Title>
          <Paragraph style={{ fontSize: "1.25rem", color: "#595959", marginTop: 8 }}>
            <b>Finally, a true Windows <span style={{color:'#1890ff'}}>.exe</span> and Mac <span style={{color:'#faad14'}}>.dmg</span> installer for n8n!</b><br/>
            With AutomateJoy, you get a real 1-click installer for n8n—no Node.js, npm, or Docker required. Just download, run, and start automating.
          </Paragraph>
        </div>

        {/* <Card style={{ marginBottom: 24 }}>
          <Title level={4}>What’s n8n?</Title>
          <Paragraph style={{ lineHeight: '1.7', fontSize: '18px' }}>
            n8n is like your personal automation wizard{" "}
            <RocketOutlined /> — it connects all your apps and services together,
            so boring, repetitive tasks just… disappear. AutomateJoy makes this powerful
            open-source workflow automation tool available as a simple desktop app for Mac and Windows,
            so you don't need to be tech-savvy to get started.
          </Paragraph>
        </Card> */}

        <Card style={{ marginBottom: 32, background: "#f6faff", border: "1px solid #e6f7ff" }}>
          <Title level={3} style={{ color: "#1890ff" }}>Try n8n for free with 1-click installer</Title>
          <Space>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center", marginTop: "24px", marginBottom: "8px" }}>
            <div style={{ position: "relative" }}>
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
              <span style={{ position: "absolute", top: -18, right: -8, background: "#1890ff", color: "#fff", borderRadius: 8, padding: "2px 10px", fontSize: 13, fontWeight: 600, boxShadow: "0 2px 8px #1890ff88" }}>1-Click .exe Installer</span>
            </div>
            <div style={{ position: "relative" }}>
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
              <span style={{ position: "absolute", top: -18, right: -8, background: "#faad14", color: "#fff", borderRadius: 8, padding: "2px 10px", fontSize: 13, fontWeight: 600, boxShadow: "0 2px 8px #36d1c488" }}>1-Click .dmg Installer</span>
            </div>
            <div style={{ position: "relative" }}>
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
              <span style={{ position: "absolute", top: -18, right: -8, background: "#faad14", color: "#fff", borderRadius: 8, padding: "2px 10px", fontSize: 13, fontWeight: 600, boxShadow: "0 2px 8px #36d1c488" }}>1-Click .dmg Installer</span>
            </div>
            
            {/* <Button type="primary" style={{ minWidth: 170, background: "linear-gradient(90deg, #ff9800 0%, #ff5722 100%)", border: "none", color: "#fff", boxShadow: "0 2px 8px rgba(255, 152, 0, 0.15)", fontWeight: 600, position: "relative" }} href="https://n8n.partnerlinks.io/li25lnhmcj8f" target="_blank" rel="noreferrer" icon={<span style={{marginRight:4}}>🌐</span>}>
              Free Trial on n8n.com
              <span style={{ position: "absolute", top: 6, right: 12, fontSize: 12, color: "#fff", background: "#ff5722", borderRadius: 6, padding: "2px 8px", fontWeight: 500 }}>External</span>
            </Button> */}
          </div>
          </Space>
          <Paragraph style={{ marginTop: 16, color: '#595959', fontSize: '1rem' }}>
            <b>No Docker, no NodeJS, no Database setup, no endless tutorials, just click and go!</b>
          </Paragraph>
        </Card>

        <Card style={{ marginBottom: 24, background: "#f6faff", border: "1px solid #e6f7ff" }}>
          <Title level={3} style={{ color: "#1890ff" }}>Or You Can Try Hosted n8n Service</Title>
          <Space>
              <Button type="primary" style={{ minWidth: 170, background: "linear-gradient(90deg, #ff9800 0%, #ff5722 100%)", border: "none", color: "#fff", boxShadow: "0 2px 8px rgba(255, 152, 0, 0.15)", fontWeight: 600, position: "relative" }} href="https://n8n.partnerlinks.io/li25lnhmcj8f" target="_blank" rel="noreferrer" icon={<span style={{marginRight:4}}>🌐</span>}>
              Start Free Trial On n8n.com
              {/* <span style={{ position: "absolute", top: 6, right: 12, fontSize: 12, color: "#fff", background: "#ff5722", borderRadius: 6, padding: "2px 8px", fontWeight: 500 }}>n8n.com</span> */}
            </Button>
              </Space>
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

      

      
      

        {/* <div style={{ textAlign: "center" }}>
          
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
        </div> */}

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

        {/* Buy Me a Coffee Button - fixed to right side, above feedback button */}
        <div style={{ position: "fixed", top: "56%", right: 24, zIndex: 1000 }}>
          <Button
            type="primary"
            href="https://www.buymeacoffee.com/chelan"
            target="_blank"
            style={{
              boxShadow: "0 4px 16px #ffdd0088",
              borderRadius: 32,
              padding: "18px 32px",
              fontWeight: 600,
              fontSize: "1.15rem",
              background: "linear-gradient(90deg, #FFDD00 0%, #FFD700 100%)",
              border: "none",
              color: "#000",
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}
            icon={<CoffeeOutlined style={{fontSize: "1.5rem"}} />}
          >
            Buy Me a Coffee
          </Button>
        </div>

        {/* Feedback Button - fixed to right side, below coffee button */}
        <div style={{ position: "fixed", top: "68%", right: 24, zIndex: 1000 }}>
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