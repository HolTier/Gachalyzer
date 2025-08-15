using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class FixRelationInTag : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Images_Tags_TagId",
                table: "Images");

            migrationBuilder.DropIndex(
                name: "IX_Images_TagId",
                table: "Images");

            migrationBuilder.DropColumn(
                name: "TagId",
                table: "Images");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TagId",
                table: "Images",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Images_TagId",
                table: "Images",
                column: "TagId");

            migrationBuilder.AddForeignKey(
                name: "FK_Images_Tags_TagId",
                table: "Images",
                column: "TagId",
                principalTable: "Tags",
                principalColumn: "Id");
        }
    }
}
