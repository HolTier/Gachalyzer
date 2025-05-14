using API.Dtos;

namespace API.Services
{
    public interface IOcrResultProcessor
    {
        List<OcrStatDto> Process(List<string> lines, GameType gameType);
        string WhutheringWavesStatTypeDeterminate(string stat, decimal value, bool isPercentage);
    }
}
