namespace API.Dtos
{
    public class UploadImageRequest
    {
        public IFormFile File { get; set; } = default!;
        public string FolderName { get; set; } = default!;
        public string FileName { get; set; } = default!;
        public List<string> FileTags { get; set; } = default!;
    }
}
