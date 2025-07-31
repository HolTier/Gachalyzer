namespace API.Dtos
{
    public class CharacterBaseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public string? SplashArtPath { get; set; }
        public int GameId { get; set; }
        public string GameName { get; set; } = default!;
    }
}
