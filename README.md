# 🔤 Emoji Translator 😀

A fun, multilingual text-to-emoji translator. Convert text to emojis and emojis back to text!

**Live Demo:** [emoji-translator.vercel.app](https://emoji-translator.vercel.app)

## ✨ Features

- **Bidirectional Translation:** Text → Emoji and Emoji → Text
- **Multilingual Support:** 9 languages (EN, ES, FR, DE, ZH, JA, KO, AR, TR)
- **Interactive Dictionary:** Browse and search 500+ emoji mappings
- **Blog:** Educational content about emojis
- **Docker Ready:** Deploy anywhere with Docker
- **Beautiful UI:** Gradient design with smooth animations

## 🚀 Quick Start

### Development

```bash
# Clone the repository
git clone https://github.com/devmahdi/emoji-translator.git
cd emoji-translator

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## 🐳 Docker Deployment

### Using Docker

```bash
# Build the image
docker build -t emoji-translator .

# Run the container
docker run -p 3000:3000 emoji-translator
```

### Using Docker Compose

```bash
# Start the service
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the service
docker-compose down
```

## ⚙️ Environment Variables

Copy `.env.example` to `.env.local` and configure:

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_SITE_URL` | Your site URL | `https://emoji-translator.com` |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID | - |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | Default language | `en` |

## 📁 Project Structure

```
emoji-translator/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main translator page
│   │   ├── blog/             # Blog pages
│   │   └── privacy/          # Privacy policy
│   └── lib/
│       ├── emoji-dictionary.ts   # Emoji mappings
│       └── i18n/
│           └── translations.ts   # Multilingual strings
├── Dockerfile
├── docker-compose.yml
└── .env.example
```

## 🌐 Supported Languages

| Code | Language |
|------|----------|
| en | English |
| es | Español |
| fr | Français |
| de | Deutsch |
| zh | 中文 |
| ja | 日本語 |
| ko | 한국어 |
| ar | العربية |
| tr | Türkçe |

## 🛠️ Tech Stack

- **Framework:** Next.js 14
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Deployment:** Vercel / Docker

## 📄 License

MIT License - feel free to use this project for any purpose.

---

Made with ❤️ and lots of 😀
