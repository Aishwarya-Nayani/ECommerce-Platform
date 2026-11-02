using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services;
using Services.DTOs;
using System.Security.Claims;

namespace ECommerceWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        private int GetCurrentUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            var cart = await _cartService.GetUserCartAsync(GetCurrentUserId());
            return Ok(cart);
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddToCart([FromBody] AddToCartDto dto)
        {
            var success = await _cartService.AddToCartAsync(GetCurrentUserId(), dto);
            if (!success) return BadRequest(new { message = "Unable to add product to cart (insufficient stock or invalid item)." });
            return Ok(new { message = "Item added to cart." });
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateQuantity(int id, [FromBody] UpdateCartQuantityDto dto)
        {
            var success = await _cartService.UpdateQuantityAsync(GetCurrentUserId(), id, dto.Quantity);
            if (!success) return BadRequest(new { message = "Could not update quantity." });
            return Ok(new { message = "Cart updated." });
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> RemoveItem(int id)
        {
            var success = await _cartService.RemoveFromCartAsync(GetCurrentUserId(), id);
            if (!success) return NotFound(new { message = "Cart item not found." });
            return Ok(new { message = "Item removed from cart." });
        }
    }
}
