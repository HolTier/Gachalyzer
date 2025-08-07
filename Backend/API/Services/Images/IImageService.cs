using API.Dtos;

namespace API.Services.Images
{
    public interface IImageService
    {
        Task<ImageDto> SaveSplashArtAsync(IFormFile file, string folderName, string fileName);
        Task ScanAndCompareImagesAsync();

    }
}
