namespace API.Dtos
{
    public class CharacterUpdateDto
    {
        public int Id { get; set; }
        public string? Name { get; set; } = default!;
        public int? GameId { get; set; }
        public int? CharacterElementId { get; set; }
        public int? CharacterWeaponTypeId { get; set; }
        public List<CharacterStatScalingUpdateDto> CharacterStatScaling { get; set; }
            = new List<CharacterStatScalingUpdateDto>();

        public IFormFile? Image { get; set; }
        public IFormFile? Icon { get; set; }

        public int? ImageId { get; set; }
        public int? IconId { get; set; }
    }
}
