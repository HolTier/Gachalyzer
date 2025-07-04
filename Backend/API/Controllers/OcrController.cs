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

        // GET: api/Ocr
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                // This is a placeholder for the OCR functionality.
                // In a real application, you would implement the OCR logic here.
                return Ok("OCR functionality is not implemented yet.");
            }
            catch (Exception ex)
            {
                // Log the exception (you should have logging configured)
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("upload-single")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> PostAsync([FromForm] IFormFile file)
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
    }
}
