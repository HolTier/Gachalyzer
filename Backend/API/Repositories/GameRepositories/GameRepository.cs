using API.Data;
using API.Models.GameModels;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories.GameRepositories
{
    public class GameRepository : GenericRepository<Game>, IGameRepository
    {
        public GameRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Game>> GetGameByNameAsync(string name)
        {
            return await _dbSet
                .Where(g => g.Name.Contains(name, StringComparison.OrdinalIgnoreCase))
                .ToListAsync();
        }
    }
}
