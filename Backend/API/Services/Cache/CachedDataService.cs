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

        public async Task<T?> GetOrSetCacheAsync<T>(string cacheKey, Func<Task<T>> fetchData)
        {
            string? cachedData = await _cache.GetStringAsync(cacheKey);

            if (!string.IsNullOrEmpty(cachedData))
            {
                var deserialized = JsonSerializer.Deserialize<T>(cachedData);
                if (deserialized is not null)
                    return deserialized;

                // If deserialized is null, we need to handle the case where T is a collection type.
                if (typeof(T).IsGenericType &&
                    (typeof(T).GetGenericTypeDefinition() == typeof(List<>) ||
                     typeof(T).GetGenericTypeDefinition() == typeof(IEnumerable<>)))
                {
                    return (T)Activator.CreateInstance(typeof(List<>).MakeGenericType(typeof(T).GetGenericArguments()[0]))!;
                }
            }

            T data = await fetchData();

            var serialized = JsonSerializer.Serialize(data);
            var options = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(1)
            };

            await _cache.SetStringAsync(cacheKey, serialized, options);
            return data;
        }
    }
}
