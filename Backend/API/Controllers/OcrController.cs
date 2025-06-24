using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Net.Http.Headers;
using API.Dtos;
using System.Text.Json;
using API.Services.Ocr;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OcrController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly IOcrResultProcessor _ocrResultProcessor;

        public OcrController(HttpClient httpClient, IOcrResultProcessor ocrResultProcessor)
        {
            _httpClient = httpClient;
            _ocrResultProcessor = ocrResultProcessor;
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

        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> PostAsync([FromForm] IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest("File is required.");

                string[] permittedExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff" };
                string fileExtension = Path.GetExtension(file.FileName).ToLower();

                if (!permittedExtensions.Contains(fileExtension))
                    return BadRequest("Invalid file type. Please upload an image.");

                using var formContent = new MultipartFormDataContent();
                using var fileStream = file.OpenReadStream();
                using var fileContent = new StreamContent(fileStream);
                fileContent.Headers.ContentType = new MediaTypeHeaderValue(file.ContentType);
                formContent.Add(fileContent, "file", file.FileName);

                var response = await _httpClient.PostAsync("http://ocr:8000/analyze-image/", formContent);

                if (response.IsSuccessStatusCode)
                {
                    var rawResult = await response.Content.ReadAsStringAsync();

                    // Deserialize the result from JSON
                    var ocrResponse = JsonSerializer.Deserialize<OcrResponse>(rawResult, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                    // Validate
                    if (ocrResponse?.Result == null || ocrResponse.Result.Count == 0)
                        return BadRequest("OCR returned no results.");

                    // Pass lines to the processor
                    var processedResult = _ocrResultProcessor.Process(ocrResponse.Result, GameType.WhutheringWaves);

                    return Ok(processedResult);
                }
                else
                {
                    var error = await response.Content.ReadAsStringAsync();
                    return StatusCode((int)response.StatusCode, $"Error processing the image: {error}");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
    }
}
