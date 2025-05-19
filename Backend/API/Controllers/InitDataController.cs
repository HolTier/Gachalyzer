using System.Text.Json;
using API.Data;
using API.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InitDataController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IDistributedCache _cache;

        public InitDataController(AppDbContext context, IDistributedCache cache)
        {
            _context = context;
            _cache = cache;
        }

        [HttpGet("initWuwa")]
        public async Task<IActionResult> GetWuwaInitData()
        {
            const string cacheKey = "WuwaInitData";

            string? cachedData = await _cache.GetStringAsync(cacheKey);

            // check if data is already cached, if so, return it
            if (!string.IsNullOrEmpty(cachedData))
            {
                var deserializedData = JsonSerializer.Deserialize<List<WuwaInitDto>>(cachedData);
                return Ok(deserializedData);
            }

            // if not cached, fetch data from the database
            var result = new WuwaInitDto
            {
                MainStats = await _context.WuwaMainStats.ToListAsync(),
                SubStats = await _context.WuwaSubStats.ToListAsync()
            };

            var serialized = JsonSerializer.Serialize(result);
            var options = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(1) // Cache for 1 day
            };

            // Set the cache
            await _cache.SetStringAsync(cacheKey, serialized, options);
            return Ok(result);
        }
    }
}
