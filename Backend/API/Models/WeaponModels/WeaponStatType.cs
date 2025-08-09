using API.Models.GameModels;

namespace API.Models.WeaponModels
{
    public class WeaponStatType
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public string? Unit { get; set; }

        public int GameId { get; set; }
        public Game Game { get; set; } = default!;

        public ICollection<WeaponStatScaling> WeaponStatScalings { get; set; } = new List<WeaponStatScaling>();
    }
}
