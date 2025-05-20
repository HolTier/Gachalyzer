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
        public DbSet<WuwaSubStat> WuwaSubStats { get; set; }

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

            // Configure the WuwaSubStat entity
            modelBuilder.Entity<WuwaSubStat>()
                .ToTable("WuwaSubStats")
                .HasKey(w => w.Id);
            modelBuilder.Entity<WuwaSubStat>()
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
                new WuwaMainStat { Id = 11, Name = "ATK" },
                new WuwaMainStat { Id = 12, Name = "Crit. Rate" },
                new WuwaMainStat { Id = 13, Name = "Crit. DMG" },
                new WuwaMainStat { Id = 14, Name = "Healing Bonus" }
            );

            modelBuilder.Entity<WuwaSubStat>().HasData(
                new WuwaSubStat { Id = 1, Name = "HP" },
                new WuwaSubStat { Id = 2, Name = "ATK" },
                new WuwaSubStat { Id = 3, Name = "DEF" },
                new WuwaSubStat { Id = 4, Name = "Energy Regen" },
                new WuwaSubStat { Id = 5, Name = "Crit. Rate" },
                new WuwaSubStat { Id = 6, Name = "Crit. DMG" },
                new WuwaSubStat { Id = 8, Name = "ATK%" },
                new WuwaSubStat { Id = 9, Name = "DEF%" },
                new WuwaSubStat { Id = 10, Name = "HP%" },
                new WuwaSubStat { Id = 11, Name = "Basic Attack DMG Bonus" },
                new WuwaSubStat { Id = 12, Name = "Heavy Attack DMG Bonus" },
                new WuwaSubStat { Id = 13, Name = "Resonance Skill DMG Bonus" },
                new WuwaSubStat { Id = 14, Name = "Resonance Liberation DMG Bonus" }
            );
        }
    }
}
