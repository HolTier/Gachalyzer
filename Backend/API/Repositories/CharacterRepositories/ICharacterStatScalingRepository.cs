using API.Models.CharacterModels;

namespace API.Repositories.CharacterRepositories
{
    public interface ICharacterStatScalingRepository : IGenericRepository<CharacterStatScaling>
    {
        Task<IEnumerable<CharacterStatScaling>> GetCharacterStatScalingsByCharacterIdAsync(int characterId);
    }
}
