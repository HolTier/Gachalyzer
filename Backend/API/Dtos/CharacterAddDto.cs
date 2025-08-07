using Microsoft.AspNetCore.Http;

namespace API.Dtos
{
    public class CharacterAddDto
    {
        public string Name { get; set; } = default!;
        public int GameId { get; set; }
        public IFormFile? Image { get; set; }
    }
}
