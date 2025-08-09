using API.Data;
using API.Models.CharacterModels;

namespace API.Repositories.CharacterRepositories
{
    public class CharacterWeaponTypeRepository : GenericRepository<CharacterWeaponType>, ICharacterWeaponTypeRepository
    {
        public CharacterWeaponTypeRepository(AppDbContext context) : base(context)
        {
        }
    }
}
