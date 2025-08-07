namespace API.Dtos
{
    public class CharacterDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public int GameId { get; set; }
        public int ImageId { get; set; }
    }
}
