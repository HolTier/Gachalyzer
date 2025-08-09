using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class FixNamePending : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Characters_CharacterWeaponTypes_CharacterGameTypeId",
                table: "Characters");

            migrationBuilder.RenameColumn(
                name: "CharacterGameTypeId",
                table: "Characters",
                newName: "CharacterWeaponTypeId");

            migrationBuilder.RenameIndex(
                name: "IX_Characters_CharacterGameTypeId",
                table: "Characters",
                newName: "IX_Characters_CharacterWeaponTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Characters_CharacterWeaponTypes_CharacterWeaponTypeId",
                table: "Characters",
                column: "CharacterWeaponTypeId",
                principalTable: "CharacterWeaponTypes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Characters_CharacterWeaponTypes_CharacterWeaponTypeId",
                table: "Characters");

            migrationBuilder.RenameColumn(
                name: "CharacterWeaponTypeId",
                table: "Characters",
                newName: "CharacterGameTypeId");

            migrationBuilder.RenameIndex(
                name: "IX_Characters_CharacterWeaponTypeId",
                table: "Characters",
                newName: "IX_Characters_CharacterGameTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Characters_CharacterWeaponTypes_CharacterGameTypeId",
                table: "Characters",
                column: "CharacterGameTypeId",
                principalTable: "CharacterWeaponTypes",
                principalColumn: "Id");
        }
    }
}
