using API.Repositories;
using API.Services.Cache;
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
        private readonly ICachedDataService _cachedDataService;

        public ImageController(IImageService imageService, IImageRepository imageRepository, ICachedDataService cachedDataService)
        {
            _imageService = imageService;
            _imageRepository = imageRepository;
            _cachedDataService = cachedDataService;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadImage(IFormFile file, string folderName, string fileName, List<string> fileTags)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file provided");
            try
            {
                var result = await _imageService.SaveImageAsync(file, folderName, fileName, fileTags);
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
                var data = await _cachedDataService.GetOrSetCacheAsync(
                    "image:all",
                    () => _imageRepository.GetAllAsync()
                );
                if (data == null || !data.Any())
                    return NotFound("No images found");
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("image-by-page")]
        public async Task<IActionResult> GetImagesByPage(int pageNumber, int pageSize)
        {
            if (pageNumber < 1 || pageSize < 1)
                return BadRequest("Invalid page number or size");
            try
            {
                var data = await _cachedDataService.GetOrSetCacheAsync(
                    $"image:page:{pageNumber}:{pageSize}",
                    () => _imageRepository.GetByPageAsync(pageNumber, pageSize)
                );
                if (data == null || !data.Images.Any())
                    return NotFound("No images found for the specified page");
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
