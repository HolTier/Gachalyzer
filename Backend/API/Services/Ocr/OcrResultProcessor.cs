using System.Diagnostics;
using API.Dtos;
using API.StatProcessing;

namespace API.Services.Ocr
{
    public class OcrResultProcessor : IOcrResultProcessor
    {
        private readonly IGameStatResolverFactory _resolverFactory;

        public OcrResultProcessor(IGameStatResolverFactory resolverFactory)
        {
            _resolverFactory = resolverFactory;
        }

        public List<OcrStatDto> Process(List<string> lines, GameType gameType)
        {
            var resolver = _resolverFactory.GetResolver(gameType);
            var result = new List<OcrStatDto>();

            foreach (var line in lines)
            {
                int lastSpaceIndex = line.LastIndexOf(' ');

                var stat = string.Empty;
                var rawValue = string.Empty;

                if (lastSpaceIndex > 0)
                {
                    stat = line.Substring(0, lastSpaceIndex).Trim();
                    rawValue = line.Substring(lastSpaceIndex + 1).Trim();
                }
                else
                {
                    stat = line.Trim();
                }

                bool isPercentage = rawValue.EndsWith("%");
                string numericValue = isPercentage ? rawValue.TrimEnd('%') : rawValue;

                decimal? value = null;
                if (decimal.TryParse(numericValue, System.Globalization.NumberStyles.Number, 
                        System.Globalization.CultureInfo.InvariantCulture, out var parsedValue))
                    value = parsedValue;

                decimal normalizedValue = value ?? 0;

                var statType = resolver.DetermineStatType(stat, parsedValue, isPercentage, out normalizedValue);

                result.Add(new OcrStatDto
                {
                    Stat = stat,
                    StatType = statType,
                    RawValue = rawValue,
                    Value = normalizedValue,
                    IsPercentage = isPercentage,
                });
            }

            return result;
        }
    }
}
