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
        private readonly ICachedDataService _cachedDataService;

        public InitDataController(IGameStatRepository gameStatRepository, ICachedDataService cachedDataService, 
            IGameArtifactNameRepository gameArtifactNameRepository)
        {
            _gameStatRepository = gameStatRepository;
            _gameArtifactNameRepository = gameArtifactNameRepository;
            _cachedDataService = cachedDataService;
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
                        "artifcat:all",
                        () => _gameArtifactNameRepository.GetAllAsync()
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
