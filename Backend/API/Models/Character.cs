namespace API.Models
{
    public class Character
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;

        public int GameId { get; set; }
        public Game Game { get; set; }

        public int? ImageId { get; set; }
        public Image? Image { get; set; } = default!;

        public ICollection<CharacterStatScaling> StatScalings { get; set; } = new List<CharacterStatScaling>();
    }
}
