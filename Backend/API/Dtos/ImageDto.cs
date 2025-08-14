namespace API.Dtos
{
    public class ImageDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string SplashArtPath { get; set; } = default!;
        public string ThumbnailPath { get; set; } = default!;
        public List<string>? Tags { get; set; }
    }
}
