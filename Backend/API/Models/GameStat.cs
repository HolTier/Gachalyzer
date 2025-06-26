namespace API.Models
{
    public class GameStat
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;

        public int StatTypeId { get; set; }
        public StatType StatType { get; set; } = default!;

        public int GameId { get; set; }
        public Game Game { get; set; } = default!;

    }
}
