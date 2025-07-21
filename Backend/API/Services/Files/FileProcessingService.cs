
using API.Dtos;
using System.Text.Json;
using API.Services.Ocr;
using System.Net.Http.Headers;
using API.Config;

namespace API.Services.Files
{
    public class FileProcessingService : IFIleProcessingService
    {
        private readonly HttpClient _httpClient;
        private readonly IOcrResultProcessor _ocrResultProcessor;
        private readonly GlobalConfig _globalConfig;

        public FileProcessingService(HttpClient httpClient, IOcrResultProcessor ocrResultProcessor, GlobalConfig globalConfig)
        {
            _httpClient = httpClient;
            _ocrResultProcessor = ocrResultProcessor;
            _globalConfig = globalConfig;
        }

        public async Task<FileProcessingResult> ProcessFileAsync(List<IFormFile> files)
        {
            string[] permittedExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff" };
            var allResults = new List<FileStatsDto>();
            string ocrUrl = (_globalConfig.OCRUrl ?? "http://ocr:8000") + "/analyze-image/";

            foreach (var file in files)
            {
                var ext = Path.GetExtension(file.FileName).ToLower();
                if (!permittedExtensions.Contains(ext))
                    return new FileProcessingResult
                    {
                        IsSuccess = false,
                        FileStats = new List<FileStatsDto>(),
                        ErrorMessage = $"Invalid file type: {file.FileName}. Allowed types are: {string.Join(", ", permittedExtensions)}"
                    };

                using var formContent = new MultipartFormDataContent();
                using var fileStream = file.OpenReadStream();
                using var fileContent = new StreamContent(fileStream);
                fileContent.Headers.ContentType = new MediaTypeHeaderValue(file.ContentType);
                formContent.Add(fileContent, "file", file.FileName);

                var response = await _httpClient.PostAsync(ocrUrl, formContent);
                if (!response.IsSuccessStatusCode)
                {
                    var error = await response.Content.ReadAsStringAsync();
                    return new FileProcessingResult
                    {
                        IsSuccess = false,
                        FileStats = new List<FileStatsDto>(),
                        ErrorMessage = $"OCR service returned an error for file: {file.FileName}. Status code: {response.StatusCode}, Error: {error}"
                    };
                }

                var rawResult = await response.Content.ReadAsStringAsync();
                var ocrResponse = JsonSerializer.Deserialize<OcrResponse>(rawResult, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (ocrResponse?.Result == null || ocrResponse.Result.Count == 0)
                    return new FileProcessingResult
                    {
                        IsSuccess = false,
                        FileStats = new List<FileStatsDto>(),
                        ErrorMessage = $"OCR returned no results for file: {file.FileName}."
                    };

                var processed = _ocrResultProcessor.Process(ocrResponse.Result, GameType.WhutheringWaves);
                allResults.Add(new FileStatsDto { FileName = file.FileName, Stats = processed });
            }

            return new FileProcessingResult
            {
                IsSuccess = true,
                FileStats = allResults,
                ErrorMessage = null
            };
        }
    }
}
