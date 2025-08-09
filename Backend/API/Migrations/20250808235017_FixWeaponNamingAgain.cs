using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class FixWeaponNamingAgain : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CharacterGameTypes_Games_GameId",
                table: "CharacterGameTypes");

            migrationBuilder.DropForeignKey(
                name: "FK_Characters_CharacterGameTypes_CharacterGameTypeId",
                table: "Characters");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CharacterGameTypes",
                table: "CharacterGameTypes");

            migrationBuilder.RenameTable(
                name: "CharacterGameTypes",
                newName: "CharacterWeaponTypes");

            migrationBuilder.RenameIndex(
                name: "IX_CharacterGameTypes_GameId",
                table: "CharacterWeaponTypes",
                newName: "IX_CharacterWeaponTypes_GameId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CharacterWeaponTypes",
                table: "CharacterWeaponTypes",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Characters_CharacterWeaponTypes_CharacterGameTypeId",
                table: "Characters",
                column: "CharacterGameTypeId",
                principalTable: "CharacterWeaponTypes",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CharacterWeaponTypes_Games_GameId",
                table: "CharacterWeaponTypes",
                column: "GameId",
                principalTable: "Games",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Characters_CharacterWeaponTypes_CharacterGameTypeId",
                table: "Characters");

            migrationBuilder.DropForeignKey(
                name: "FK_CharacterWeaponTypes_Games_GameId",
                table: "CharacterWeaponTypes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CharacterWeaponTypes",
                table: "CharacterWeaponTypes");

            migrationBuilder.RenameTable(
                name: "CharacterWeaponTypes",
                newName: "CharacterGameTypes");

            migrationBuilder.RenameIndex(
                name: "IX_CharacterWeaponTypes_GameId",
                table: "CharacterGameTypes",
                newName: "IX_CharacterGameTypes_GameId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CharacterGameTypes",
                table: "CharacterGameTypes",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CharacterGameTypes_Games_GameId",
                table: "CharacterGameTypes",
                column: "GameId",
                principalTable: "Games",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Characters_CharacterGameTypes_CharacterGameTypeId",
                table: "Characters",
                column: "CharacterGameTypeId",
                principalTable: "CharacterGameTypes",
                principalColumn: "Id");
        }
    }
}
