import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Card, Typography, List, Space, Button, Row, Col, Image, Divider, Collapse } from "antd";
import {
  WindowsOutlined,
  AppleOutlined,
  CloudOutlined,
  RocketOutlined,
} from "@ant-design/icons";

const { Panel } = Collapse;


const { Title, Paragraph, Link, Text } = Typography;

import imgReady from "./assets/automatejoy-ready.png";
import imgInstall from "./assets/automatejoy-install.png";
import { CoffeeOutlined } from "@ant-design/icons";

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
  const [showPopup, setShowPopup] = useState(false);

  const handleDownload = (url) => {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

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
        <div style={{ textAlign: "left", marginBottom: 36 }}>
          <Space/>
          {/* <Title level={1} style={{ fontSize: "2.8rem", color: "#1890ff", marginBottom: 0 }}>
            <RocketOutlined style={{ marginRight: 12, color: "#ff9800" }} />
            Try n8n Instantly
            <RocketOutlined style={{ marginLeft: 12, color: "#ff9800" }} />
          </Title> */}
          <Paragraph style={{ fontSize: "1.25rem", color: "#595959", marginTop: 8 }}>
            AutomateJoy is an 1-click installer to install n8n on your Windows and Mac PC, start automating NOW without installing anything.
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
                onClick={() => handleDownload("https://github.com/newcl/AutomateJoy/releases/download/v1.0.2-n8n1.105.4-win-x64/AutomateJoy-Setup-1.0.2-n8n1.105.4-win-x64.exe")}
                size="large"
              >
                Windows X64
              </Button>
              {/* <span style={{ position: "absolute", top: -18, right: -8, background: "#1890ff", color: "#fff", borderRadius: 8, padding: "2px 10px", fontSize: 13, fontWeight: 600, boxShadow: "0 2px 8px #1890ff88" }}>1-Click .exe Installer</span> */}
            </div>
            <div style={{ position: "relative" }}>
              <Button
                type="primary"
                icon={<AppleOutlined />}
                onClick={() => handleDownload("https://github.com/newcl/AutomateJoy/releases/download/v1.0.1-mac-arm64/AutomateJoy-1.0.1-mac-arm64-arm64.dmg")}
                size="large"
              >
                Mac (Apple Silicon)
              </Button>
              {/* <span style={{ position: "absolute", top: -18, right: -8, background: "#faad14", color: "#fff", borderRadius: 8, padding: "2px 10px", fontSize: 13, fontWeight: 600, boxShadow: "0 2px 8px #36d1c488" }}>1-Click .dmg Installer</span> */}
            </div>
            <div style={{ position: "relative" }}>
              <Button
                type="primary"
                icon={<AppleOutlined />}
                onClick={() => handleDownload("https://github.com/newcl/AutomateJoy/releases/download/v1.0.0-mac-x64/AutomateJoy-1.0.0-mac-x64.dmg")}
                size="large"
              >
                Mac (Intel X64)
              </Button>
              {/* <span style={{ position: "absolute", top: -18, right: -8, background: "#faad14", color: "#fff", borderRadius: 8, padding: "2px 10px", fontSize: 13, fontWeight: 600, boxShadow: "0 2px 8px #36d1c488" }}>1-Click .dmg Installer</span> */}
            </div>
        {showPopup && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(255,255,255,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000
          }}>
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              boxShadow: '0 2px 16px rgba(0,0,0,0.15)',
              padding: '32px',
              textAlign: 'center',
              minWidth: '320px'
            }}>
              <div style={{ fontSize: '1.2em', color: '#555', marginBottom: '16px' }}>
                My daughter said "you should buy my dad a cup of coffee 😅"
              </div>
              <a
                href="https://www.buymeacoffee.com/chelan"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  background: '#FFDD00',
                  color: '#333',
                  fontWeight: 'bold',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  marginBottom: '12px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                }}
              >
                Buy Me a Cup of Coffee
              </a>
              <div>
                <button onClick={handleClosePopup} style={{ marginTop: '16px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1em' }}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
            
            {/* <Button type="primary" style={{ minWidth: 170, background: "linear-gradient(90deg, #ff9800 0%, #ff5722 100%)", border: "none", color: "#fff", boxShadow: "0 2px 8px rgba(255, 152, 0, 0.15)", fontWeight: 600, position: "relative" }} href="https://n8n.partnerlinks.io/li25lnhmcj8f" target="_blank" rel="noreferrer" icon={<span style={{marginRight:4}}>🌐</span>}>
              Free Trial on n8n.com
              <span style={{ position: "absolute", top: 6, right: 12, fontSize: 12, color: "#fff", background: "#ff5722", borderRadius: 6, padding: "2px 8px", fontWeight: 500 }}>External</span>
            </Button> */}
          </div>
          </Space>
          
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

        <Divider orientation="left" plain>
          <b style={{ fontSize: 24 }}>FAQ</b>
          </Divider>

          <Collapse accordion>
          <Panel header="What is this AutomateJoy app ?" key="1">
            <p>AutomateJoy is a simple electron app that packages all the stuff needed to run n8n on your PC, ChatGPT helped to pick this name so that's that.</p>
            <p>Below are some screenshots after installing the app, you could access n8n through your favourite browser.</p>
            <div style={{ textAlign: "center" }}>
          
        
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
          </Panel>
          <Panel header="Who built this AutomateJoy app 🚧 ?" key="2">
            <p> My name is <a href="https://www.linkedin.com/in/angelleecash/">Liang Chen</a>, I am a software engineer 🧑‍💻, I think n8n is a very awesome productivity tool and people should benefit a lot from automating everyday tasks, and n8n is very generous to allow people to run n8n on your PC, but I can see people without tech background struggling to install this on their computer especially on windows, so I built this vibe coding style 😎 .</p>
          </Panel>
          <Panel header="Is this computer virus ? I'm not trusting some random dude on the internet 🕵️‍♂️" key="3">
            <p>It's always a good idea to be cautious about something you download from the internet. The code for this app is <a href="https://github.com/newcl/AutomateJoy">available here</a>, so if you know tech well enough you can build executables (.exe/.dmg) from the code directly. If you can not build from source code I recommend you scan the .exe/.dmg before running anything to stay safe 🙌.</p>
          </Panel>
          <Panel header="Nice try, I still don't believe you or your app 🤪" key="4">
            <p>Nice people from <a href="https://n8n.partnerlinks.io/li25lnhmcj8f" >n8n.com offers free trial</a> so you can start automating without installing anything or trusting anybody blindly.</p>
            <Space>
              <Button type="primary" style={{ minWidth: 170, background: "linear-gradient(90deg, #ff9800 0%, #ff5722 100%)", border: "none", color: "#fff", boxShadow: "0 2px 8px rgba(255, 152, 0, 0.15)", fontWeight: 600, position: "relative" }} href="https://n8n.partnerlinks.io/li25lnhmcj8f" target="_blank" rel="noreferrer" icon={<span style={{marginRight:4}}>🌐</span>}>
              Start Free Trial On n8n.com
              {/* <span style={{ position: "absolute", top: 6, right: 12, fontSize: 12, color: "#fff", background: "#ff5722", borderRadius: 6, padding: "2px 8px", fontWeight: 500 }}>n8n.com</span> */}
            </Button>
              </Space>
          </Panel>
          <Panel header="Okay, I feel generous 🎁 today to try your app, how do I use it ?" key="5">
            <p>The app is a 1 click installer for Windows and Mac, just download it and click it, that's it.</p>
            
          </Panel>
          <Panel header="How do I upgrade n8n through your app ⬆️ ?" key="6">
            <p>This electron app is bundled a specific version of n8n so you can not directly upgrade it, this also proves the value of the hosted version on n8n.com if constantly upgrading the software is mandatory for you, consider n8n.com.</p>
            <Space>
              <Button type="primary" style={{ minWidth: 170, background: "linear-gradient(90deg, #ff9800 0%, #ff5722 100%)", border: "none", color: "#fff", boxShadow: "0 2px 8px rgba(255, 152, 0, 0.15)", fontWeight: 600, position: "relative" }} href="https://n8n.partnerlinks.io/li25lnhmcj8f" target="_blank" rel="noreferrer" icon={<span style={{marginRight:4}}>🌐</span>}>
              Start Free Trial On n8n.com
              {/* <span style={{ position: "absolute", top: 6, right: 12, fontSize: 12, color: "#fff", background: "#ff5722", borderRadius: 6, padding: "2px 8px", fontWeight: 500 }}>n8n.com</span> */}
            </Button>
              </Space>
          </Panel>
          <Panel header="Okay, you seem like a good guy, how do I thank you for your time ❤️ ?" key="7">
            
            <Space>
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
          </Button> So I can put my kids through college and I don't need to beg people for money 🙈.
              </Space>
          </Panel>
          <Panel header="Your app works pretty good, can you help me with other software work ?" key="8">
            <p>Yes, you can reach me at chenliang.info@gmail.com.</p>
            
          </Panel>
        </Collapse>

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
