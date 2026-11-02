const orderListeners = new Set();

const subscribeToOrderEvents = (response) => {
  orderListeners.add(response);
  return () => orderListeners.delete(response);
};

const publishNewOrder = (order) => {
  const event = `event: new-order\ndata: ${JSON.stringify(order)}\n\n`;

  for (const response of orderListeners) {
    if (response.destroyed || response.writableEnded) {
      orderListeners.delete(response);
      continue;
    }

    response.write(event);
  }
};

export { publishNewOrder, subscribeToOrderEvents };
