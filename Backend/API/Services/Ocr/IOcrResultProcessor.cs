using API.Dtos;

namespace API.Services.Ocr
{
    public interface IOcrResultProcessor
    {
        List<OcrStatDto> Process(List<string> lines, GameType gameType);
    }
}
