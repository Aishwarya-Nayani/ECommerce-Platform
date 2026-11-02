using Services.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public interface IProductService
    {
        Task<PaginatedResultDto<ProductDto>> GetProductsAsync(
        string? search,
        int? categoryId,
        decimal? minPrice,
        decimal? maxPrice,
        string? sortBy,
        int pageNumber = 1,
        int pageSize = 10);

        Task<ProductDto?> GetProductByIdAsync(int id);
    }
}
