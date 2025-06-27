using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class RefactorOfStats : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WuwaSubStats");

            migrationBuilder.DeleteData(
                table: "WuwaMainStats",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "WuwaMainStats",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "WuwaMainStats",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "WuwaMainStats",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "WuwaMainStats",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "WuwaMainStats",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "WuwaMainStats",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "WuwaMainStats",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "WuwaMainStats",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "WuwaMainStats",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "WuwaMainStats",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "WuwaMainStats",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "WuwaMainStats",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "WuwaMainStats",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "WuwaMainStats",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);

            migrationBuilder.CreateTable(
                name: "Games",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    MaxMainStats = table.Column<int>(type: "integer", nullable: false),
                    MaxSubStats = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Games", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "StatTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StatTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "GameStat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    StatTypeId = table.Column<int>(type: "integer", nullable: false),
                    GameId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameStat", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GameStat_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GameStat_StatTypes_StatTypeId",
                        column: x => x.StatTypeId,
                        principalTable: "StatTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Games",
                columns: new[] { "Id", "MaxMainStats", "MaxSubStats", "Name" },
                values: new object[] { 1, 1, 4, "Wuthering Waves" });

            migrationBuilder.InsertData(
                table: "StatTypes",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Main" },
                    { 2, "Sub" }
                });

            migrationBuilder.InsertData(
                table: "GameStat",
                columns: new[] { "Id", "GameId", "Name", "StatTypeId" },
                values: new object[,]
                {
                    { 1, 1, "HP%", 1 },
                    { 2, 1, "ATK%", 1 },
                    { 3, 1, "DEF%", 1 },
                    { 4, 1, "Glacio DMG Bonus", 1 },
                    { 5, 1, "Fusion DMG Bonus", 1 },
                    { 6, 1, "Electro DMG Bonus", 1 },
                    { 7, 1, "Aero DMG Bonus", 1 },
                    { 8, 1, "Spectro DMG Bonus", 1 },
                    { 9, 1, "Havoc DMG Bonus", 1 },
                    { 10, 1, "Energy Regen", 1 },
                    { 11, 1, "ATK", 1 },
                    { 12, 1, "Crit. Rate", 1 },
                    { 13, 1, "Crit. DMG", 1 },
                    { 14, 1, "Healing Bonus", 1 },
                    { 15, 1, "HP", 2 },
                    { 16, 1, "ATK", 2 },
                    { 17, 1, "DEF", 2 },
                    { 18, 1, "Energy Regen", 2 },
                    { 19, 1, "Crit. Rate", 2 },
                    { 20, 1, "Crit. DMG", 2 },
                    { 21, 1, "ATK%", 2 },
                    { 22, 1, "DEF%", 2 },
                    { 23, 1, "HP%", 2 },
                    { 24, 1, "Basic Attack DMG Bonus", 2 },
                    { 25, 1, "Heavy Attack DMG Bonus", 2 },
                    { 26, 1, "Resonance Skill DMG Bonus", 2 },
                    { 27, 1, "Resonance Liberation DMG Bonus", 2 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_GameStat_GameId",
                table: "GameStat",
                column: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_GameStat_StatTypeId",
                table: "GameStat",
                column: "StatTypeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GameStat");

            migrationBuilder.DropTable(
                name: "Games");

            migrationBuilder.DropTable(
                name: "StatTypes");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "WuwaMainStats",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "WuwaSubStats",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WuwaSubStats", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "WuwaMainStats",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "HP%" },
                    { 2, "ATK%" },
                    { 3, "DEF%" },
                    { 4, "Glacio DMG Bonus" },
                    { 5, "Fusion DMG Bonus" },
                    { 6, "Electro DMG Bonus" },
                    { 7, "Aero DMG Bonus" },
                    { 8, "Spectro DMG Bonus" },
                    { 9, "Havoc DMG Bonus" },
                    { 10, "Energy Regen" },
                    { 11, "ATK" },
                    { 12, "Crit. Rate" },
                    { 13, "Crit. DMG" },
                    { 14, "Healing Bonus" }
                });

            migrationBuilder.InsertData(
                table: "WuwaSubStats",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "HP" },
                    { 2, "ATK" },
                    { 3, "DEF" },
                    { 4, "Energy Regen" },
                    { 5, "Crit. Rate" },
                    { 6, "Crit. DMG" },
                    { 8, "ATK%" },
                    { 9, "DEF%" },
                    { 10, "HP%" },
                    { 11, "Basic Attack DMG Bonus" },
                    { 12, "Heavy Attack DMG Bonus" },
                    { 13, "Resonance Skill DMG Bonus" },
                    { 14, "Resonance Liberation DMG Bonus" }
                });
        }
    }
}
