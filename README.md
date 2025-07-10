# 📝 Notes‑Front

A clean, responsive front‑end for a note‑taking app, built to pair with a complementary back‑end (e.g. **notes‑api**). Designed with usability and developer experience in mind.

## 🔥 Features

- ✏️ Create, read, update, and delete notes (CRUD functionality).
- Responsive UI with support for desktop and mobile.
- User authentication & authorization (via secure cookies + JWT).
- Role-based access control (e.g. admin panel visibility).
- Reusable components and dialogs (e.g. modals, inputs).

## 🚀 Tech Stack

- Framework: **Next.js 13+ App Router** with TypeScript
- Styling: **Tailwind CSS**
- State Management: **React Context API**
- UI Components: **shadcn/ui** (Headless UI + Radix)
- Auth: JWT in **httpOnly cookies**, validated with backend
- API Calls: Native **fetch** to internal Next.js route handlers

## 🧩 Project Structure

```none
notes-front/
├── public/               # Static files like favicon.ico
├── src/
│   ├── app/              # App Router: routes and layouts
│   │   ├── (auth)/       # login, register, logout pages
│   │   ├── (notes)/      # dashboard and notes pages
│   │   ├── api/          # Route handlers (login, notes CRUD)
│   │   ├── register/     # Standalone register handler
│   │   ├── user/         # Current user route handler
│   ├── components/       # Reusable React components
│   │   ├── ui/           # Common UI pieces (modals, buttons)
│   ├── contexts/         # Auth context provider
│   ├── lib/              # Shared backend helpers (e.g. auth)
│   ├── utils/            # General helpers or constants
│   ├── globals.css       # Global styles (Tailwind base)
│   └── layout.tsx        # App-wide layout structure
├── .env                  # Environment variables
├── package.json          # Dependencies & scripts
└── README.md
```

## 💻 Installation

1. **Clone the repo**  

   ```bash
   git clone https://github.com/LeonelMadrid13/notes-front.git
   cd notes-front
   ```

2. **Install dependencies**  

   ```bash
   npm install
   # or
   yarn
   ```

3. **Configure environment**  
   Create a `.env` file:

   ```env
   API_URL=https://your-notes-api.com
   ```

4. **Run the development server**  

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Available Commands

| Script         | Description                                 |
|----------------|---------------------------------------------|
| `dev`          | Start local development server              |
| `build`        | Build the app for production                |
| `start`        | Run the production build                    |
| `lint`         | Run ESLint                                 |

## 📦 Deployment

- Deploy easily to **Vercel**, **Netlify**, or any Node.js-friendly platform.
- Ensure environment variables (e.g. `API_URL`) are configured in your host settings.

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository  
2. Create a branch (`git checkout -b feature/my-new-feature`)  
3. Commit your changes (`git commit -m "Add new feature"`)  
4. Push to the branch (`git push origin feature/my-new-feature`)  
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more info.

---

**Enjoy building with Notes‑Front!**
