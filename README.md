# WhatsApp Web Connector for Dynamics 365 🚀

![Status](https://img.shields.io/badge/Status-Development-yellow) ![Tech](https://img.shields.io/badge/Stack-React_|_TypeScript_|_Vite-blue)

A professional Chrome Extension (Manifest V3) designed to bridge the gap between **WhatsApp Web** and **Microsoft Dynamics 365 Sales**. This Micro-SaaS tool allows sales representatives to save conversation history, manage leads, and view CRM data without leaving the WhatsApp interface.

## 🎯 Project Goal
To solve the "black box" problem of sales communications on WhatsApp by providing a seamless, side-panel integration that connects the browser DOM directly to the Dynamics 365 Web API using OAuth 2.0.

## 🛠 Tech Stack
* **Core:** React 18, TypeScript
* **Build Tool:** Vite (w/ CRXJS Plugin)
* **Manifest:** V3
* **Styling:** TailwindCSS
* **State Management:** Context API / Zustand
* **Auth:** Microsoft Entra ID (Azure AD) OAuth 2.0 Flow
* **Backend Strategy:** Serverless (Azure Functions) for licensing & Direct Web API calls for CRM data.

## ⚡ Key Features (MVP)
* **DOM Observer:** Intelligent scraping of WhatsApp Web to detect active chat context.
* **Context Awareness:** Automatically checks if the phone number exists in Dynamics 365.
* **Quick Actions:** Create Leads or Contacts directly from the side panel.
* **Timeline Sync:** Save selected messages as "Notes" in the Dynamics 365 Timeline.

## 📂 Architecture
This project uses a "Extension-First" architecture. Instead of a heavy middleware, the extension acts as a direct client to the Dynamics 365 instance, respecting user permissions and reducing infrastructure costs.

## 🚀 How to run locally
1. Clone the repo
2. `npm install`
3. Create a `.env` file based on `.env.example` (You need your own Azure AD App Registration)
4. `npm run dev`
5. Load the `dist` folder as an unpacked extension in Chrome.

---
*Developed by Emanuel Arrudas de Macêdo*
