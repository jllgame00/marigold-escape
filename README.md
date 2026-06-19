# React + Vite

## Firebase ranking configuration

Install dependencies and copy `.env.example` to `.env`, then fill in the
Firebase web app configuration values.

```bash
npm install
```

The ranking data is stored by Korea Standard Time date at
`rankings/{YYYY-MM-DD}/records/{recordId}`. The client reads only the current
Korea date and orders records by `clearTimeMs` ascending.

Do not commit `.env`. Configure Firestore Security Rules separately in the
Firebase console. Production rules should validate the allowed fields and
types, restrict reads to ranking records, and prevent update/delete operations
from the client.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
