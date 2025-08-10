namespace API.Dtos
{
    public class CharacterShowDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public int? GameId { get; set; }
        public string? GameName { get; set; }
        public int? CharacterElementId { get; set; }
        public string? CharacterElementName { get; set; }
        public int? CharacterWeaponTypeId { get; set; }
        public string? CharacterWeaponTypeName { get; set; }
        public List<CharacterStatScalingShowDto> CharacterStatScalingShowDtos { get; set; } 
            = new List<CharacterStatScalingShowDto>();
        public int? ImageId { get; set; }
        public int? IconId { get; set; }
        public string? ImageUrl { get; set; }
        public string? IconUrl { get; set; }
    }
}
