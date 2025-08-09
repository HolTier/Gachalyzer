using API.Data;
using API.Models.CharacterModels;

namespace API.Repositories.CharacterRepositories
{
    public class CharacterStatTypeRepository : GenericRepository<CharacterStatType>, ICharacterStatTypeRepository
    {
        public CharacterStatTypeRepository(AppDbContext context) : base(context)
        {
        }
    }
}
