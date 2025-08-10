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
        private readonly ICharacterStatTypeRepository _characterStatTypeRepository;
        private readonly ICharacterStatScalingRepository _characterStatScalingRepository;
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
            ICharacterStatTypeRepository characterStatTypeRepository,
            ICharacterStatScalingRepository characterStatScalingRepository,
            IMapper mapper)
        {
            _characterRepository = characterRepository;
            _gameRepository = gameRepository;
            _characterElementRepository = characterElementRepository;
            _characterWeaponTypeRepository = characterWeaponTypeRepository;
            _cachedDataService = cachedDataService;
            _imageService = imageService;
            _characterStatTypeRepository = characterStatTypeRepository;
            _characterStatScalingRepository = characterStatScalingRepository;
            _mapper = mapper;
        }

        public async Task<CharacterDto> AddCharacterAsync(CharacterAddDto character)
        {
            var characterValidated = await ValidateCharacter(character);

            foreach (var scaling in character.CharacterStatScaling)
            {
                if (!await ValidateCharacterStatScalingAsync(scaling, character.GameId))
                {
                    throw new ArgumentException("Invalid character stat scaling.");
                }
            }

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

            var characterStatScalings = character.CharacterStatScaling.Select(scaling => new CharacterStatScaling
            {
                CharacterId = newCharacter.Id,
                CharacterStatTypeId = scaling.StatTypeId,
                Level = scaling.Level,
                Value = scaling.Value,
                IsBreakpoint = scaling.IsBreakpoint
            }).ToList();

            await _characterStatScalingRepository.AddRangeAsync(characterStatScalings);

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

        private async Task<bool> ValidateCharacterStatScalingAsync(CharacterStatScalingAddDto scalingDto, int gameId)
        {
            if (scalingDto == null)
                throw new ArgumentException("Scaling DTO is null.");

            if (scalingDto.StatTypeId <= 0)
                throw new ArgumentException("Invalid StatTypeId.");

            if (scalingDto.Level < 1)
                throw new ArgumentException("Level must be >= 1.");

            if (scalingDto.Value < 0)
                throw new ArgumentException("Value must be non-negative.");

            var statType = await _characterStatTypeRepository.GetByIdAsync(scalingDto.StatTypeId)
                ?? throw new ArgumentException("StatType does not exist.");

            return true;
        }

        public async Task<List<CharacterShowDto>> GetAllCharactersAsync()
        {
            try
            {
                var data = await _cachedDataService.GetOrSetCacheAsync(
                    "characters:all",
                    () => _characterRepository.GetAllCharacterShowDtosAsync()
                );
                return data?.ToList() ?? new List<CharacterShowDto>();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving characters: {ex.Message}", ex);
            }
        }
    }
}
