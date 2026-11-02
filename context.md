# Live Order Notification Development

## Goal

Connect customer order placement to the restaurant owner's dashboard so an owner
who has the dashboard open receives a live notification and can see the new
order without refreshing the page.

The flow spans both frontends and the Express backend:

1. A customer submits the checkout cart to the backend.
2. The backend creates the order and its order items in the database.
3. After successful creation, the backend publishes a `new-order` server-sent
   event (SSE).
4. An authenticated owner dashboard client receives the event, adds the order
   to shared frontend state, increments the notification badge, and displays
   the order on the Orders page.

## Components changed

### Customer frontend (`frontend/`)

`src/other/OrderSummary.jsx` implements checkout submission:

- Sends `POST /order` with JSON containing `orderType`, `paymentMode`, and
  `items` (`menuItemId` and `quantity`).
- Sends the customer-session JWT from local storage as the `Authorization`
  header. The existing customer login saves this token under `token`.
- Uses `VITE_API_URL` as the backend origin, defaulting to
  `http://localhost:8000`.
- Disables the submit button while the request is in progress and reports
  missing-session and server/network errors to the customer.
- On success, clears the cart and displays the returned order number and total.
- Calculates the displayed tax at 10%, matching the backend order service.

### Backend (`backend/`)

#### Order creation

`src/routes/order.routes.js` exposes the customer-protected `POST /order`
route. `src/controllers/order.controller.js` validates the request/session,
creates the order via `src/services/order.service.js`, then publishes it to
connected listeners.

The create service includes the order's item names, table number, and customer
name in its result so an event has enough data for the dashboard's notification
and order card.

#### SSE stream

`GET /order/events` is protected by the existing owner `auth` middleware.
Successful connections receive:

- `Content-Type: text/event-stream`
- An initial `connected` event
- A `new-order` event for each newly created order
- A comment heartbeat every 25 seconds to keep the connection alive

The event data is JSON containing the created order. The controller registers
the response with `src/services/orderEvents.service.js`; the service writes
events to active responses and unregisters disconnected clients. The SSE
response is closed and unsubscribed when the client disconnects.

#### Authentication

The owner route uses the existing `auth` middleware and its configured JWT
verification. The customer submission route uses `auth2_cust`, which requires a
customer-session JWT.

### Owner dashboard (`frontend2/`)

- `src/components/layout/OrderNotificationsProvider.jsx` owns one shared SSE
  connection around the application routes. It sends the owner JWT in the
  `Authorization` header, parses `new-order` frames, keeps the most recent 50
  orders, tracks unread notifications, reports connection status, and retries
  interrupted streams after a short delay.
- `src/context/OrderNotifications.js` exports the shared React context and hook.
- `src/components/layout/Header.jsx` shows a live notification badge and a
  dropdown with recent order summaries and connection status.
- `src/pages/Orders.jsx` displays live order cards with customer, table,
  items, status, timestamp, and total.

The owner JWT is read from local storage using `ownerToken`, with `token` as a
fallback. The dashboard currently has no owner login screen; an existing owner
login flow must store a JWT under one of these keys before the dashboard loads.
If the token is added after the provider has mounted, reload the dashboard so
the provider can start its connection.

## Configuration and running locally

The dashboard and customer frontend each default to a backend at
`http://localhost:8000`. Configure a different backend origin by setting
`VITE_API_URL` in the relevant frontend environment, for example:

```text
VITE_API_URL=http://localhost:8000
```

Run the backend and database as required by the existing project setup. Start
the customer app from `frontend/` and the owner dashboard from `frontend2/`.
Open the owner dashboard with a valid owner token already available in its
browser local storage. Keep the dashboard open while testing; only orders
created after an SSE client is connected are sent to that client.

## API contract

### Place an order

`POST /order`

Headers:

```text
Authorization: <customer-session-jwt>
Content-Type: application/json
```

Example request:

```json
{
  "orderType": "dine",
  "paymentMode": "cash",
  "items": [
    {
      "menuItemId": "menu-item-id",
      "quantity": 2
    }
  ]
}
```

On success, the endpoint responds with HTTP `201` and the created order. It
publishes that order to all owner streams connected to this backend process.

### Listen for new orders

`GET /order/events`

Headers:

```text
Authorization: <owner-jwt>
Accept: text/event-stream
```

Initial stream event:

```text
event: connected
data: {"connected":true}
```

New order event:

```text
event: new-order
data: { ...created order JSON... }
```

## Operational limitations

- Events are held in memory and broadcast only by the backend process that
  created the order. This implementation is suitable for a single backend
  process. Multiple instances require a shared pub/sub service (such as Redis)
  to deliver events across instances.
- SSE is a live notification channel, not an order-history API. It does not
  replay events missed while the owner dashboard is closed or disconnected.
  Add an authenticated owner order-list endpoint and initial fetch if the
  dashboard must load existing orders.
- The frontend retains only the latest 50 received orders in memory; the list
  resets on a full page reload.
- There is no owner login screen in `frontend2/`; authentication-token creation
  and storage remain the responsibility of the existing owner auth flow.
- Configure production CORS, HTTPS, backend URL, and JWT handling for the
  deployment environment.

## Validation performed

- `frontend2/`: production build passed.
- `frontend/`: production build passed.
- ESLint passed for the changed customer checkout file and the changed owner
  dashboard files.
- Full-project ESLint commands report unrelated existing lint errors in other
  files; those pre-existing issues were not changed as part of this feature.
- Backend changed JavaScript files passed `node --check`.
- There is no configured backend test suite (`backend/package.json` currently
  returns “no test specified”).
