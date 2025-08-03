using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public class ImageRepository : GenericRepository<Image>, IImageRepository
    {
        public ImageRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<int> CountByStatusAsync(int statusId)
        {
            return await _dbSet.CountAsync(i => i.ImageStatusId == statusId);
        }

        public async Task<bool> ExistsAsync(string hash)
        {
            return await _dbSet.AnyAsync(i => i.Hash == hash);
        }

        public async Task<Image?> GetByHashAsync(string hash)
        {
            return await _dbSet
                .Include(i => i.Tags)
                .Include(i => i.ImageStatus)
                .FirstOrDefaultAsync(i => i.Hash == hash);
        }

        public async Task<Image?> GetBySplashArtAndHashAsync(string splashArtPath, string hash)
        {
            return await _dbSet
                .Include(i => i.Tags)
                .Include(i => i.ImageStatus)
                .FirstOrDefaultAsync(i => i.SplashArtPath == splashArtPath && i.Hash == hash);
        }

        public async Task<IEnumerable<Image>> GetBySplashArtAsync(string fileName)
        {
            return await _dbSet
                .Include(i => i.Tags)
                .Include(i => i.ImageStatus)
                .Where(i => i.SplashArtPath == fileName)
                .ToListAsync();
        }

        public async Task<IEnumerable<Image>> GetByStatusAsync(int statusId)
        {
            return await _dbSet
                .Include(i => i.Tags)
                .Include(i => i.ImageStatus)
                .Where(i => i.ImageStatusId == statusId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Image>> GetByTagAsync(int tagId)
        {
            return await _dbSet
                .Include(i => i.Tags)
                .Include(i => i.ImageStatus)
                .Where(i => i.Tags.Any(t => t.Id == tagId))
                .ToListAsync();
        }

        public async Task<Image?> GetByTagNameAsync(string tagName)
        {
            return await _dbSet
                .Include(i => i.Tags)
                .Include(i => i.ImageStatus)
                .FirstOrDefaultAsync(i => i.Tags.Any(t => t.Name == tagName));
        }
    }
}
