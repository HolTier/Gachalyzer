using API.Data;
using API.Models.GameModels;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories.GameRepositories
{
    public class GameArtifactNameRepository : GenericRepository<GameArtifactName>, IGameArtifactNameRepository
    {
        public GameArtifactNameRepository(AppDbContext context) : base(context)
        {

        }

        public async Task<IEnumerable<GameArtifactName>> GetGameArtifactNamesByGameIdAsync(int gameId)
        {
            return await _dbSet
                .Where(g => g.Id == gameId)
                .ToListAsync();
        }

        public async Task<IEnumerable<GameArtifactName>> GetGameArtifactNamesByGameNameAsync(string gameName)
        {
            return await _dbSet
                .Include(g => g.Game)
                .Where(g => g.Game.Name == gameName)
                .ToListAsync();
        }
    }
}
