# Invest Indicator Web Application



## Overview

A web application for monitoring investment status and market conditions.

It uses [Invest Indicator](https://github.com/ChoSanghyuk/invest_indicator) as its backend server and serves as middleware that visualizes information provided by Invest Indicator and enables user interaction with the server.



### Key Features

- Investment Status: Manage investment status by creating and organizing asset groups according to their purposes
- Watchlist Information: Manage price alerts for buy/sell prices of registered stocks
- Investment History: View investment history by asset group
- Market Indicators: Manage market indicators for reference such as Fear/Greed Index, market indices, High Yield Spread, etc.
- Investment Records: Record investment history (currently auto-recorded via securities/crypto exchange APIs)
- Events: Manage on/off settings for tasks such as gold/crypto kimchi premium, exchange airdrop notifications, Avalanche Swap transactions, etc.



### Sample Screenshots

:bulb: Screenshots when running in mock mode.

![image-20260311093309646](./assets/image-20260311093309646.png)



## Running the Application

### Environment Setup

- Create a `.env` file in the project root with variable values.
  - `VITE_USE_MOCK`: When true, runs in mock mode. When false, connects to the actual backend server
  - `VITE_API_BASE_URL`: Backend server URL
- Refer to the `.env.example` file to create your `.env` file.



### Execution

- Dev mode: `npm run dev`

- Build: `npm run build`

  

## Project Structure

```
invest_indicator_app/
├── src/                    # Main application source code
│   ├── pages/              # Page components (Login, Home, Assets, Market, etc.)
│   ├── components/         # Reusable UI components (Navigation, Modal, etc.)
│   ├── services/           # API communication and business logic (auth, asset, fund, market, etc.)
│   ├── context/            # Global state management via React Context (AuthContext)
│   ├── hooks/              # Custom React Hooks (useAuth, etc.)
│   ├── config/             # Configuration files (API settings, Mock/Real mode toggle)
│   ├── types/              # Data types and model definitions
│   ├── utils/              # Common utility functions
│   └── assets/             # Static resources (images, icons, etc.)
├── spec/                   # API and feature specifications
├── public/                 # Static files (served directly by Vite)
├── dist/                   # Build output (for production deployment)
├── assets/                 # Project documentation images
├── .env.example            # Environment variables template
└── vite.config.js          # Vite build configuration

```

### Key Directory Descriptions

- **src/pages/**: Page-specific components (LoginPage, HomePage, AssetsPage, MarketPage, InvestPage, etc.)
- **src/services/**: Service layer responsible for Backend API communication. Supports Mock/Real API modes
- **src/context/**: Global state management using React Context API (authentication state, etc.)
- **spec/**: Specifications defining Backend API contracts. Provides feature specifications for AI Agents
- **spec/common/**: Common specifications for types, authentication, and error handling applied to all APIs



### Deployment Error Cases

#### 403 forbidden
- Symptom: /var/log/nginx/error.log shows "*1 directory index of "/{mypath}/dist/assets/" is forbidden"
- Cause: Page path remains in the URL causing improper navigation. Works normally when entering home screen path. 

