using API.Models;

namespace API.Repositories
{
    public interface ICharacterRepository
    {
        Task<IEnumerable<Character>> GetCharactersByGameIdAsync(int gameId);
        Task<IEnumerable<Character>> GetCharactersByGameNameAsync(string gameName);
        Task<IEnumerable<Character>> GetCharactersByCharacterStatTypeAndGameIdAsync(string characterStatType, string gameName);
    }
}
