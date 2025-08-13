using API.Dtos;
using API.Models;

namespace API.Repositories
{
    public interface IImageRepository : IGenericRepository<Image>
    {
        Task<Image?> GetByHashAsync(string hash);
        Task<Image?> GetBySplashArtAndHashAsync(string splashArtPath, string hash);
        Task<IEnumerable<Image>> GetByStatusAsync(int statusId);
        Task<IEnumerable<Image>> GetByTagAsync(int tagId);
        Task<Image?> GetByTagNameAsync(string tagName);
        Task<IEnumerable<Image>> GetBySplashArtAsync(string fileName);
        Task<bool> ExistsAsync(string hash);
        Task<int> CountByStatusAsync(int statusId);
        Task<ImagePageResult?> GetByPageAsync(int pageNumber, int pageSize);
    }
}
