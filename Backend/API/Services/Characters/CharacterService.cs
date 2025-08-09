using API.Dtos;
using API.Models.CharacterModels;
using API.Repositories.CharacterRepositories;
using API.Repositories.GameRepositories;
using API.Services.Cache;
using API.Services.Images;
using AutoMapper;

namespace API.Services.Characters
{
    public class CharacterService : ICharacterService
    {
        private readonly ICharacterRepository _characterRepository;
        private readonly IGameRepository _gameRepository;
        private readonly ICharacterElementRepository _characterElementRepository;
        private readonly ICharacterWeaponTypeRepository _characterWeaponTypeRepository;
        private readonly ICachedDataService _cachedDataService;
        private readonly IImageService _imageService;
        private readonly IMapper _mapper;

        public CharacterService(
            ICharacterRepository characterRepository,
            IGameRepository gameRepository,
            ICharacterElementRepository characterElementRepository,
            ICharacterWeaponTypeRepository characterWeaponTypeRepository,
            ICachedDataService cachedDataService,
            IImageService imageService,
            IMapper mapper)
        {
            _characterRepository = characterRepository;
            _gameRepository = gameRepository;
            _characterElementRepository = characterElementRepository;
            _characterWeaponTypeRepository = characterWeaponTypeRepository;
            _cachedDataService = cachedDataService;
            _imageService = imageService;
            _mapper = mapper;
        }

        public async Task<CharacterDto> AddCharacterAsync(CharacterAddDto character)
        {
            var characterValidated = await ValidateCharacter(character);

            int? imageId = await SaveImageIfPresent(character.Image, characterValidated.GameName, character.Name);
            int? iconId = await SaveImageIfPresent(character.Icon, $"{characterValidated.GameName}-icons", character.Name);

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
            await _cachedDataService.ClearCacheAsync($"characters:game:{characterValidated.GameName}");
            await _cachedDataService.ClearCacheAsync("characters:all");

            return _mapper.Map<CharacterDto>(newCharacter);
        }

        private async Task<CharacterValidatedDto> ValidateCharacter(CharacterAddDto character)
        {
            if (character == null) throw new ArgumentException(nameof(character));
            var game = await _gameRepository.GetByIdAsync(character.GameId) 
                ?? throw new ArgumentException("Invalid game Id");

            var characterElement = await _cachedDataService.GetOrSetCacheAsync(
                $"characterElement:{character.CharacterElementId}",
                () => _characterElementRepository.GetByIdAsync(character.CharacterElementId)
            ) ?? throw new ArgumentException("Invalid character element Id");

            var characterWeaponType = await _cachedDataService.GetOrSetCacheAsync(
                $"characterWeaponType:{character.CharacterWeaponTypeId}",
                () => _characterWeaponTypeRepository.GetByIdAsync(character.CharacterWeaponTypeId)
            ) ?? throw new ArgumentException("Invalid character weapon type Id");

            return new CharacterValidatedDto
            {
                GameName = game.Name,
                CharacterElementName = characterElement.Name,
                CharacterWeaponTypeName = characterWeaponType.Name,
            };
        }

        private async Task<int?> SaveImageIfPresent(IFormFile? file, string folder, string name)
        {
            if (file != null && file.Length > 0)
            {
                var image = await _imageService.SaveImageAsync(file, folder, name);
                return image.Id;
            }
            return null;
        }
    }
}
