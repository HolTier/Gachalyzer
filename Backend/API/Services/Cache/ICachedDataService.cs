namespace API.Services.Cache
{
    public interface ICachedDataService
    {
        public Task<List<T>> GetOrSetCacheAsync<T>(string cacheKey, Func<Task<IEnumerable<T>>> fetchData);
    }
}
