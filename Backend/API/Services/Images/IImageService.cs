using API.Dtos;

namespace API.Services.Images
{
    public interface IImageService
    {
        Task<ImageUploadDto> SaveSplashArtAsync(IFormFile file, string folderName, string fileName);

    }
}
