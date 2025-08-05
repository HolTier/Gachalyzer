namespace API.Models
{
    public class Weapon
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public string Description { get; set; } = default!;
        
        public int GameId { get; set; }
        public Game Game { get; set; } = default!;

        public int? ImageId { get; set; }
        public Image? Image { get; set; } = default!;

        public ICollection<WeaponStatScaling> StatScalings { get; set; } = new List<WeaponStatScaling>();
    }
}
