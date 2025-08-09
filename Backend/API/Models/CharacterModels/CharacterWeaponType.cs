using API.Models.GameModels;

namespace API.Models.CharacterModels
{
    public class CharacterWeaponType
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;

        public int GameId { get; set; }
        public Game Game { get; set; } = default!;

        public ICollection<Character> Characters { get; set; } = new List<Character>();
    }
}
