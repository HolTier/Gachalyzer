namespace API.Dtos
{
    public class CharacterDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public int GameId { get; set; }
        public int CharacterElementId { get; set; }
        public int CharacterWeaponTypeId { get; set; }
        public List<CharacterStatScalingAddDto> CharacterStatScalingDto { get; set; } 
            = new List<CharacterStatScalingAddDto>();
        public int ImageId { get; set; }
        public int IconId { get; set; }
    }
}
