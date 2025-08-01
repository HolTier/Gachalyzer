namespace API.Models
{
    public class Tag
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;

        public List<Image> Images { get; set; } = new();
    }
}
