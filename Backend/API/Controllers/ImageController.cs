using API.Repositories;
using API.Services.Images;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImageController : ControllerBase
    {
        private readonly IImageService _imageService;
        private readonly IImageRepository _imageRepository;

        public ImageController(IImageService imageService, IImageRepository imageRepository)
        {
            _imageService = imageService;
            _imageRepository = imageRepository;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadImage(IFormFile file, string folderName, string fileName)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file provided");
            try
            {
                var result = await _imageService.SaveSplashArtAsync(file, folderName, fileName);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("all-images")]
        public async Task<IActionResult> GetAllImages()
        {
            try
            {
                var images = await _imageRepository.GetAllAsync();
                return Ok(images);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
