# United Telegram Bot - Cryptocurrency & Radio Stations

A unified Telegram bot application that combines cryptocurrency price monitoring (Bitcoin & Solana) with radio station streaming capabilities. Built with Node.js, Express, MongoDB, and ES6 modules.

## Features

### 🪙 Cryptocurrency Monitoring
- Real-time price tracking for Bitcoin (BTC) and Solana (SOL)
- Automatic price alerts based on significant changes
- Integration with CoinMarketCap API
- 24h, 7d price change statistics
- Scheduled monitoring every 20 minutes

### 📻 Radio Stations
- Access to 60+ international radio stations
- Favorite stations management
- Web app integration via Telegram miniapp
- RESTful API for external frontend

### 🤖 Telegram Bot
- Unified bot interface for both features
- Interactive keyboard buttons
- User management with MongoDB
- Automatic user registration

## Project Structure

```
├── src/
│   ├── index.js                    # Main entry point
│   ├── config/
│   │   ├── database.js            # MongoDB connection
│   │   ├── dbSeed.js              # Radio stations seed data
│   │   └── bot.js                 # Telegram bot instance
│   ├── features/
│   │   ├── crypto/                # Cryptocurrency feature
│   │   │   ├── crypto.service.js
│   │   │   ├── crypto.controller.js
│   │   │   └── crypto.repository.js
│   │   ├── radio/                 # Radio feature
│   │   │   ├── stations/
│   │   │   │   ├── stations.service.js
│   │   │   │   ├── stations.controller.js
│   │   │   │   ├── stations.repository.js
│   │   │   │   └── stations.router.js
│   │   │   └── radioUsers/
│   │   │       ├── radioUsers.service.js
│   │   │       ├── radioUsers.controller.js
│   │   │       ├── radioUsers.repository.js
│   │   │       └── radioUsers.router.js
│   │   └── users/                 # Common users management
│   │       ├── users.service.js
│   │       └── users.repository.js
│   ├── adapters/
│   │   └── telegram.js            # Bot message handlers
│   ├── server/
│   │   └── app.js                 # Express app
│   ├── utils/
│   │   ├── priceMonitor.js        # Price fetching
│   │   └── fileStorage.js         # JSON file operations
│   └── constants/
│       ├── currency.js            # Crypto symbols
│       └── messages.js            # Bot messages
├── json_db/                       # JSON storage for crypto data
│   ├── BTC_data.json
│   └── SOL_data.json
├── assets/                        # Images for bot messages
├── k3s/                          # Kubernetes configs
├── Dockerfile
├── docker-compose.yaml
└── package.json
```

## Installation

### Prerequisites
- Node.js 18+
- MongoDB
- Telegram Bot Token
- CoinMarketCap API Key

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd tg-btc-assistant_bot
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (see `env.example.txt`):
```env
TG_BOT_TOKEN=your_telegram_bot_token
COINMARKET_API_KEY=your_coinmarketcap_api_key
MONGO_URL=mongodb://localhost:27017
DB_NAME=radio_bot
WEB_APP_URL=https://your-radio-app-url.com
PORT=5000
```

4. Start MongoDB:
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or use your local MongoDB installation
```

5. Run the application:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Usage

### Telegram Bot Commands

- `/start` - Initialize bot and show main menu
- `💎 BTC 💎` - Get current Bitcoin price
- `💎 SOL 💎` - Get current Solana price
- `🔥 Listen radio 🔥` - Open radio miniapp
- `🔄 Reload bot` - Refresh keyboard

### API Endpoints

#### Radio Stations
- `GET /stations` - Get all radio stations
- `POST /stations` - Add a new station

#### User Favorites
- `GET /users/:user_id/favorites` - Get user's favorite stations
- `POST /users/:user_id/addFavorites` - Add station to favorites
- `POST /users/:user_id/removeFavorites` - Remove station from favorites

## Docker Deployment

### Using Docker Compose

```bash
docker-compose up -d
```

### Using Kubernetes (k3s)

```bash
kubectl apply -f k3s/namespace.yaml
kubectl apply -f k3s/configmap.yaml
kubectl apply -f k3s/secret.yaml
kubectl apply -f k3s/pvc.yaml
kubectl apply -f k3s/deployment.yaml
kubectl apply -f k3s/service.yaml
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `TG_BOT_TOKEN` | Telegram Bot API token | Yes |
| `COINMARKET_API_KEY` | CoinMarketCap API key | Yes |
| `MONGO_URL` | MongoDB connection string | Yes |
| `DB_NAME` | MongoDB database name | Yes |
| `WEB_APP_URL` | Radio web app URL for miniapp | Yes |
| `PORT` | Express server port | No (default: 5000) |

## Architecture

### Data Flow

1. **User Registration**: When a user sends `/start`, they're automatically added to MongoDB
2. **Crypto Price Request**: User clicks BTC/SOL → Controller → Service → CoinMarketCap API → Compare with JSON → Send message
3. **Radio Miniapp**: User clicks radio button → Telegram opens web app with user's chat ID
4. **Scheduled Monitoring**: Every 20 minutes → Check prices → Compare with saved data → Send alerts to all users if significant change
5. **Radio API**: External frontend → Express routes → Controllers → Services → MongoDB

### Database Collections

#### users
```javascript
{
  chat_id: String,
  first_name: String,
  username: String,
  favorites: [{ radio_id: String }]
}
```

#### stations
```javascript
{
  title: String,
  location: String,
  genre: String,
  img: String,
  url: String
}
```

### Cryptocurrency Data (JSON)
Stored in `json_db/` folder:
```javascript
{
  currentPrice: Number,
  usdQuote: {
    price: Number,
    volume_24h: Number,
    percent_change_1h: Number,
    percent_change_24h: Number,
    percent_change_7d: Number,
    // ... more fields
  }
}
```

## Technologies

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database for users and stations
- **node-telegram-bot-api** - Telegram Bot API
- **Axios** - HTTP client for CoinMarketCap API
- **ES6 Modules** - Modern JavaScript syntax
- **Docker** - Containerization
- **Kubernetes** - Orchestration

## Author

Kazlou Pavel

## License

ISC
