using API.Repositories;
using API.Services.Cache;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CharacterController : ControllerBase
    {
        private readonly ICharacterRepository _characterRepository;
        private readonly ICachedDataService _cachedDataService;

        public CharacterController(ICharacterRepository characterRepository, ICachedDataService cachedDataService)
        {
            _characterRepository = characterRepository;
            _cachedDataService = cachedDataService;
        }


    }
}
