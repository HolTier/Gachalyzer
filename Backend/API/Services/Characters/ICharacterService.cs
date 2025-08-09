using API.Dtos;

namespace API.Services.Characters
{
    public interface ICharacterService
    {
        Task<CharacterDto> AddCharacterAsync(CharacterAddDto characterAddDto);
    }
}
