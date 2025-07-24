using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class DeleteDataSeeding : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "GameStat",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "GameStat",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "GameStat",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "GameStat",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "GameStat",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "GameStat",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "GameStat",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "GameStat",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "GameStat",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "GameStat",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "GameStat",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "GameStat",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "GameStat",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "GameStat",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "GameStat",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "GameStat",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "GameStat",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "GameStat",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "GameStat",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "GameStat",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "GameStat",
                keyColumn: "Id",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "GameStat",
                keyColumn: "Id",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "GameStat",
                keyColumn: "Id",
                keyValue: 23);

            migrationBuilder.DeleteData(
                table: "GameStat",
                keyColumn: "Id",
                keyValue: 24);

            migrationBuilder.DeleteData(
                table: "GameStat",
                keyColumn: "Id",
                keyValue: 25);

            migrationBuilder.DeleteData(
                table: "GameStat",
                keyColumn: "Id",
                keyValue: 26);

            migrationBuilder.DeleteData(
                table: "GameStat",
                keyColumn: "Id",
                keyValue: 27);

            migrationBuilder.DeleteData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "StatTypes",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "StatTypes",
                keyColumn: "Id",
                keyValue: 2);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
        }
    }
}
