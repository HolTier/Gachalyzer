using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Net.Http.Headers;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OcrController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public OcrController(HttpClient httpClient)
        {
            _httpClient = httpClient;
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

        // POST: api/Ocr
        [HttpPost]
        public async Task<IActionResult> PostAsync(IFormFile file)
        {
            // Check if the file is null
            if (file == null || file.Length == 0)
            {
                return BadRequest("File is required.");
            }

            // Check if the file is an image
            string[] permittedExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff" };
            string fileExtension = Path.GetExtension(file.FileName).ToLower();

            if (!permittedExtensions.Contains(fileExtension))
            {
                return BadRequest("Invalid file type. Please upload an image.");
            }

            // Create multipart form content
            using var formContent = new MultipartFormDataContent();
            using var fileStream = file.OpenReadStream();
            using var fileContent = new StreamContent(fileStream);
            fileContent.Headers.ContentType = MediaTypeHeaderValue.Parse(file.ContentType);
            formContent.Add(fileContent, "file", file.FileName);

            // Send the file to the OCR service
            var response = await _httpClient.PostAsync("http://ocr:8000/analyze-image/", formContent);

            // Check if the response is successful
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadAsStringAsync();
                return Ok(result);
            }
            else
            {
                return StatusCode((int)response.StatusCode, "Error processing the image.");
            }
        }
    }
}
