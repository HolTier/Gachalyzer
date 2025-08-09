using API.Data;
using API.Models.CharacterModels;

namespace API.Repositories.CharacterRepositories
{
    public class CharacterElementRepository : GenericRepository<CharacterElement>, ICharacterElementRepository
    {
        public CharacterElementRepository(AppDbContext context) : base(context)
        {
        }
    }
}
