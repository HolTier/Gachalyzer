using API.Models.GameModels;

namespace API.Repositories.GameRepositories
{
    public interface IGameRepository : IGenericRepository<Game>
    {
        Task<IEnumerable<Game>> GetGameByNameAsync(string name);
    }
}
