using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class AddImageIconForCharacter : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Characters_Images_ImageId",
                table: "Characters");

            migrationBuilder.AddColumn<int>(
                name: "IconId",
                table: "Characters",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Characters_IconId",
                table: "Characters",
                column: "IconId");

            migrationBuilder.AddForeignKey(
                name: "FK_Characters_Images_IconId",
                table: "Characters",
                column: "IconId",
                principalTable: "Images",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Characters_Images_ImageId",
                table: "Characters",
                column: "ImageId",
                principalTable: "Images",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Characters_Images_IconId",
                table: "Characters");

            migrationBuilder.DropForeignKey(
                name: "FK_Characters_Images_ImageId",
                table: "Characters");

            migrationBuilder.DropIndex(
                name: "IX_Characters_IconId",
                table: "Characters");

            migrationBuilder.DropColumn(
                name: "IconId",
                table: "Characters");

            migrationBuilder.AddForeignKey(
                name: "FK_Characters_Images_ImageId",
                table: "Characters",
                column: "ImageId",
                principalTable: "Images",
                principalColumn: "Id");
        }
    }
}
