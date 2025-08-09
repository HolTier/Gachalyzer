using API.Data;
using API.Models.CharacterModels;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories.CharacterRepositories
{
    public class CharacterStatScalingRepository : GenericRepository<CharacterStatScaling>, ICharacterStatScalingRepository
    {
        public CharacterStatScalingRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<CharacterStatScaling>> GetCharacterStatScalingsByCharacterIdAsync(int characterId)
        {
            return await _dbSet
                .Where(s => s.CharacterId == characterId)
                .ToListAsync();
        }
    }
}
