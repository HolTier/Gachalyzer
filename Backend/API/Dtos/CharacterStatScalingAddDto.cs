namespace API.Dtos
{
    public class CharacterStatScalingAddDto
    {
        public int StatTypeId { get; set; }
        public int Level { get; set; }
        public decimal Value { get; set; }
        public bool IsBreakpoint { get; set; } = false;
    }
}
