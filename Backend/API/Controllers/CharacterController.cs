using API.Dtos;
using API.Models;
using API.Repositories;
using API.Services.Cache;
using API.Services.Characters;
using API.Services.Images;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CharacterController : ControllerBase
    {
        private readonly ICharacterService _characterService;

        public CharacterController(ICharacterService characterService)
        {
            _characterService = characterService;
        }

        [HttpPost("add-character")]
        public async Task<IActionResult> PostNewCharacterAsync([FromForm] CharacterAddDto character)
        {
            try
            {
                var result = await _characterService.AddCharacterAsync(character);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("get-characters")]
        public async Task<IActionResult> GetCharactersAsync()
        {
            try
            {
                var characters = await _characterService.GetAllCharactersAsync();
                return Ok(characters);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
