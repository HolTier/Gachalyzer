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
using API.Repositories;

namespace API.Tests.Controllers
{
    public class InitDataControllerTests
    {
        private readonly Mock<IDistributedCache> _cacheMock;
        private readonly InitDataController _controller;
        private readonly Mock<IGameStatRepository> _gameStatRepositoryMock;

        public InitDataControllerTests()
        {
            _gameStatRepositoryMock = new Mock<IGameStatRepository>();

            _cacheMock = new Mock<IDistributedCache>();
            _controller = new InitDataController(_gameStatRepositoryMock.Object, _cacheMock.Object);
        }

        [Fact]
        public async Task GetStatsInitData_ReturnsOkAndCachesResult_WithDbData()
        {
            // Arrange
            var gameStats = new List<GameStatDto>
            {
                new GameStatDto
                {
                    Id = 1,
                    Name = "HP%",
                    GameId = 1,
                    GameName = "Wuthering Waves",
                    StatTypeId = 1,
                    StatTypeName = "Main"
                }
            };

            _cacheMock.Setup(c => c.GetAsync("StatsInitData", It.IsAny<CancellationToken>()))
                .ReturnsAsync(null as byte[]);

            _gameStatRepositoryMock.Setup(r => r.GetAllStatsWithMetaAsync())
                .ReturnsAsync(gameStats);

            // Act
            var result = await _controller.GetStatsInitData();

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            var dto = okResult.Value.Should().BeAssignableTo<IEnumerable<GameStatDto>>().Subject.ToList();
            dto.Should().NotBeNull();
            dto.Should().ContainSingle();
            dto.Single().Name.Should().Be("HP%");
            dto.Single().GameName.Should().Be("Wuthering Waves");
            dto.Single().StatTypeName.Should().Be("Main");
            _gameStatRepositoryMock.Verify(r => r.GetAllStatsWithMetaAsync(), Times.Once);

            _cacheMock.Verify(c => c.SetAsync(
                "StatsInitData",
                It.IsAny<byte[]>(),
                It.IsAny<DistributedCacheEntryOptions>(),
                It.IsAny<CancellationToken>()),
                Times.Once);
        }

        [Fact]
        public async Task GetStatsInitData_ReturnsCachedData_WhenAvailable()
        {
            // Arrange
            var cachedDto = new List<GameStatDto>
            {
                new GameStatDto
                {
                    Id = 1,
                    Name = "HP%",
                    GameId = 1,
                    GameName = "Wuthering Waves",
                    StatTypeId = 1,
                    StatTypeName = "Main"
                }
            };

            var cachedData = System.Text.Json.JsonSerializer.Serialize(cachedDto);
            _cacheMock.Setup(c => c.GetAsync("StatsInitData", It.IsAny<CancellationToken>()))
                .ReturnsAsync(Encoding.UTF8.GetBytes(cachedData));

            // Act
            var result = await _controller.GetStatsInitData();

            // Assert
            var okResult = result.Should().BeAssignableTo<OkObjectResult>().Subject;
            var dto = okResult.Value.Should().BeAssignableTo<IEnumerable<GameStatDto>>().Subject.ToList();
            dto.Should().NotBeNull();
            dto.Should().ContainSingle();
            dto.Single().Name.Should().Be("HP%");
            dto.Single().GameName.Should().Be("Wuthering Waves");
            dto.Single().StatTypeName.Should().Be("Main");
            _gameStatRepositoryMock.Verify(r => r.GetAllStatsWithMetaAsync(), Times.Never);
        }

        [Fact]
        public async Task GetStatsInitData_ReturnOk_WhenNoData()
        {
            // Arrange
            _cacheMock.Setup(c => c.GetAsync("StatsInitData", It.IsAny<CancellationToken>()))
                .ReturnsAsync(null as byte[]);

            // Act
            var result = await _controller.GetStatsInitData();

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            var dto = okResult.Value.Should().BeAssignableTo<IEnumerable<GameStatDto>>().Subject.ToList();
            dto.Should().NotBeNull();
            dto.Should().BeEmpty();
            _gameStatRepositoryMock.Verify(r => r.GetAllStatsWithMetaAsync(), Times.Once);
        }

        // TODO: Change after refactor.
        [Fact]
        public async Task GetStatsInitData_Returns500_WhenDbThrows()
        {
            // Arrange
            _cacheMock.Setup(c => c.GetAsync("StatsInitData", It.IsAny<CancellationToken>()))
                .ReturnsAsync(null as byte[]);
            _gameStatRepositoryMock.Setup(r => r.GetAllStatsWithMetaAsync())
                .ThrowsAsync(new Exception("Database error"));

            // Act
            var result = await _controller.GetStatsInitData();

            // Assert
            var objectResult = result.Should().BeOfType<ObjectResult>().Subject;
            objectResult.StatusCode.Should().Be(500);
            _gameStatRepositoryMock.Verify(r => r.GetAllStatsWithMetaAsync(), Times.Once);
        }
    }
}
