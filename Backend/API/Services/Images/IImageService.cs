using API.Dtos;

namespace API.Services.Images
{
    public interface IImageService
    {
        Task<ImageDto> SaveImageAsync(IFormFile file, string folderName, string fileName, List<string> fileTags);
        Task ScanAndCompareImagesAsync();

    }
}
