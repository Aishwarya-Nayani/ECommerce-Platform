using Services.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public interface ICartService
    {
        Task<IEnumerable<CartItemDto>> GetUserCartAsync(int userId);
        Task<bool> AddToCartAsync(int userId, AddToCartDto dto);
        Task<bool> UpdateQuantityAsync(int userId, int cartItemId, int quantity);
        Task<bool> RemoveFromCartAsync(int userId, int cartItemId);
        Task<bool> ClearCartAsync(int userId);
    }
}
