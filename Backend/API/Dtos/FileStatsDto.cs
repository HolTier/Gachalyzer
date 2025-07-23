namespace API.Dtos
{
    public class FileStatsDto
    {
        public string FileName { get; set; } = string.Empty;
        public List<OcrStatDto> Stats { get; set; } = new List<OcrStatDto>();
        public List<string> Artifacts { get; set; } = new List<string>();
    }
}
