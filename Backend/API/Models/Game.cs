namespace API.Models
{
    public class Game
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;

        public int MaxMainStats { get; set; }
        public int MaxSubStats { get; set; }
    }
}
