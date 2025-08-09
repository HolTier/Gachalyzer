using API.Models.GameModels;

namespace API.Models
{
    public class StatType
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;

        public ICollection<GameStat> GameStats { get; set; } = new List<GameStat>();
    }
}
