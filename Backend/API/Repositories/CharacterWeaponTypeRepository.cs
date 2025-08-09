using API.Data;
using API.Models;

namespace API.Repositories
{
    public class CharacterWeaponTypeRepository : GenericRepository<CharacterWeaponType>, ICharacterWeaponTypeRepository
    {
        public CharacterWeaponTypeRepository(AppDbContext context) : base(context)
        {
        }
    }
}
