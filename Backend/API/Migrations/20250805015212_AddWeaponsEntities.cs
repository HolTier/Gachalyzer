using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class AddWeaponsEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SplashArtPath",
                table: "Characters");

            migrationBuilder.AddColumn<int>(
                name: "ImageId",
                table: "GameArtifactNames",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ImageId",
                table: "Characters",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Weapons",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    GameId = table.Column<int>(type: "integer", nullable: false),
                    ImageId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Weapons", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Weapons_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Weapons_Images_ImageId",
                        column: x => x.ImageId,
                        principalTable: "Images",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "WeaponStatTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Unit = table.Column<string>(type: "text", nullable: true),
                    GameId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WeaponStatTypes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WeaponStatTypes_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WeaponStatScalings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    WeaponId = table.Column<int>(type: "integer", nullable: false),
                    WeaponStatTypeId = table.Column<int>(type: "integer", nullable: false),
                    Value = table.Column<int>(type: "integer", nullable: false),
                    Level = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WeaponStatScalings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WeaponStatScalings_WeaponStatTypes_WeaponStatTypeId",
                        column: x => x.WeaponStatTypeId,
                        principalTable: "WeaponStatTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_WeaponStatScalings_Weapons_WeaponId",
                        column: x => x.WeaponId,
                        principalTable: "Weapons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GameArtifactNames_ImageId",
                table: "GameArtifactNames",
                column: "ImageId");

            migrationBuilder.CreateIndex(
                name: "IX_Characters_ImageId",
                table: "Characters",
                column: "ImageId");

            migrationBuilder.CreateIndex(
                name: "IX_Weapons_GameId",
                table: "Weapons",
                column: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_Weapons_ImageId",
                table: "Weapons",
                column: "ImageId");

            migrationBuilder.CreateIndex(
                name: "IX_WeaponStatScalings_WeaponId",
                table: "WeaponStatScalings",
                column: "WeaponId");

            migrationBuilder.CreateIndex(
                name: "IX_WeaponStatScalings_WeaponStatTypeId",
                table: "WeaponStatScalings",
                column: "WeaponStatTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_WeaponStatTypes_GameId",
                table: "WeaponStatTypes",
                column: "GameId");

            migrationBuilder.AddForeignKey(
                name: "FK_Characters_Images_ImageId",
                table: "Characters",
                column: "ImageId",
                principalTable: "Images",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_GameArtifactNames_Images_ImageId",
                table: "GameArtifactNames",
                column: "ImageId",
                principalTable: "Images",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Characters_Images_ImageId",
                table: "Characters");

            migrationBuilder.DropForeignKey(
                name: "FK_GameArtifactNames_Images_ImageId",
                table: "GameArtifactNames");

            migrationBuilder.DropTable(
                name: "WeaponStatScalings");

            migrationBuilder.DropTable(
                name: "WeaponStatTypes");

            migrationBuilder.DropTable(
                name: "Weapons");

            migrationBuilder.DropIndex(
                name: "IX_GameArtifactNames_ImageId",
                table: "GameArtifactNames");

            migrationBuilder.DropIndex(
                name: "IX_Characters_ImageId",
                table: "Characters");

            migrationBuilder.DropColumn(
                name: "ImageId",
                table: "GameArtifactNames");

            migrationBuilder.DropColumn(
                name: "ImageId",
                table: "Characters");

            migrationBuilder.AddColumn<string>(
                name: "SplashArtPath",
                table: "Characters",
                type: "text",
                nullable: true);
        }
    }
}
