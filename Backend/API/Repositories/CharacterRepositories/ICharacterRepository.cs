using API.Dtos;
using API.Models.CharacterModels;

namespace API.Repositories.CharacterRepositories
{
    public interface ICharacterRepository : IGenericRepository<Character>
    {
        Task<IEnumerable<Character>> GetCharactersByGameIdAsync(int gameId);
        Task<Character?> GetCharacterByIdWithStatScalingsAsync(int characterId);
        Task<IEnumerable<Character>> GetCharactersByGameNameAsync(string gameName);
        Task<IEnumerable<Character>> GetCharactersByCharacterStatTypeAndGameIdAsync(string characterStatType, string gameName);
        Task<IEnumerable<CharacterBaseDto>> GetCharacterBaseDtosByGameIdAsync(int gameId);
        Task<IEnumerable<CharacterBaseDto>> GetCharacterBaseDtosByGameNameAsync(string gameName);
        Task<IEnumerable<CharacterBaseDto>> GetAllCharacterBaseDtosAsync();
        Task<IEnumerable<CharacterShowDto>> GetAllCharacterShowDtosAsync();
    }
}
