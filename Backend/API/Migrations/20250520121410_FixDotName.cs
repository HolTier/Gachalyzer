using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class FixDotName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "WuwaSubStats",
                keyColumn: "Id",
                keyValue: 5,
                column: "Name",
                value: "Crit. Rate");

            migrationBuilder.UpdateData(
                table: "WuwaSubStats",
                keyColumn: "Id",
                keyValue: 6,
                column: "Name",
                value: "Crit. DMG");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "WuwaSubStats",
                keyColumn: "Id",
                keyValue: 5,
                column: "Name",
                value: "Crit Rate");

            migrationBuilder.UpdateData(
                table: "WuwaSubStats",
                keyColumn: "Id",
                keyValue: 6,
                column: "Name",
                value: "Crit DMG");
        }
    }
}
