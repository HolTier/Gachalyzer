using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public class CharacterRepository : GenericRepository<Character>, ICharacterRepository
    {
        public CharacterRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Character>> GetCharactersByCharacterStatTypeAndGameIdAsync(string characterStatType, string gameName)
        {
            return await _dbSet
                .Include(c => c.StatScalings)
                    .ThenInclude(cs => cs.CharacterStatType)
                .Include(c => c.Game)
                .Where(
                    c => c.Game.Name == gameName 
                    && c.StatScalings.Any(cs => cs.CharacterStatType.Name == characterStatType))
                .ToListAsync();
        }

        public Task<IEnumerable<Character>> GetCharactersByGameIdAsync(int gameId)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Character>> GetCharactersByGameNameAsync(string gameName)
        {
            throw new NotImplementedException();
        }
    }
}
