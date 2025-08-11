using API.Dtos;

namespace API.Services.Characters
{
    public interface ICharacterService
    {
        Task<CharacterDto> AddCharacterAsync(CharacterAddDto characterAddDto);
        Task<List<CharacterShowDto>> GetAllCharactersAsync();
        Task<CharacterDto> UpdateCharacterAsync(int id, CharacterUpdateDto characterDto);
        Task<bool> DeleteCharacterAsync(int id);
    }
}
