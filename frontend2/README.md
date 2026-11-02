# React + Vite

## Live order notifications

The owner login page posts to `POST /login` on the existing `server2` service
on port `3000`. During development, Vite proxies this request to avoid browser
CORS restrictions. Start `server2.js` from its directory so it can find
`private.key`, then start this frontend with `npm run dev`. A successful login
stores the returned JWT as `ownerToken` and opens the dashboard.

For deployments without the Vite development proxy, set
`VITE_OWNER_LOGIN_URL` to the full login endpoint URL and configure the login
server to allow requests from the frontend origin.
To proxy development login requests to a different local port, set
`OWNER_LOGIN_SERVER_URL` before starting Vite; it defaults to
`http://localhost:3000`.

The owner dashboard connects to the backend's authenticated `GET /order/events`
SSE endpoint. The owner JWT must be available in local storage as `ownerToken`
Set `VITE_API_URL` to the backend origin when it is not `http://localhost:8000`.
Keep the Orders page or dashboard open to receive new orders and see the
notification badge in the header.

The customer checkout sends orders to `POST /order` with the customer session
JWT stored as `token`. The backend emits a live notification after it creates
the order.

Example local frontend environment setting:

```text
VITE_API_URL=http://localhost:8000
```

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
