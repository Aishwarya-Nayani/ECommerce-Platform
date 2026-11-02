using DataAccessLayer.Data;
using DataAccessLayer.Entities;
using Microsoft.EntityFrameworkCore;
using Services.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class OrderService : IOrderService
    {
        private readonly ApplicationDbContext _context;

        public OrderService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<OrderDetailDto?> CreateOrderAsync(int userId, CreateOrderDto dto)
        {
            var cartItems = await _context.CartItems
                .Include(c => c.Product)
                .Where(c => c.UserId == userId)
                .ToListAsync();

            if (cartItems.Count == 0) return null;

            // Verify stock
            foreach (var item in cartItems)
            {
                if (item.Product.StockQuantity < item.Quantity)
                    return null;
            }

            // Execute in database transaction
            using var transaction = await _context.Database.BeginTransactionAsync();

            decimal totalAmount = cartItems.Sum(c => c.Product.Price * c.Quantity);

            var order = new Order
            {
                UserId = userId,
                OrderDate = DateTime.UtcNow,
                TotalAmount = totalAmount,
                Status = "Pending",
                ShippingAddress = dto.ShippingAddress,
                PaymentMethod = dto.PaymentMethod
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            foreach (var item in cartItems)
            {
                var orderItem = new OrderItem
                {
                    OrderId = order.Id,
                    ProductId = item.ProductId,
                    UnitPrice = item.Product.Price, // Snapshot price at purchase
                    Quantity = item.Quantity
                };
                _context.OrderItems.Add(orderItem);

                // Deduct inventory
                item.Product.StockQuantity -= item.Quantity;
            }

            // Clear user's cart
            _context.CartItems.RemoveRange(cartItems);

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return await GetOrderByIdAsync(userId, order.Id);
        }

        public async Task<IEnumerable<OrderDetailDto>> GetUserOrdersAsync(int userId)
        {
            return await _context.Orders
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new OrderDetailDto
                {
                    Id = o.Id,
                    OrderDate = o.OrderDate,
                    TotalAmount = o.TotalAmount,
                    Status = o.Status,
                    ShippingAddress = o.ShippingAddress,
                    PaymentMethod = o.PaymentMethod,
                    Items = o.OrderItems.Select(oi => new OrderItemDetailDto
                    {
                        ProductId = oi.ProductId,
                        ProductTitle = oi.Product.Title,
                        UnitPrice = oi.UnitPrice,
                        Quantity = oi.Quantity
                    }).ToList()
                })
                .ToListAsync();
        }

        public async Task<OrderDetailDto?> GetOrderByIdAsync(int userId, int orderId)
        {
            return await _context.Orders
                .Where(o => o.Id == orderId && o.UserId == userId)
                .Select(o => new OrderDetailDto
                {
                    Id = o.Id,
                    OrderDate = o.OrderDate,
                    TotalAmount = o.TotalAmount,
                    Status = o.Status,
                    ShippingAddress = o.ShippingAddress,
                    PaymentMethod = o.PaymentMethod,
                    Items = o.OrderItems.Select(oi => new OrderItemDetailDto
                    {
                        ProductId = oi.ProductId,
                        ProductTitle = oi.Product.Title,
                        UnitPrice = oi.UnitPrice,
                        Quantity = oi.Quantity
                    }).ToList()
                })
                .FirstOrDefaultAsync();
        }
    }
}
