using API.Models.GameModels;

namespace API.Repositories.GameRepositories
{
    public interface IGameArtifactNameRepository : IGenericRepository<GameArtifactName>
    {
        Task<IEnumerable<GameArtifactName>> GetGameArtifactNamesByGameNameAsync(string gameName);
        Task<IEnumerable<GameArtifactName>> GetGameArtifactNamesByGameIdAsync(int gameId);
    }
}
