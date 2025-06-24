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
            // Create a resolver based on the game type
            var resolver = _resolverFactory.GetResolver(gameType);
            var result = new List<OcrStatDto>();

            // Process each line to extract stats
            foreach (var line in lines)
            {
                // Skip empty lines
                int lastSpaceIndex = line.LastIndexOf(' ');

                var stat = string.Empty;
                var rawValue = string.Empty;

                // If no space is found, treat the whole line as stat
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

                // Try to parse the numeric value, if it fails, set it to null
                decimal? value = null;
                if (decimal.TryParse(numericValue, System.Globalization.NumberStyles.Number, 
                        System.Globalization.CultureInfo.InvariantCulture, out var parsedValue))
                    value = parsedValue;

                // Normalize the value to 0 if it's null
                decimal normalizedValue = value ?? 0;

                // Determine the stat type and normalized value using the resolver
                var statType = resolver.DetermineStatType(stat, parsedValue, isPercentage, out normalizedValue);

                // If the stat type is unknown, skip it, otherwise add it to the result
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
