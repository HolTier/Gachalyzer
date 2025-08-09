using System.Text.Json;
using API.Data;
using API.Dtos;
using API.Repositories;
using API.Services.Cache;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InitDataController : ControllerBase
    {
        private readonly IGameStatRepository _gameStatRepository;
        private readonly IGameArtifactNameRepository _gameArtifactNameRepository;
        private readonly ICharacterRepository _characterRepository;
        private readonly IGameRepository _gameRepository;
        private readonly ICharacterElementRepository _characterElementRepository;
        private readonly ICharacterWeaponTypeRepository _characterWeaponTypeRepository;
        private readonly ICachedDataService _cachedDataService;

        public InitDataController(IGameStatRepository gameStatRepository, ICachedDataService cachedDataService,
            IGameArtifactNameRepository gameArtifactNameRepository, ICharacterRepository characterRepository,
            IGameRepository gameRepository, ICharacterElementRepository characterElementRepository,
            ICharacterWeaponTypeRepository characterWeaponTypeRepository)
        {
            _gameStatRepository = gameStatRepository;
            _gameArtifactNameRepository = gameArtifactNameRepository;
            _cachedDataService = cachedDataService;
            _characterRepository = characterRepository;
            _gameRepository = gameRepository;
            _characterElementRepository = characterElementRepository;
            _characterWeaponTypeRepository = characterWeaponTypeRepository;
        }

        [HttpGet("init-game-stats")]
        public async Task<IActionResult> GetStatsInitData()
        {
            try
            {
                var data = await _cachedDataService.GetOrSetCacheAsync(
                        "StatsInitData",
                        () => _gameStatRepository.GetAllStatsWithMetaAsync()
                );
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server error: " + ex.Message);
            }
        }

        [HttpGet("init-game-artifact-name")]
        public async Task<IActionResult> GetGameArtifactNames()
        {
            try
            {
                var data = await _cachedDataService.GetOrSetCacheAsync(
                        "artifact:all",
                        () => _gameArtifactNameRepository.GetAllAsync()
                );
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server error: " + ex.Message);
            }
        }

        [HttpGet("inti-characters")]
        public async Task<IActionResult> GetCharacters()
        {
            try
            {
                var data = await _cachedDataService.GetOrSetCacheAsync(
                        "characters:all",
                        () => _characterRepository.GetAllCharacterBaseDtosAsync()
                );
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server error: " + ex.Message);
            }
        }

        [HttpGet("init-characters/name/{gameName}")]
        public async Task<IActionResult> GetCharactersByGameName(string gameName)
        {
            try
            {
                var data = await _cachedDataService.GetOrSetCacheAsync(
                        $"characters:game:{gameName}",
                        () => _characterRepository.GetCharacterBaseDtosByGameNameAsync(gameName)
                );
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server error: " + ex.Message);
            }
        }

        [HttpGet("init-characters/{gameId}")]
        public async Task<IActionResult> GetCharactersByGameId(int gameId)
        {
            try
            {
                var data = await _cachedDataService.GetOrSetCacheAsync(
                        $"characters:gameId:{gameId}",
                        () => _characterRepository.GetCharacterBaseDtosByGameIdAsync(gameId)
                );
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server error: " + ex.Message);
            }
        }

        [HttpGet("init-game")]
        public async Task<IActionResult> GetGameInitData()
        {
            try
            {
                var data = await _cachedDataService.GetOrSetCacheAsync(
                        "game:all",
                        () => _gameRepository.GetAllAsync()
                );
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server error: " + ex.Message);
            }
        }

        [HttpGet("init-character-elements")]
        public async Task<IActionResult> GetCharacterElements()
        {
            try
            {
                var data = await _cachedDataService.GetOrSetCacheAsync(
                        "character:elements",
                        () => _characterElementRepository.GetAllAsync()
                );
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server error: " + ex.Message);
            }
        }

        [HttpGet("init-character-weapon-types")]
        public async Task<IActionResult> GetCharacterWeaponTypes()
        {
            try
            {
                var data = await _cachedDataService.GetOrSetCacheAsync(
                        "character:weaponTypes",
                        () => _characterWeaponTypeRepository.GetAllAsync()
                );
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server error: " + ex.Message);
            }
        }
    }
}
