using Microsoft.EntityFrameworkCore;
using API.Models;

namespace API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<WuwaMainStat> WuwaMainStats { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure the WuwaMainStat entity
            modelBuilder.Entity<WuwaMainStat>()
                .ToTable("WuwaMainStats")
                .HasKey(w => w.Id);
            modelBuilder.Entity<WuwaMainStat>()
                .Property(w => w.Name)
                .IsRequired()
                .HasMaxLength(100);

            // Seeding initial data
            modelBuilder.Entity<WuwaMainStat>().HasData(
                new WuwaMainStat { Id = 1, Name = "HP%" },
                new WuwaMainStat { Id = 2, Name = "ATK%" },
                new WuwaMainStat { Id = 3, Name = "DEF%" },
                new WuwaMainStat { Id = 4, Name = "Glacio DMG Bonus" },
                new WuwaMainStat { Id = 5, Name = "Fusion DMG Bonus" },
                new WuwaMainStat { Id = 6, Name = "Electro DMG Bonus" },
                new WuwaMainStat { Id = 7, Name = "Aero DMG Bonus" },
                new WuwaMainStat { Id = 8, Name = "Spectro DMG Bonus" },
                new WuwaMainStat { Id = 9, Name = "Havoc DMG Bonus" },
                new WuwaMainStat { Id = 10, Name = "Energy Regen" },
                new WuwaMainStat { Id = 11, Name = "ATK" }
            );
        }
    }
}
