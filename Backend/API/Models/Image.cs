namespace API.Models
{
    public class Image
    {
        public int Id { get; set; }
        public string SplashArtPath { get; set; } = default!;
        public string ThumbnailPath { get; set; } = default!;
        public string Hash { get; set; } = default!;
        public DateTime? CreatedAt { get; set; }
        public DateTime? LastModified { get; set; }

        public List<Tag> Tags { get; set; } = new();

        public int ImageStatusId { get; set; }
        public ImageStatus ImageStatus { get; set; } = default!;

        public ICollection<Character> Characters { get; set; } = new List<Character>();
        public ICollection<Weapon> Weapons { get; set; } = new List<Weapon>();
        public ICollection<GameArtifactName> GameArtifactNames { get; set; } = new List<GameArtifactName>();
    }
}
