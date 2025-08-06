using API.Models;

namespace API.Repositories
{
    public interface IGameRepository : IGenericRepository<Game>
    {
        Task<IEnumerable<Game>> GetGameByNameAsync(string name);
    }
}
