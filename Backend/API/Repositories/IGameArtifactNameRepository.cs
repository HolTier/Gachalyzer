using API.Models;

namespace API.Repositories
{
    public interface IGameArtifactNameRepository : IGenericRepository<GameArtifactName>
    {
        Task<IEnumerable<GameArtifactName>> GetGameArtifactNamesByGameNameAsync(string gameName);
        Task<IEnumerable<GameArtifactName>> GetGameArtifactNamesByGameIdAsync(int gameId);
    }
}
