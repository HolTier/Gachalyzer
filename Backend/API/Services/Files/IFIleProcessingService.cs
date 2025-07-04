using API.Dtos;

namespace API.Services.Files
{
    public interface IFIleProcessingService
    {
        Task<FileProcessingResult> ProcessFileAsync(List<IFormFile> files);
    }
}
