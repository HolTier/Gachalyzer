using System.Text.Json;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public record SeedEntry<T>(DbSet<T> DbSet, string FileName) where T : class;

    public class DbSeeder
    {
        private const string SeedDataFolder = "SeedData";
        private const string GameStatsSeed = "GameStatsSeed.json";
        private const string GameSeed = "GameSeed.json";
        private const string StatTypesSeed = "StatTypes.json";

        public static async Task SeedAsync(IServiceProvider serviceProvider, IWebHostEnvironment env)
        {
            
            if (!env.IsDevelopment()) return;

            using var scope = serviceProvider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            await db.Database.EnsureCreatedAsync();

            await SeedFromJsonAsync(db, Path.Combine(SeedDataFolder, GameStatsSeed), db.GameStats);
            await SeedFromJsonAsync(db, Path.Combine(SeedDataFolder, GameSeed), db.Games);
            await SeedFromJsonAsync(db, Path.Combine(SeedDataFolder, StatTypesSeed), db.StatTypes);
        }

        private static async Task SeedFromJsonAsync<T>(DbContext db, string filePath, DbSet<T> dbSet) where T : class
        {
            if (await dbSet.AnyAsync()) return;

            if (!File.Exists(filePath)) return;

            var json = await File.ReadAllTextAsync(filePath);
            var records = JsonSerializer.Deserialize<List<T>>(json);

            if (records?.Count > 0)
            {
                await dbSet.AddRangeAsync(records);
                await db.SaveChangesAsync();
            }
        }
    }
}
