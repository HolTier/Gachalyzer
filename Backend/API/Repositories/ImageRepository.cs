using API.Data;
using API.Models;

namespace API.Repositories
{
    public class ImageRepository : GenericRepository<Image>, IImageRepository
    {
        public ImageRepository(AppDbContext context) : base(context)
        {
        }
    }
}
