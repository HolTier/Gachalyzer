using System.Text.Json;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public record SeedEntry<T>(DbSet<T> DbSet, string FileName) where T : class;

    public class DbSeeder
    {
        private const string SeedDataFolder = "Data/SeedData";
        private const string GameStatsSeed = "GameStatsSeed.json";
        private const string GameSeed = "GameSeed.json";
        private const string StatTypesSeed = "StatTypes.json";
        private const string GameArtifactNamesSeed = "GameArtifactNamesSeed.json";
        private const string ImageStatusesSeed = "ImageStatusesSeed.json";
        private const string CharacterWeaponTypesSeed = "CharacterWeaponTypesSeed.json";
        private const string CharacterElementsSeed = "CharacterElementsSeed.json";
        private const string CharacterStatTypesSeed = "CharacterStatTypesSeed.json";

        public static async Task SeedAsync(IServiceProvider serviceProvider, IWebHostEnvironment env)
        {

            if (!env.IsDevelopment()) return;

            using var scope = serviceProvider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            await db.Database.EnsureCreatedAsync();

            using var transaction = await db.Database.BeginTransactionAsync();
            try
            {
                await SeedFromJsonAsync(db, Path.Combine(SeedDataFolder, GameSeed), db.Games, env);
                await SeedFromJsonAsync(db, Path.Combine(SeedDataFolder, StatTypesSeed), db.StatTypes, env);
                await SeedFromJsonAsync(db, Path.Combine(SeedDataFolder, GameStatsSeed), db.GameStats, env);
                await SeedFromJsonAsync(db, Path.Combine(SeedDataFolder, GameArtifactNamesSeed), db.GameArtifactNames, env);
                await SeedFromJsonAsync(db, Path.Combine(SeedDataFolder, ImageStatusesSeed), db.ImageStatuses, env);
                await SeedFromJsonAsync(db, Path.Combine(SeedDataFolder, CharacterWeaponTypesSeed), db.CharacterWeaponTypes, env);
                await SeedFromJsonAsync(db, Path.Combine(SeedDataFolder, CharacterElementsSeed), db.CharacterElements, env);
                await SeedFromJsonAsync(db, Path.Combine(SeedDataFolder, CharacterStatTypesSeed), db.CharacterStatTypes, env);
                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error during seeding: {ex.Message}");
                await transaction.RollbackAsync();
                throw;
            }
        }

        private static async Task SeedFromJsonAsync<T>(
            DbContext db, 
            string filePath,
            DbSet<T> dbSet,
            IWebHostEnvironment env) where T : class
        {
            var fullPath = Path.Combine(env.ContentRootPath, filePath);
            Console.WriteLine($"Looking for seed file: {fullPath}");

            if (await dbSet.AnyAsync()) return;

            if (!File.Exists(fullPath)) return;
            var json = await File.ReadAllTextAsync(fullPath);

            var records = JsonSerializer.Deserialize<List<T>>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (records?.Count > 0)
            {
                await dbSet.AddRangeAsync(records);
                await db.SaveChangesAsync();
            }
        }
    }
}
