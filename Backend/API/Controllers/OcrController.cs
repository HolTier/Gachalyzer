using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Net.Http.Headers;
using API.Dtos;
using System.Text.Json;
using API.Services.Ocr;
using API.Services.Files;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OcrController : ControllerBase
    {
        private readonly IFIleProcessingService _fileProcessingService;

        public OcrController(IFIleProcessingService fIleProcessingService)
        {
            _fileProcessingService = fIleProcessingService;
        }

        [HttpPost("upload-single")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> PostSingleAsync(IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest("No file uploaded.");

                var result = await _fileProcessingService.ProcessFileAsync(new List<IFormFile> { file });

                if (!result.IsSuccess)
                    return BadRequest(result.ErrorMessage);

                return Ok(result.FileStats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpPost("upload-multiple")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> PostMultipleAsync(List<IFormFile> files)
        {
            try
            {
                if (files == null || !files.Any())
                    return BadRequest("No files uploaded.");

                var result = await _fileProcessingService.ProcessFileAsync(files);

                if (!result.IsSuccess)
                    return BadRequest(result.ErrorMessage);

                return Ok(result.FileStats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
    }
}
