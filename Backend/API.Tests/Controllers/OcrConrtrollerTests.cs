using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using API.Controllers;
using API.Dtos;
using API.Services.Files;
using API.Services.Ocr;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Moq.Protected;

namespace API.Tests.Controllers
{
    public class OcrControllerTests
    {
        private readonly Mock<IFIleProcessingService> _fileProcessingServiceMock;
        private readonly OcrController _controller;

        public OcrControllerTests()
        {
            _fileProcessingServiceMock = new Mock<IFIleProcessingService>();
            _controller = new OcrController(_fileProcessingServiceMock.Object);
        }

        [Fact]
        public async Task PostSingleAsync_ReturnsOk_WithValidFile()
        {
            // Arrange
            var fileName = "test.png";
            var formFile = new FormFile(new MemoryStream(Encoding.UTF8.GetBytes("dummy")), 0, 5, "file", "test.png")
            {
                Headers = new HeaderDictionary(),
                ContentType = "image/png"
            };

            var fakeStats = new List<OcrStatDto>
            {
                new() { Stat = "Crit Rate", Value = 7, IsPercentage = true }
            };

            var result = new FileProcessingResult
            {
                IsSuccess = true,
                FileStats = new List<FileStatsDto>
            {
                new() { FileName = fileName, Stats = fakeStats }
            }
            };

            _fileProcessingServiceMock
                .Setup(s => s.ProcessFileAsync(It.IsAny<List<IFormFile>>()))
                .ReturnsAsync(result);

            // Act
            var response = await _controller.PostSingleAsync(formFile);

            // Assert
            var okResult = response.Should().BeOfType<OkObjectResult>().Subject;
            var data = okResult.Value.Should().BeAssignableTo<List<FileStatsDto>>().Subject;

            data.Should().ContainSingle();
            data[0].FileName.Should().Be(fileName);
            data[0].Stats.Should().BeEquivalentTo(fakeStats);
        }

        [Fact]
        public async Task PostSingleAsync_ReturnsBadRequest_WhenFileIsNull()
        {
            // Arrange
            IFormFile? file = null;

            // Act
            var result = await _controller.PostSingleAsync(file);

            // Assert
            result.Should().BeOfType<BadRequestObjectResult>().Which.Value.Should().Be("No file uploaded.");
        }

        [Fact]
        public async Task PostSingleAsync_ReturnsBadRequest_WhenServiceFails()
        {
            // Arrange
            var formFile = new FormFile(new MemoryStream(Encoding.UTF8.GetBytes("dummy")), 0, 5, "file", "test.png")
            {
                Headers = new HeaderDictionary(),
                ContentType = "image/png"
            };

            var failResult = new FileProcessingResult
            {
                IsSuccess = false,
                ErrorMessage = "Invalid file type"
            };

            _fileProcessingServiceMock
                .Setup(s => s.ProcessFileAsync(It.IsAny<List<IFormFile>>()))
                .ReturnsAsync(failResult);

            // Act
            var result = await _controller.PostSingleAsync(formFile);

            // Assert
            result.Should().BeOfType<BadRequestObjectResult>()
                  .Which.Value.Should().Be("Invalid file type");
        }

        [Fact]
        public async Task PostMultipleAsync_ReturnsOk_WithValidFiles()
        {
            // Arrange
            var files = new List<IFormFile>
            {
                new FormFile(new MemoryStream(Encoding.UTF8.GetBytes("dummy")), 0, 5, "file", "test1.png")
                {
                    Headers = new HeaderDictionary(),
                    ContentType = "image/png"
                },
                new FormFile(new MemoryStream(Encoding.UTF8.GetBytes("dummy")), 0, 5, "file", "test2.jpg")
                {
                    Headers = new HeaderDictionary(),
                    ContentType = "image/jpeg"
                }
            };

            var fakeStats = new List<OcrStatDto>
            {
                new() { Stat = "Crit Rate", Value = 7, IsPercentage = true },
                new() { Stat = "HP", Value = 200, IsPercentage = false }
            };

            var result = new FileProcessingResult
            {
                IsSuccess = true,
                FileStats = files.Select(f => new FileStatsDto
                {
                    FileName = f.FileName,
                    Stats = fakeStats
                }).ToList()
            };
            _fileProcessingServiceMock
                .Setup(s => s.ProcessFileAsync(files))
                .ReturnsAsync(result);

            // Act
            var response = await _controller.PostMultipleAsync(files);

            // Assert
            var okResult = response.Should().BeOfType<OkObjectResult>().Subject;
            var data = okResult.Value.Should().BeAssignableTo<List<FileStatsDto>>().Subject;
            data.Should().HaveCount(2);
            data[0].FileName.Should().Be("test1.png");
            data[0].Stats.Should().BeEquivalentTo(fakeStats);
        }
    }
}

