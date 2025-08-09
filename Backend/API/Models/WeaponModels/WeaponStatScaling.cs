namespace API.Models.WeaponModels
{
    public class WeaponStatScaling
    {
        public int Id { get; set; }
        
        public int WeaponId { get; set; }
        public Weapon Weapon { get; set; } = default!;

        public int WeaponStatTypeId { get; set; }
        public WeaponStatType WeaponStatType { get; set; } = default!;

        public int Value { get; set; }
        public int Level { get; set; }
    }
}
