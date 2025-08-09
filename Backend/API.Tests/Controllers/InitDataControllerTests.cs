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
        private readonly Mock<ICharacterRepository> _characterRepositoryMock;
        private readonly Mock<IGameRepository> _gameRepositoryMock;
        private readonly Mock<ICharacterWeaponTypeRepository> _characterWeaponTypeRepositoryMock;
        private readonly Mock<ICharacterElementRepository> _characterElementRepositoryMock;
        private readonly InitDataController _controller;

        public InitDataControllerTests()
        {
            _gameStatRepositoryMock = new Mock<IGameStatRepository>();
            _artifactRepoMock = new Mock<IGameArtifactNameRepository>();
            _cachedDataServiceMock = new Mock<ICachedDataService>();
            _characterRepositoryMock = new Mock<ICharacterRepository>();
            _gameRepositoryMock = new Mock<IGameRepository>();
            _characterWeaponTypeRepositoryMock = new Mock<ICharacterWeaponTypeRepository>();
            _characterElementRepositoryMock = new Mock<ICharacterElementRepository>();

            _controller = new InitDataController(
                _gameStatRepositoryMock.Object,
                _cachedDataServiceMock.Object,
                _artifactRepoMock.Object,
                _characterRepositoryMock.Object,
                _gameRepositoryMock.Object,
                _characterElementRepositoryMock.Object,
                _characterWeaponTypeRepositoryMock.Object
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
                    async (_, func) => await func().ContinueWith(t => t.Result.ToList())
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
                    async (_, func) => await func().ContinueWith(t => t.Result.ToList())
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
                    async (_, func) => await func().ContinueWith(t => t.Result.ToList())
                );

            // Act
            var result = await _controller.GetStatsInitData();

            // Assert
            var objectResult = result.Should().BeOfType<ObjectResult>().Subject;
            objectResult.StatusCode.Should().Be(500);
            _gameStatRepositoryMock.Verify(r => r.GetAllStatsWithMetaAsync(), Times.Once);
        }

        [Fact]
        public async Task GetGameArtifactNames_ReturnsOkAndCallRepository_IfNotCached()
        {
            // Arrange
            var artifactNames = new List<GameArtifactName>
            {
                    new GameArtifactName
                    {
                        Id = 1,
                        Name = "Test Artifact",
                        GameId = 1,
                    }
            };

            _artifactRepoMock
                .Setup(r => r.GetAllAsync())
                .ReturnsAsync(artifactNames);

            _cachedDataServiceMock
                .Setup(c => c.GetOrSetCacheAsync(
                    "artifact:all",
                    It.IsAny<Func<Task<IEnumerable<GameArtifactName>>>>()
                ))
                .Returns<string, Func<Task<IEnumerable<GameArtifactName>>>>(
                    async (_, func) => await func().ContinueWith(t => t.Result.ToList())
                );

            // Act
            var result = await _controller.GetGameArtifactNames();

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            var dto = okResult.Value.Should().BeAssignableTo<IEnumerable<GameArtifactName>>().Subject.ToList();
            dto.Should().NotBeNull();
            dto.Should().ContainSingle();
            dto.Single().Name.Should().Be("Test Artifact");
            _artifactRepoMock.Verify(r => r.GetAllAsync(), Times.Once);
        }

        [Fact]
        public async Task GetCharacters_ReturnOkAndCallRepository_IfNotCached()
        {
            // Arrange
            var characters = new List<CharacterBaseDto>
            {
                new CharacterBaseDto
                {
                    Id = 1,
                    Name = "TestCharacter",
                    GameId = 1,
                    GameName = "testGame",
                    SplashArtPath = "/Images/test.jpg",
                }
            };

            _characterRepositoryMock
                .Setup(r => r.GetAllCharacterBaseDtosAsync())
                .ReturnsAsync(characters);

            _cachedDataServiceMock
                .Setup(c => c.GetOrSetCacheAsync(
                    "characters:all",
                    It.IsAny<Func<Task<IEnumerable<CharacterBaseDto>>>>()
                ))
                .Returns<string, Func<Task<IEnumerable<CharacterBaseDto>>>>(
                    async (_, func) => await func().ContinueWith(t => t.Result.ToList())
                );

            // Act
            var result = await _controller.GetCharacters();

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            var dto = okResult.Value.Should().BeAssignableTo<IEnumerable<CharacterBaseDto>>().Subject.ToList();
            dto.Should().NotBeNull();
            dto.Should().ContainSingle();
            dto[0].Name.Should().Be("TestCharacter");
            _characterRepositoryMock.Verify(r => r.GetAllCharacterBaseDtosAsync(), Times.Once);
        }

        [Fact]
        public async Task GetCharactersByGameName_ReturnOkAndCallRepository_IfNotCached()
        {
            // Arrange
            string gameName = "testGame";
            var characters = new List<CharacterBaseDto>
            {
                new CharacterBaseDto
                {
                    Id = 1,
                    Name = "TestCharacter",
                    GameId = 1,
                    GameName = gameName,
                    SplashArtPath = "/Images/test.jpg",
                }
            };

            _characterRepositoryMock
               .Setup(r => r.GetCharacterBaseDtosByGameNameAsync(gameName))
               .ReturnsAsync(characters);

            _cachedDataServiceMock
                .Setup(c => c.GetOrSetCacheAsync(
                    $"characters:game:{gameName}",
                    It.IsAny<Func<Task<IEnumerable<CharacterBaseDto>>>>()
                ))
                .Returns<string, Func<Task<IEnumerable<CharacterBaseDto>>>>(
                    async (_, func) => await func().ContinueWith(t => t.Result.ToList())
                );

            // Act
            var result = await _controller.GetCharactersByGameName(gameName);

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            var dto = okResult.Value.Should().BeAssignableTo<IEnumerable<CharacterBaseDto>>().Subject.ToList();
            dto.Should().NotBeNull();
            dto.Should().ContainSingle();
            dto[0].Name.Should().Be("TestCharacter");
            _characterRepositoryMock.Verify(r => r.GetCharacterBaseDtosByGameNameAsync(gameName), Times.Once);
        }

        [Fact]
        public async Task GetCharactersByGameId_ReturnOkAndCallRepository_IfNotCached()
        {
            // Arrange
            int gameId = 1;
            var characters = new List<CharacterBaseDto>
            {
                new CharacterBaseDto
                {
                    Id = 1,
                    Name = "TestCharacter",
                    GameId = gameId,
                    GameName = "testGame",
                    SplashArtPath = "/Images/test.jpg",
                }
            };

            _characterRepositoryMock
               .Setup(r => r.GetCharacterBaseDtosByGameIdAsync(gameId))
               .ReturnsAsync(characters);

            _cachedDataServiceMock
                .Setup(c => c.GetOrSetCacheAsync(
                    $"characters:gameId:{gameId}",
                    It.IsAny<Func<Task<IEnumerable<CharacterBaseDto>>>>()
                ))
                .Returns<string, Func<Task<IEnumerable<CharacterBaseDto>>>>(
                    async (_, func) => await func().ContinueWith(t => t.Result.ToList())
                );

            // Act
            var result = await _controller.GetCharactersByGameId(gameId);

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            var dto = okResult.Value.Should().BeAssignableTo<IEnumerable<CharacterBaseDto>>().Subject.ToList();
            dto.Should().NotBeNull();
            dto.Should().ContainSingle();
            dto[0].Name.Should().Be("TestCharacter");
            _characterRepositoryMock.Verify(r => r.GetCharacterBaseDtosByGameIdAsync(gameId), Times.Once);
        }
    }
}
