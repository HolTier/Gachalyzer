using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using API.Controllers;
using API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.EntityFrameworkCore.InMemory;
using Moq;
using API.Models;
using FluentAssertions;
using API.Dtos;

namespace API.Tests.Controllers
{
    public class InitDataControllerTests
    {
        private readonly AppDbContext _context;
        private readonly Mock<IDistributedCache> _cacheMock;
        private readonly InitDataController _controller;

        public InitDataControllerTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDb")
                .Options;
            _context = new AppDbContext(options);

            _cacheMock = new Mock<IDistributedCache>();
            _controller = new InitDataController(_context, _cacheMock.Object);
        }

        [Fact]
        public async Task GetWuwaInitData_ReturnsOk_WithData()
        {
            // Seed
            _context.WuwaMainStats.Add(new WuwaMainStat { Id = 1, Name = "MainStat1" });
            _context.WuwaSubStats.Add(new WuwaSubStat { Id = 1, Name = "SubStat2" });
            await _context.SaveChangesAsync();

            // Arrange
            _cacheMock.Setup(c => c.GetAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(null as byte[]);

            // Act
            var result = await _controller.GetWuwaInitData();

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            var dto = okResult.Value.Should().BeOfType<WuwaInitDto>().Subject;
            dto.MainStats.Should().ContainSingle();
            dto.SubStats.Should().ContainSingle();
        }

        [Fact]
        public async Task GetWuwaInitData_ReturnsCachedData_WhenAvailable()
        {
            // Arrange
            var cachedData = new WuwaInitDto
            {
                MainStats = new List<WuwaMainStat> { new WuwaMainStat { Id = 1, Name = "CachedMainStat" } },
                SubStats = new List<WuwaSubStat> { new WuwaSubStat { Id = 1, Name = "CachedSubStat" } }
            };
            var serializedData = System.Text.Json.JsonSerializer.Serialize(cachedData);
            _cacheMock.Setup(c => c.GetAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(Encoding.UTF8.GetBytes(serializedData));

            // Act
            var result = await _controller.GetWuwaInitData();

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            var dto = okResult.Value.Should().BeOfType<WuwaInitDto>().Subject;
            dto.MainStats.Should().ContainSingle();
            dto.SubStats.Should().ContainSingle();
        }

        [Fact]
        public async Task GetWuwaInitData_CachesData_WhenNotCached()
        {
            // Arrange
            _cacheMock.Setup(c => c.GetAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(null as byte[]);

            // Act
            var result = await _controller.GetWuwaInitData();

            // Assert
            _cacheMock.Verify(c => c.SetAsync(
                It.IsAny<string>(),
                It.IsAny<byte[]>(),
                It.IsAny<DistributedCacheEntryOptions>(),
                It.IsAny<CancellationToken>()),
                Times.Once);

        }

        [Fact]
        public async Task GetWuwaInitData_ReturnOk_WhenNoData()
        {
            // Arrange
            _cacheMock.Setup(c => c.GetAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(null as byte[]);

            // Act
            var result = await _controller.GetWuwaInitData();

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            var dto = okResult.Value.Should().BeOfType<WuwaInitDto>().Subject;
            dto.MainStats.Should().BeEmpty();
            dto.SubStats.Should().BeEmpty();
        }

        // TODO: Change after refactor.
        [Fact]
        public async Task GetWuwaInitData_Returns500_WhenDbThrows()
        {
            // Arrange
            var contextMock = new Mock<AppDbContext>(new DbContextOptionsBuilder<AppDbContext>().Options);
            var wuwaMainStatsDbSetMock = new Mock<DbSet<WuwaMainStat>>();

            contextMock.Setup(c => c.WuwaMainStats).Returns(wuwaMainStatsDbSetMock.Object);
            wuwaMainStatsDbSetMock.Setup(s => s.ToListAsync(It.IsAny<CancellationToken>()))
                                  .ThrowsAsync(new Exception("DB failure"));

            var cacheMock = new Mock<IDistributedCache>();
            var controller = new InitDataController(contextMock.Object, cacheMock.Object);

            // Act
            var result = await controller.GetWuwaInitData();

            // Assert
            var objectResult = result.Should().BeOfType<ObjectResult>().Subject;
            objectResult.StatusCode.Should().Be(500);
        }
    }
}
