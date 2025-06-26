using API.Data;
using API.Dtos;
using API.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public class GameStatRepository : GenericRepository<GameStat>, IGameStatRepository
    {
        private readonly IMapper _mapper;

        public GameStatRepository(AppDbContext context, IMapper mapper) : base(context) 
        {
            _mapper = mapper;
        }

        public async Task<IEnumerable<GameStatDto>> GetAllStatsWithMetaAsync()
        {
            return await _dbSet
                .ProjectTo<GameStatDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }

        public async Task<IEnumerable<GameStat>> GetStatsByGameId(int gameId)
        {
            return await _dbSet
                .Where(s => s.GameId == gameId)
                .ToListAsync();
        }

        public async Task<IEnumerable<GameStat>> GetStatsByGameName(string gameName)
        {
            return await _dbSet
                .Include(s => s.Game)
                .Where(s => s.Game.Name == gameName)
                .ToListAsync();
        }

        public async Task<IEnumerable<GameStat>> GetStatsByTypeNameAndGameNameAsync(string typeName, string gameName)
        {
            return await _dbSet
                .Include(s => s.StatType)
                .Include(s => s.Game)
                .Where(s => s.StatType.Name == typeName && s.Game.Name == gameName)
                .ToListAsync();
        }

        public async Task<IEnumerable<GameStatDto>> GetStatsWithMetaByGameId(int gameId)
        {
            return await _dbSet
                .Where(s => s.GameId == gameId)
                .ProjectTo<GameStatDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }

        public async Task<IEnumerable<GameStatDto>> GetStatsWithMetaByGameName(string gameName)
        {
            return await _dbSet
                .Where(s => s.Game.Name == gameName)
                .ProjectTo<GameStatDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }
    }
}
