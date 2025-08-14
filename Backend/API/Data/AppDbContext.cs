using Microsoft.EntityFrameworkCore;
using API.Models;
using API.Models.CharacterModels;
using API.Models.GameModels;
using API.Models.WeaponModels;

namespace API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<WuwaMainStat> WuwaMainStats { get; set; }
        public DbSet<GameStat> WuwaSubStats { get; set; }

        public DbSet<Game> Games { get; set; }
        public DbSet<GameStat> GameStats { get; set; }
        public DbSet<StatType> StatTypes { get; set; }
        public DbSet<GameArtifactName> GameArtifactNames { get; set; }

        public DbSet<Character> Characters { get; set; }
        public DbSet<CharacterStatType> CharacterStatTypes {  get; set; }
        public DbSet<CharacterStatScaling> CharacterStatScalings {  get; set; }
        public DbSet<CharacterWeaponType> CharacterWeaponTypes { get; set; }
        public DbSet<CharacterElement> CharacterElements { get; set; }

        public DbSet<Image> Images { get; set; }
        public DbSet<ImageStatus> ImageStatuses { get; set; }
        public DbSet<Tag> Tags { get; set; }

        public DbSet<Weapon> Weapons { get; set; }
        public DbSet<WeaponStatType> WeaponStatTypes { get; set; }
        public DbSet<WeaponStatScaling> WeaponStatScalings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<GameStat>().ToTable("GameStats");

            modelBuilder.Entity<Character>()
                .HasOne(c => c.Image)
                .WithMany(i => i.Characters)
                .HasForeignKey(c => c.ImageId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Character>()
                .HasOne(c => c.Icon)
                .WithMany()
                .HasForeignKey(c => c.IconId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Image>()
                .HasIndex(i => i.Tags)
                .HasMethod("gin");
        }
    }
}
