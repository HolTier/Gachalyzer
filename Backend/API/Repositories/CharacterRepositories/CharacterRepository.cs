using API.Data;
using API.Dtos;
using API.Models.CharacterModels;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories.CharacterRepositories
{
    public class CharacterRepository : GenericRepository<Character>, ICharacterRepository
    {
        public CharacterRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<CharacterBaseDto>> GetAllCharacterBaseDtosAsync()
        {
            return await _dbSet
                .Include(c => c.Game)
                .Select(c => new CharacterBaseDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    GameId = c.GameId,
                    GameName = c.Game.Name,
                    SplashArtPath = c.Image != null ? c.Image.SplashArtPath : null
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<CharacterShowDto>> GetAllCharacterShowDtosAsync()
        {
            return await _dbSet
            .Select(c => new CharacterShowDto
            {
                Id = c.Id,
                Name = c.Name,
                GameId = c.GameId,
                GameName = c.Game.Name,
                ImageUrl = c.Image != null ? c.Image.SplashArtPath : null,
                IconUrl = c.Icon != null ? c.Icon.SplashArtPath : null,
                CharacterWeaponTypeName = c.CharacterWeaponType != null ? c.CharacterWeaponType.Name : null,
                CharacterElementName = c.CharacterElement != null ? c.CharacterElement.Name : null,
                CharacterStatScalingShowDtos = c.StatScalings.Select(s => new CharacterStatScalingShowDto
                {
                    Id = s.Id,
                    Value = s.Value,
                    Level = s.Level,
                    IsBreakpoint = s.IsBreakpoint,
                    StatTypeName = s.CharacterStatType.Name
                }).ToList(),
            })
            .ToListAsync();
        }

        public async Task<IEnumerable<CharacterBaseDto>> GetCharacterBaseDtosByGameIdAsync(int gameId)
        {
            return await _dbSet
                .Include(c => c.Game)
                .Where(c => c.GameId == gameId)
                .Select(c => new CharacterBaseDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    GameId = c.GameId,
                    GameName = c.Game.Name,
                    SplashArtPath = c.Image != null ? c.Image.SplashArtPath : null
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<CharacterBaseDto>> GetCharacterBaseDtosByGameNameAsync(string gameName)
        {
            return await _dbSet
                .Include(c => c.Game)
                .Include(c => c.Image)
                .Where(c => c.Game.Name == gameName)
                .Select(c => new CharacterBaseDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    GameId = c.GameId,
                    GameName = c.Game.Name,
                    SplashArtPath = c.Image != null ? c.Image.SplashArtPath : null
                })
                .ToListAsync();
        }

        public async Task<Character?> GetCharacterByIdWithStatScalingsAsync(int characterId)
        {
            return await _dbSet
                .Include(c => c.StatScalings)
                    .ThenInclude(cs => cs.CharacterStatType)
                .Include(c => c.Game)
                .FirstOrDefaultAsync(c => c.Id == characterId);
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

        public async Task<IEnumerable<Character>> GetCharactersByGameIdAsync(int gameId)
        {
            return await _dbSet
                .Include(c => c.Game)
                .Where(c => c.GameId == gameId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Character>> GetCharactersByGameNameAsync(string gameName)
        {
            return await _dbSet
                .Include(c => c.Game)
                .Where(c => c.Game.Name == gameName)
                .ToListAsync();
        }
    }
}
