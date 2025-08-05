namespace API.Models
{
    public class CharacterStatScaling
    {
        public int Id { get; set; }

        public int CharacterId { get; set; }
        public Character Character { get; set; } = default!;

        public int CharacterStatTypeId { get; set; }
        public CharacterStatType CharacterStatType { get; set; } = default!;

        public int Level { get; set; }
        public decimal Value { get; set; }
    }
}
