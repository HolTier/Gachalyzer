namespace API.Dtos
{
    public class GameStatDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;

        public int GameId;
        public string GameName { get; set; } = default!;

        public int StatTypeId { get; set; }
        public string StatTypeName { get; set; } = default!;
    }
}
