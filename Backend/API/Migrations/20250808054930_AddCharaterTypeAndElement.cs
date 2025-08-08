using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class AddCharaterTypeAndElement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CharacterElementId",
                table: "Characters",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CharacterGameTypeId",
                table: "Characters",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "CharacterElements",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    GameId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CharacterElements", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CharacterElements_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CharacterGameTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    GameId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CharacterGameTypes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CharacterGameTypes_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Characters_CharacterElementId",
                table: "Characters",
                column: "CharacterElementId");

            migrationBuilder.CreateIndex(
                name: "IX_Characters_CharacterGameTypeId",
                table: "Characters",
                column: "CharacterGameTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_CharacterElements_GameId",
                table: "CharacterElements",
                column: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_CharacterGameTypes_GameId",
                table: "CharacterGameTypes",
                column: "GameId");

            migrationBuilder.AddForeignKey(
                name: "FK_Characters_CharacterElements_CharacterElementId",
                table: "Characters",
                column: "CharacterElementId",
                principalTable: "CharacterElements",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Characters_CharacterGameTypes_CharacterGameTypeId",
                table: "Characters",
                column: "CharacterGameTypeId",
                principalTable: "CharacterGameTypes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Characters_CharacterElements_CharacterElementId",
                table: "Characters");

            migrationBuilder.DropForeignKey(
                name: "FK_Characters_CharacterGameTypes_CharacterGameTypeId",
                table: "Characters");

            migrationBuilder.DropTable(
                name: "CharacterElements");

            migrationBuilder.DropTable(
                name: "CharacterGameTypes");

            migrationBuilder.DropIndex(
                name: "IX_Characters_CharacterElementId",
                table: "Characters");

            migrationBuilder.DropIndex(
                name: "IX_Characters_CharacterGameTypeId",
                table: "Characters");

            migrationBuilder.DropColumn(
                name: "CharacterElementId",
                table: "Characters");

            migrationBuilder.DropColumn(
                name: "CharacterGameTypeId",
                table: "Characters");
        }
    }
}
