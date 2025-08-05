namespace API.Models
{
    public class ImageStatus
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;

        public ICollection<Image> Images { get; set; } = new List<Image>();
    }
}
