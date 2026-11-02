using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.DTOs
{
    public class ProductCreateUpdateDto
    {
        [Required]
        public int CategoryId { get; set; }
        [Required]
        public string Title { get; set; } = string.Empty;
        [Required]
        public string Description { get; set; } = string.Empty;
        [Required]
        [Range(0.01, 100000)]
        public decimal Price { get; set; }
        [Required]
        [Range(0, 100000)]
        public int StockQuantity { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsFeatured { get; set; } = false;
    }
}
