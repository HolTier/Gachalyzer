using API.Models.GameModels;

namespace API.Models.CharacterModels
{
    public class Character
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;

        public int GameId { get; set; }
        public Game Game { get; set; }

        public int? CharacterWeaponTypeId { get; set; }
        public CharacterWeaponType? CharacterWeaponType { get; set; }

        public int? CharacterElementId { get; set; }
        public CharacterElement? CharacterElement { get; set; }

        public int? ImageId { get; set; }
        public Image? Image { get; set; } = default!;

        public int? IconId { get; set; }
        public Image? Icon { get; set; } = default!;

        public ICollection<CharacterStatScaling> StatScalings { get; set; } = new List<CharacterStatScaling>();
    }
}
