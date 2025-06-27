using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using API.Controllers;
using API.Dtos;
using API.Services.Ocr;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Moq.Protected;

namespace API.Tests.Controllers
{
    public class OcrConrtrollerTests
    {
        private readonly OcrController _controller;
        private readonly Mock<HttpClient> _httpClientMock;
        private readonly Mock<IOcrResultProcessor> _ocrResultProcessorMock;

        public OcrConrtrollerTests()
        {
            _httpClientMock = new Mock<HttpClient>();
            _ocrResultProcessorMock = new Mock<IOcrResultProcessor>();
            _controller = new OcrController(_httpClientMock.Object, _ocrResultProcessorMock.Object);
        }

        [Fact]
        public async Task PostAsync_ReturnProcessedResult_WithValidFile()
        {
            // Arrange
            var expectedOcrLines = new List<string> { "Line 1", "Line 2" };
            var expectedProcessedResult = new List<OcrStatDto>()
            {
                new OcrStatDto { Stat = "Stat1", Value = 100, IsPercentage = false },
                new OcrStatDto { Stat = "Stat2", Value = 50, IsPercentage = true }
            };

            _ocrResultProcessorMock
                .Setup(p => p.Process(expectedOcrLines, It.IsAny<GameType>()))
                .Returns(expectedProcessedResult);

            var ocrResponse = new OcrResponse
            {
                Result = expectedOcrLines
            };

            var handlerMock = new Mock<HttpMessageHandler>();
            handlerMock
                .Protected()
                .Setup<Task<HttpResponseMessage>>("SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent(JsonSerializer.Serialize(ocrResponse), Encoding.UTF8, "application/json")
                });

            var httpClient = new HttpClient(handlerMock.Object)
            {
                BaseAddress = new Uri("http://ocr:8000/")
            };

            var controller = new OcrController(httpClient, _ocrResultProcessorMock.Object);

            // Fake file upload
            var fileName = "test_image.png";
            var stream = new MemoryStream(Encoding.UTF8.GetBytes("Fake image content"));
            var formFile = new FormFile(stream, 0, stream.Length, "file", fileName)
            {
                Headers = new HeaderDictionary(),
                ContentType = "image/png"
            };

            // Act
            var result = await controller.PostAsync(formFile);

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            var processedResult = okResult.Value.Should().BeAssignableTo<IEnumerable<OcrStatDto>>().Subject.ToList();
            processedResult.Should().NotBeNull();
            processedResult.Should().HaveCount(expectedProcessedResult.Count);
            processedResult.Should().ContainSingle(x => x.Stat == "Stat1" && x.Value == 100 && !x.IsPercentage);
            processedResult.Should().ContainSingle(x => x.Stat == "Stat2" && x.Value == 50 && x.IsPercentage);
            _ocrResultProcessorMock.Verify(p => p.Process(expectedOcrLines, It.IsAny<GameType>()), Times.Once);
        }

        [Fact]
        public async Task PostAsync_ReturnsBadRequest_WhenFileIsNull()
        {
            // Arrange
            IFormFile? file = null;

            // Act
            var result = await _controller.PostAsync(file);

            // Assert
            result.Should().BeOfType<BadRequestObjectResult>();
            var badRequestResult = result as BadRequestObjectResult;
            badRequestResult.Value.Should().Be("File is required.");
        }

        [Fact]
        public async Task PostAsync_ReturnsBadRequest_WhenFileIsInvalidType()
        {
            // Arrange
            var fileName = "test_document.txt";
            var stream = new MemoryStream(Encoding.UTF8.GetBytes("Fake document content"));
            var formFile = new FormFile(stream, 0, stream.Length, "file", fileName)
            {
                Headers = new HeaderDictionary(),
                ContentType = "text/plain"
            };

            // Act
            var result = await _controller.PostAsync(formFile);

            // Assert
            result.Should().BeOfType<BadRequestObjectResult>();
            var badRequestResult = result as BadRequestObjectResult;
            badRequestResult.Value.Should().Be("Invalid file type. Please upload an image.");
        }

        [Fact]
        public async Task PostAsync_ReturnsInternalServerError_WhenOcrServiceFails()
        {
            // Arrange
            var fileName = "test_image.png";
            var stream = new MemoryStream(Encoding.UTF8.GetBytes("Fake image content"));
            var formFile = new FormFile(stream, 0, stream.Length, "file", fileName)
            {
                Headers = new HeaderDictionary(),
                ContentType = "image/png"
            };

            var handlerMock = new Mock<HttpMessageHandler>();
            handlerMock
                .Protected()
                .Setup<Task<HttpResponseMessage>>("SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>())
                .ThrowsAsync(new HttpRequestException("OCR service error"));

            var httpClient = new HttpClient(handlerMock.Object)
            {
                BaseAddress = new Uri("http://ocr:8000/")
            };

            var controller = new OcrController(httpClient, _ocrResultProcessorMock.Object);

            // Act
            var result = await controller.PostAsync(formFile);

            // Assert
            result.Should().BeOfType<ObjectResult>();
            var objectResult = result as ObjectResult;
            objectResult.StatusCode.Should().Be(500);
            objectResult.Value.Should().Be("Internal Server Error: OCR service error");
        }
    }
}
