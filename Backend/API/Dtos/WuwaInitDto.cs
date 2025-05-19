using API.Models;

namespace API.Dtos
{
    public class WuwaInitDto
    {
        public List<WuwaMainStat> MainStats { get; set; } = new List<WuwaMainStat>();
        public List<WuwaSubStat> SubStats { get; set; } = new List<WuwaSubStat>();
    }
}
