using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using API.Dtos;
using API.Services.Files;
using API.Services.Ocr;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Moq.Protected;

namespace API.Tests.Services.Files
{
    public class FileProcessingServiceTests
    {
        private readonly Mock<IOcrResultProcessor> _ocrResultProcessorMock;
        private readonly IFIleProcessingService _fileProcessingService;

        public FileProcessingServiceTests()
        {
            _ocrResultProcessorMock = new Mock<IOcrResultProcessor>();

            // Setup mock to return a sample result
            _ocrResultProcessorMock
                .Setup(x => x.Process(It.IsAny<List<string>>(), It.IsAny<GameType>()))
                .Returns((List<string> input, GameType _) =>
                {
                    return input.Select(line => new OcrStatDto
                    {
                        Stat = line.Split(' ')[0],
                        RawValue = line.Split(' ')[1],
                        Value = decimal.Parse(line.Split(' ')[1].TrimEnd('%')),
                        IsPercentage = line.EndsWith("%"),
                        StatType = OcrStatType.SubStat.ToString()
                    }).ToList();
                });

            // Mock HTTP response
            var mockHttpHandler = new Mock<HttpMessageHandler>();
            mockHttpHandler
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>()
                )
                .ReturnsAsync((HttpRequestMessage request, CancellationToken token) =>
                {
                    var mockOcrResponse = new
                    {
                        result = new List<string> { "CRIT RATE 7%", "HP 200" }
                    };
                    var json = JsonSerializer.Serialize(mockOcrResponse);

                    return new HttpResponseMessage
                    {
                        StatusCode = HttpStatusCode.OK,
                        Content = new StringContent(json, Encoding.UTF8, "application/json")
                    };
                });

            var httpClient = new HttpClient(mockHttpHandler.Object)
            {
                BaseAddress = new Uri("http://ocr:8000/")
            };

            // Register services
            _fileProcessingService = new FileProcessingService(httpClient, _ocrResultProcessorMock.Object);
        }

        [Fact]
        public async Task ProcessFileAsync_ShouldReturnSuccess_WhenValidFilesProvided()
        {
            // Arrange
            var files = new List<IFormFile>
            {
                new FormFile(new MemoryStream(Encoding.UTF8.GetBytes("Test content")), 0, 12, "file", "test1.jpg")
                {
                    Headers = new HeaderDictionary(),
                    ContentType = "image/jpeg"
                },
                new FormFile(new MemoryStream(Encoding.UTF8.GetBytes("Test content")), 0, 12, "file", "test2.png")
                {
                    Headers = new HeaderDictionary(),
                    ContentType = "image/png"
                }
            };
            
            // Act
            var result = await _fileProcessingService.ProcessFileAsync(files);

            // Assert
            result.IsSuccess.Should().BeTrue();
            result.Result.Should().NotBeNull();
            result.ErrorMessage.Should().BeNull();

            // Optional: check processed result shape
            result.Result.ToString().Should().Contain("Processed");
        }
    }
}
