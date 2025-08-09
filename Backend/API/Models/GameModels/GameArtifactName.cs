namespace API.Models.GameModels
{
    public class GameArtifactName
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;

        public int GameId { get; set; }
        public Game Game { get; set; } = default!;

        public int? ImageId { get; set; }
        public Image? Image { get; set; }
    }
}
