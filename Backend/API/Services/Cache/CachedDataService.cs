
using System.Text.Json;
using Microsoft.Extensions.Caching.Distributed;

namespace API.Services.Cache
{
    public class CachedDataService : ICachedDataService
    {
        private readonly IDistributedCache _cache;

        public CachedDataService(IDistributedCache cache)
        {
            _cache = cache;
        }

        public async Task<List<T>> GetOrSetCacheAsync<T>(string cacheKey, Func<Task<IEnumerable<T>>> fetchData)
        {
            string? cachedData = await _cache.GetStringAsync(cacheKey);

            if (!string.IsNullOrEmpty(cachedData))
            {
                return JsonSerializer.Deserialize<List<T>>(cachedData) ?? new List<T>();
            }

            var data = await fetchData();
            var list = data.ToList();

            var serialized = JsonSerializer.Serialize(list);
            var options = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(1)
            };

            await _cache.SetStringAsync(cacheKey, serialized, options);
            return list;
        }
    }
}
