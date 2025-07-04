namespace API.Dtos
{
    public class FileProcessingResult
    {
        public bool IsSuccess { get; set; }
        public List<FileStatsDto> FileStats { get; set; } = new List<FileStatsDto>();
        public string? ErrorMessage { get; set; }
    }
}
