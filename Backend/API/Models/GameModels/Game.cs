using System.Collections.Generic;
using API.Models.CharacterModels;
using API.Models.WeaponModels;

namespace API.Models.GameModels
{
    public class Game
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;

        public int MaxMainStats { get; set; }
        public int MaxSubStats { get; set; }

        public ICollection<GameStat> GameStats { get; set; } = new List<GameStat>();
        public ICollection<GameArtifactName> GameArtifactNames { get; set; } = new List<GameArtifactName>();
        public ICollection<Character> Characters { get; set; } = new List<Character>();
        public ICollection<CharacterStatType> CharacterStatTypes { get; set; } = new List<CharacterStatType>();
        public ICollection<Weapon> Weapons { get; set; } = new List<Weapon>();
        public ICollection<WeaponStatType> WeaponStatTypes { get; set; } = new List<WeaponStatType>();
    }
}
