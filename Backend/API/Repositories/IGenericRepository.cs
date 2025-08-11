namespace API.Repositories
{
    public interface IGenericRepository<T> where T : class
    {
        Task<T?> GetByIdAsync(int id);
        Task<IEnumerable<T>> GetAllAsync();
        Task AddAsync(T entity);
        Task AddRangeAsync(IEnumerable<T> entities);
        Task SaveChangesAsync();
        void Update(T entity);
        void Delete(T entity);
    }
}
