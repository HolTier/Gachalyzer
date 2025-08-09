using API.Dtos;
using API.Models;
using API.Repositories;
using API.Services.Cache;
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
        private readonly ICharacterRepository _characterRepository;
        private readonly IGameRepository _gameRepository;
        private readonly ICharacterElementRepository _characterElementRepository;
        private readonly ICharacterWeaponTypeRepository _characterWeaponTypeRepository;
        private readonly ICachedDataService _cachedDataService;
        private readonly IDistributedCache _cache;
        private readonly IImageService _imageService;
        private readonly IMapper _mapper;

        public CharacterController(ICharacterRepository characterRepository, ICachedDataService cachedDataService,
            IImageService imageService, IGameRepository gameRepository, IMapper mapper, IDistributedCache cache,
            ICharacterElementRepository characterElementRepository, ICharacterWeaponTypeRepository characterWeaponTypeRepository)
        {
            _characterRepository = characterRepository;
            _cachedDataService = cachedDataService;
            _imageService = imageService;
            _gameRepository = gameRepository;
            _characterElementRepository = characterElementRepository;
            _characterWeaponTypeRepository = characterWeaponTypeRepository;
            _mapper = mapper;
            _cache = cache;
        }

        [HttpPost("add-character")]
        public async Task<IActionResult> PostNewCharacterAsync([FromForm] CharacterAddDto character)
        {
            try
            {
                var game = await _gameRepository.GetByIdAsync(character.GameId);
                if (game == null) return BadRequest("Invalid game Id");

                var characterElement = _cachedDataService.GetOrSetCacheAsync(
                    $"characterElement:{character.CharacterElementId}",
                    () => _characterElementRepository.GetByIdAsync(character.CharacterElementId)
                ).Result;
                if (characterElement == null) return BadRequest("Invalid character element Id");

                var characterWeaponType = _cachedDataService.GetOrSetCacheAsync(
                    $"characterWeaponType:{character.CharacterWeaponTypeId}",
                    () => _characterWeaponTypeRepository.GetByIdAsync(character.CharacterWeaponTypeId)
                ).Result;
                if (characterWeaponType == null) return BadRequest("Invalid character weapon type Id");

                int? imageId = null;
                if (character.Image != null && character.Image.Length > 0)
                {
                    var image = await _imageService.SaveImageAsync(character.Image, game.Name, character.Name);
                    imageId = image.Id;
                }

                int? iconId = null;
                if (character.Icon != null && character.Icon.Length > 0)
                {
                    var icon = await _imageService.SaveImageAsync(character.Icon, game.Name + "-icons", character.Name);
                    iconId = icon.Id;
                }

                var newCharacter = new Character
                {
                    Name = character.Name,
                    GameId = character.GameId,
                    CharacterElementId = character.CharacterElementId,
                    CharacterWeaponTypeId = character.CharacterWeaponTypeId,
                    ImageId = imageId,
                    IconId = iconId,
                };

                await _characterRepository.AddAsync(newCharacter);

                await _cachedDataService.ClearCacheAsync($"characters:gameId:{character.GameId}");
                await _cachedDataService.ClearCacheAsync($"characters:game:{game.Name}");
                await _cachedDataService.ClearCacheAsync("characters:all");

                var characterResponse = _mapper.Map<CharacterDto>(newCharacter);
                return Ok(characterResponse);
            }
            catch(Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
