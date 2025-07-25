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
        public DbSet<GameArtifactName> GameArtifactNames { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<GameStat>().ToTable("GameStats");
        }
    }
}
