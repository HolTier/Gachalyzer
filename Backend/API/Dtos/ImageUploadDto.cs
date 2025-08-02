namespace API.Dtos
{
    public class ImageUploadDto
    {
        public string SplashArtPath { get; set; } = default!;
        public string ThumbnailPath { get; set; } = default!;
        public List<string> Tags { get; set; } = new List<string>();
    }
}
