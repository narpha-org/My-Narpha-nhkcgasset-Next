export const getTotalRevenue = async () => {
  const paidOrders = [
    {
      createdAt: new Date(),
      orderItems: [
        {
          product: {
            price: 12345,
          },
        },
      ],
    },
  ];

  const totalRevenue = paidOrders.reduce((total, order) => {
    const orderTotal = order.orderItems.reduce((orderSum, item) => {
      return orderSum + item.product.price;
    }, 0);
    return total + orderTotal;
  }, 0);

  return totalRevenue;
};
