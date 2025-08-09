using Microsoft.AspNetCore.Http;

namespace API.Dtos
{
    public class CharacterAddDto
    {
        public string Name { get; set; } = default!;
        public int GameId { get; set; }
        public int CharacterElementId { get; set; }
        public int CharacterWeaponTypeId { get; set; }
        public IFormFile? Image { get; set; }
        public IFormFile? Icon { get; set; }
    }
}
