using System.Text.Json.Serialization;

namespace API.Models
{
    public class ImageStatus
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
    }
}
