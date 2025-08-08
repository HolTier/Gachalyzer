using API.Data;
using API.Models;

namespace API.Repositories
{
    public class CharacterGameTypeRepository : GenericRepository<CharacterGameType>, ICharacterGameTypeRepository
    {
        public CharacterGameTypeRepository(AppDbContext context) : base(context)
        {
        }
    }
}
