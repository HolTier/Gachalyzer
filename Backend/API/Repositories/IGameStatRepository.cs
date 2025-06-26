using API.Dtos;
using API.Models;

namespace API.Repositories
{
    public interface IGameStatRepository : IGenericRepository<GameStat>
    {
        Task<IEnumerable<GameStat>> GetStatsByTypeNameAndGameNameAsync(string typeName, string gameName);
        Task<IEnumerable<GameStat>> GetStatsByGameName(string gameName);
        Task<IEnumerable<GameStat>> GetStatsByGameId(int gameId);
        Task<IEnumerable<GameStatDto>> GetAllStatsWithMetaAsync();
        Task<IEnumerable<GameStatDto>> GetStatsWithMetaByGameName(string gameName);
        Task<IEnumerable<GameStatDto>> GetStatsWithMetaByGameId(int gameId);
    }
}
