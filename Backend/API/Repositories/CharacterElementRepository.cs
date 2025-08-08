using API.Data;
using API.Models;

namespace API.Repositories
{
    public class CharacterElementRepository : GenericRepository<CharacterElement>, ICharacterElementRepository
    {
        public CharacterElementRepository(AppDbContext context) : base(context)
        {
        }
    }
}
