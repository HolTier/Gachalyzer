namespace API.Models
{
    public class CharacterStatType
    {
        public int Id { get; set; }

        public int GameId { get; set; }
        public Game Game { get; set; } = default!;

        public string Name { get; set; } = default!;
        public string? Unit { get; set; }
    }
}
