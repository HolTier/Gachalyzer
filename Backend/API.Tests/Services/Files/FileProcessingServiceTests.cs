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
using API.StatProcessing;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Moq.Protected;

namespace API.Tests.Services.Files
{
    public class FileProcessingServiceTests
    {
        private readonly IFIleProcessingService _fileProcessingService;

        public FileProcessingServiceTests()
        {
            // Mock resolver
            var resolverMock = new Mock<IGameStatResolver>();
            resolverMock
                .Setup(r => r.DetermineStatType(
                    It.IsAny<string>(),
                    It.IsAny<decimal>(),
                    It.IsAny<bool>(),
                    out It.Ref<decimal>.IsAny))
                .Returns((string statName, decimal value, bool isPercentage, out decimal normalized) =>
                {
                    normalized = value; // For simplicity, just return the value as normalized
                    return OcrStatType.SubStat.ToString(); // Return a fixed stat type for testing
                });

            // Mock factory to return resolver
            var resolverFactoryMock = new Mock<IGameStatResolverFactory>();
            resolverFactoryMock
                .Setup(f => f.GetResolver(It.IsAny<GameType>()))
                .Returns(resolverMock.Object);

            // Use real processor
            var ocrProcessor = new OcrResultProcessor(resolverFactoryMock.Object);

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
                    var mockOcrResponse = new { result = new List<string> { "CRIT RATE 7%", "HP 200" } };
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
            _fileProcessingService = new FileProcessingService(httpClient, ocrProcessor);
        }

        [Fact]
        public async Task ProcessFileAsync_ShouldReturnSuccess_WhenValidFilesProvided()
        {
            // Arrange
            var files = new List<IFormFile>
            {
                new FormFile(new MemoryStream(Encoding.UTF8.GetBytes("dummy")), 0, 5, "file", "test1.jpg")
                {
                    Headers = new HeaderDictionary(),
                    ContentType = "image/jpeg"
                },
                new FormFile(new MemoryStream(Encoding.UTF8.GetBytes("dummy")), 0, 5, "file", "test2.png")
                {
                    Headers = new HeaderDictionary(),
                    ContentType = "image/png"
                }
            };

            // Act
            var result = await _fileProcessingService.ProcessFileAsync(files);

            // Assert
            result.IsSuccess.Should().BeTrue();
            result.FileStats.Should().NotBeEmpty();
            result.FileStats.Should().HaveCount(2);

            result.FileStats[0].Stats.Should().NotBeEmpty();
            result.FileStats[0].Stats.Should().HaveCount(2);
            result.FileStats[0].Stats[0].Stat.Should().Be("CRIT RATE");
            result.FileStats[0].Stats[0].Value.Should().Be(7m);
            result.FileStats[0].Stats[1].Stat.Should().Be("HP");
            result.FileStats[0].Stats[1].Value.Should().Be(200m);

            result.FileStats[1].Stats.Should().NotBeEmpty();
            result.FileStats[1].Stats.Should().HaveCount(2);
            result.FileStats[1].Stats[0].Stat.Should().Be("CRIT RATE");
            result.FileStats[1].Stats[0].Value.Should().Be(7m);
            result.FileStats[1].Stats[1].Stat.Should().Be("HP");
            result.FileStats[1].Stats[1].Value.Should().Be(200m);

            result.ErrorMessage.Should().BeNullOrEmpty();
        }
    }
}
