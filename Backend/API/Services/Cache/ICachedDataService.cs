namespace API.Services.Cache
{
    public interface ICachedDataService
    {
        public Task<T?> GetOrSetCacheAsync<T>(string cacheKey, Func<Task<T>> fetchData);
        public Task ClearCacheAsync(string cacheKey);
    }
}
