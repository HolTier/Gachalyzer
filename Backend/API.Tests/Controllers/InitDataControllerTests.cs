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
using API.Services.Cache;

namespace API.Tests.Controllers
{
    public class InitDataControllerTests
    {
        private readonly Mock<IGameStatRepository> _gameStatRepositoryMock;
        private readonly Mock<IGameArtifactNameRepository> _artifactRepoMock;
        private readonly Mock<ICachedDataService> _cachedDataServiceMock;
        private readonly InitDataController _controller;

        public InitDataControllerTests()
        {
            _gameStatRepositoryMock = new Mock<IGameStatRepository>();
            _artifactRepoMock = new Mock<IGameArtifactNameRepository>();
            _cachedDataServiceMock = new Mock<ICachedDataService>();

            _controller = new InitDataController(
                _gameStatRepositoryMock.Object,
                _cachedDataServiceMock.Object,
                _artifactRepoMock.Object
            );
        }

        [Fact]
        public async Task GetStatsInitData_ReturnsOkAndCallRepository_IfNotCached()
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

            _gameStatRepositoryMock.Setup(r => r.GetAllStatsWithMetaAsync())
                .ReturnsAsync(gameStats);

            _cachedDataServiceMock
                .Setup(c => c.GetOrSetCacheAsync(
                    "StatsInitData",
                    It.IsAny<Func<Task<IEnumerable<GameStatDto>>>>()
                ))
                .Returns<string, Func<Task<IEnumerable<GameStatDto>>>>(
                    (_, func) => func().ContinueWith(t => t.Result.ToList())
                );


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

            _cachedDataServiceMock
                .Setup(c => c.GetOrSetCacheAsync(
                    "StatsInitData",
                    It.IsAny<Func<Task<IEnumerable<GameStatDto>>>>()
                ))
                .ReturnsAsync(cachedDto);

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
            _gameStatRepositoryMock
                .Setup(r => r.GetAllStatsWithMetaAsync())
                .ReturnsAsync(new List<GameStatDto>());

            _cachedDataServiceMock
                .Setup(c => c.GetOrSetCacheAsync(
                    "StatsInitData",
                    It.IsAny<Func<Task<IEnumerable<GameStatDto>>>>()
                ))
                .Returns<string, Func<Task<IEnumerable<GameStatDto>>>>(
                    (_, func) => func().ContinueWith(t => t.Result.ToList())
                );

            // Act
            var result = await _controller.GetStatsInitData();

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            var dto = okResult.Value.Should().BeAssignableTo<IEnumerable<GameStatDto>>().Subject.ToList();
            dto.Should().NotBeNull();
            dto.Should().BeEmpty();
            _gameStatRepositoryMock.Verify(r => r.GetAllStatsWithMetaAsync(), Times.Once);
        }

        [Fact]
        public async Task GetStatsInitData_Returns500_WhenDbThrows()
        {
            // Arrange
            _gameStatRepositoryMock
                .Setup(r => r.GetAllStatsWithMetaAsync())
                .ThrowsAsync(new Exception("Database error"));

            _cachedDataServiceMock
                .Setup(c => c.GetOrSetCacheAsync(
                    "StatsInitData",
                    It.IsAny<Func<Task<IEnumerable<GameStatDto>>>>()
                ))
                .Returns<string, Func<Task<IEnumerable<GameStatDto>>>>(
                    (_, func) => func().ContinueWith(t => t.Result.ToList())
                );

            // Act
            var result = await _controller.GetStatsInitData();

            // Assert
            var objectResult = result.Should().BeOfType<ObjectResult>().Subject;
            objectResult.StatusCode.Should().Be(500);
            _gameStatRepositoryMock.Verify(r => r.GetAllStatsWithMetaAsync(), Times.Once);
        }
    }
}
