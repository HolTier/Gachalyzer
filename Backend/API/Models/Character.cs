namespace API.Models
{
    public class Character
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;

        public int GameId { get; set; }
        public Game Game { get; set; }

        public string? SplashArtPath { get; set; }

        public ICollection<CharacterStatScaling> StatScalings { get; set; } = new List<CharacterStatScaling>();
    }
}
