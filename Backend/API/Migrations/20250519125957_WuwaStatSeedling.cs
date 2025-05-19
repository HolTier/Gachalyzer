using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class WuwaStatSeedling : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "WuwaMainStats",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

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
                    { 5, "Crit Rate" },
                    { 6, "Crit DMG" },
                    { 8, "ATK%" },
                    { 9, "DEF%" },
                    { 10, "HP%" },
                    { 11, "Basic Attack DMG Bonus" },
                    { 12, "Heavy Attack DMG Bonus" },
                    { 13, "Resonance Skill DMG Bonus" },
                    { 14, "Resonance Liberation DMG Bonus" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);
        }
    }
}
