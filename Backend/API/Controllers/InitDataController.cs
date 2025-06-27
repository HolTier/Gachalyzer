using System.Text.Json;
using API.Data;
using API.Dtos;
using API.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InitDataController : ControllerBase
    {
        private readonly IGameStatRepository _gameStatRepository;
        private readonly IDistributedCache _cache;

        public InitDataController(IGameStatRepository gameStatRepository, IDistributedCache cache)
        {
            _gameStatRepository = gameStatRepository;
            _cache = cache;
        }

        [HttpGet("initStats")]
        public async Task<IActionResult> GetStatsInitData()
        {
            const string cacheKey = "StatsInitData";

            try
            {
                string? cachedData = await _cache.GetStringAsync(cacheKey);

                // check if data is already cached, if so, return it
                if (!string.IsNullOrEmpty(cachedData))
                {
                    var deserializedData = JsonSerializer.Deserialize<List<GameStatDto>>(cachedData);
                    return Ok(deserializedData);
                }

                // if not cached, fetch data from the database
                var result = await _gameStatRepository.GetAllStatsWithMetaAsync();

                var serialized = JsonSerializer.Serialize(result);
                var options = new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(1) // Cache for 1 day
                };

                // Set the cache
                await _cache.SetStringAsync(cacheKey, serialized, options);
                return Ok(result);
            }
            catch(Exception ex)
            {
                return StatusCode(500, "Internal Server error: " + ex.Message);
            }
        }
    }
}
