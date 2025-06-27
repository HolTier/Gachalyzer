using Microsoft.EntityFrameworkCore;
using API.Models;

namespace API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // DbSets for the entities
        public DbSet<WuwaMainStat> WuwaMainStats { get; set; }
        public DbSet<GameStat> WuwaSubStats { get; set; }

        public DbSet<Game> Games { get; set; }
        public DbSet<GameStat> GameStats { get; set; }
        public DbSet<StatType> StatTypes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Seeding initial data
            // Games
            modelBuilder.Entity<Game>().HasData(
                new Game { Id = 1, Name = "Wuthering Waves", MaxMainStats = 1, MaxSubStats = 4 }
            );

            // StatTypes
            modelBuilder.Entity<StatType>().HasData(
                new StatType { Id = 1, Name = "Main" },
                new StatType { Id = 2, Name = "Sub"}
            );

            // Wuwa Main Stats
            modelBuilder.Entity<GameStat>().HasData(
                new GameStat { Id = 1, Name = "HP%", GameId = 1, StatTypeId = 1 },
                new GameStat { Id = 2, Name = "ATK%", GameId = 1, StatTypeId = 1 },
                new GameStat {Id = 3, Name = "DEF%", GameId = 1, StatTypeId = 1 },
                new GameStat {Id = 4, Name = "Glacio DMG Bonus", GameId = 1, StatTypeId = 1 },
                new GameStat {Id = 5, Name = "Fusion DMG Bonus", GameId = 1, StatTypeId = 1 },
                new GameStat {Id = 6, Name = "Electro DMG Bonus", GameId = 1, StatTypeId = 1 },
                new GameStat {Id = 7, Name = "Aero DMG Bonus", GameId = 1, StatTypeId = 1 },
                new GameStat {Id = 8, Name = "Spectro DMG Bonus", GameId = 1, StatTypeId = 1 },
                new GameStat {Id = 9, Name = "Havoc DMG Bonus", GameId = 1, StatTypeId = 1 },
                new GameStat {Id = 10, Name = "Energy Regen", GameId = 1, StatTypeId = 1 },
                new GameStat {Id = 11, Name = "ATK", GameId = 1, StatTypeId = 1 },
                new GameStat {Id = 12, Name = "Crit. Rate", GameId = 1, StatTypeId = 1 },
                new GameStat {Id = 13, Name = "Crit. DMG", GameId = 1, StatTypeId = 1 },
                new GameStat {Id = 14, Name = "Healing Bonus", GameId = 1, StatTypeId = 1 }
            );

            // Wuwa Sub Stats
            modelBuilder.Entity<GameStat>().HasData(
                new GameStat {Id = 1, Name = "HP", GameId = 1, StatTypeId = 2 },
                new GameStat {Id = 2, Name = "ATK", GameId = 1, StatTypeId = 2 },
                new GameStat {Id = 3, Name = "DEF", GameId = 1, StatTypeId = 2 },
                new GameStat {Id = 4, Name = "Energy Regen", GameId = 1, StatTypeId = 2 },
                new GameStat {Id = 5, Name = "Crit. Rate", GameId = 1, StatTypeId = 2 },
                new GameStat {Id = 6, Name = "Crit. DMG", GameId = 1, StatTypeId = 2 },
                new GameStat {Id = 8, Name = "ATK%", GameId = 1, StatTypeId = 2 },
                new GameStat {Id = 9, Name = "DEF%", GameId = 1, StatTypeId = 2 },
                new GameStat {Id = 10, Name = "HP%", GameId = 1, StatTypeId = 2 },
                new GameStat {Id = 11, Name = "Basic Attack DMG Bonus", GameId = 1, StatTypeId = 2 },
                new GameStat {Id = 12, Name = "Heavy Attack DMG Bonus", GameId = 1, StatTypeId = 2 },
                new GameStat {Id = 13, Name = "Resonance Skill DMG Bonus", GameId = 1, StatTypeId = 2 },
                new GameStat {Id = 14, Name = "Resonance Liberation DMG Bonus", GameId = 1, StatTypeId = 2 }
            );
        }
    }
}
