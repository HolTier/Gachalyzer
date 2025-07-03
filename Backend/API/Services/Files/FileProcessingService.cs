
using API.Dtos;
using System.Text.Json;
using API.Services.Ocr;
using System.Net.Http.Headers;

namespace API.Services.Files
{
    public class FileProcessingService : IFIleProcessingService
    {
        private readonly HttpClient _httpClient;
        private readonly IOcrResultProcessor _ocrResultProcessor;

        public FileProcessingService(HttpClient httpClient, IOcrResultProcessor ocrResultProcessor)
        {
            _httpClient = httpClient;
            _ocrResultProcessor = ocrResultProcessor;
        }

        public async Task<(bool IsSuccess, object Result, string? ErrorMessage)> ProcessFileAsync(List<IFormFile> files)
        {
            string[] permittedExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff" };
            var allResults = new List<object>();

            foreach (var file in files)
            {
                var ext = Path.GetExtension(file.FileName).ToLower();
                if (!permittedExtensions.Contains(ext))
                    return (false, null!, $"Invalid file type: {file.FileName}");

                using var formContent = new MultipartFormDataContent();
                using var fileStream = file.OpenReadStream();
                using var fileContent = new StreamContent(fileStream);
                fileContent.Headers.ContentType = new MediaTypeHeaderValue(file.ContentType);
                formContent.Add(fileContent, "file", file.FileName);

                var response = await _httpClient.PostAsync("http://ocr:8000/analyze-image/", formContent);
                if (!response.IsSuccessStatusCode)
                {
                    var error = await response.Content.ReadAsStringAsync();
                    return (false, null!, $"Error from OCR service: {error}");
                }

                var rawResult = await response.Content.ReadAsStringAsync();
                var ocrResponse = JsonSerializer.Deserialize<OcrResponse>(rawResult, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (ocrResponse?.Result == null || ocrResponse.Result.Count == 0)
                    return (false, null!, $"OCR returned no result for file: {file.FileName}");

                var processed = _ocrResultProcessor.Process(ocrResponse.Result, GameType.WhutheringWaves);
                allResults.Add(new { File = file.FileName, Result = processed });
            }

            object result = allResults.Count == 1 ? allResults[0] : allResults;
            return (true, result, null);
        }
    }
}
