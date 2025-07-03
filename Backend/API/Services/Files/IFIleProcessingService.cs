namespace API.Services.Files
{
    public interface IFIleProcessingService
    {
        Task<(bool IsSuccess, object Result, string? ErrorMessage)> ProcessFileAsync(List<IFormFile> files);
    }
}
