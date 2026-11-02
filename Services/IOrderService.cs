using Services.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public interface IOrderService
    {
        Task<OrderDetailDto?> CreateOrderAsync(int userId, CreateOrderDto dto);
        Task<IEnumerable<OrderDetailDto>> GetUserOrdersAsync(int userId);
        Task<OrderDetailDto?> GetOrderByIdAsync(int userId, int orderId);
    }
}
