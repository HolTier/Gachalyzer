namespace API.Dtos
{
    public class CharacterStatScalingUpdateDto
    {
        public int Id { get; set; }
        public int CharacterId { get; set; }
        public int StatTypeId { get; set; }
        public int Level { get; set; }
        public decimal Value { get; set; }
        public bool IsBreakpoint { get; set; } = false;
    }
}
