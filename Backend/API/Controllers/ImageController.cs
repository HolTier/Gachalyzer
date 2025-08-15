using API.Dtos;
using API.Repositories;
using API.Services.Cache;
using API.Services.Images;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Update.Internal;

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
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadImage([FromForm] UploadImageRequest request)
        {
            if (request.File == null || request.File.Length == 0)
                return BadRequest("No file provided");
            try
            {
                var result = await _imageService.SaveImageAsync(request.File, request.FolderName, 
                    request.FileName, request.FileTags);
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
        public async Task<IActionResult> GetImagesByPage(
            [FromQuery] int pageNumber,
            [FromQuery] int pageSize,
            [FromQuery] string[]? tags)
        {
            if (pageNumber < 1 || pageSize < 1)
                return BadRequest("Invalid page number or size");
            try
            {
                var data = await _imageRepository.GetByPageAsync(pageNumber, pageSize, tags);
                if (data == null || !data.Images.Any())
                    return NotFound("No images found for the specified page");
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("all-tags")]
        public async Task<IActionResult> GetAllTags()
        {
            try
            {
                var tags = await _cachedDataService.GetOrSetCacheAsync(
                    "image:all-tags",
                    () => _imageRepository.GetAllTagsAsync()
                );
                if (tags == null || !tags.Any())
                    return NotFound("No tags found");
                return Ok(tags);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
     }
}
