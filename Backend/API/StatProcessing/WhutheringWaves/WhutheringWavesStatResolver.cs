﻿using API.Dtos;
using System.Diagnostics;

namespace API.StatProcessing.WhutheringWaves
{
    public class WhutheringWavesStatResolver : IGameStatResolver
    {
        // An array of scales to normalize OCR errors in values.
        private static readonly decimal[] OcrErrorScale = new[]
        {
            100m,
            10m,
            1m,
            1m / 10m,
            1m / 100m,
        };

        public string DetermineStatType(string statName, decimal value, bool isPercentage, out decimal normalized)
        {
            string normalizedStat = statName.ToUpperInvariant();

            if (normalizedStat.Contains("COST"))
            {
                normalized = value;
                return OcrStatType.Cost.ToString();
            }

            var substatValues = new Dictionary<string, decimal[]>
            {
                // Precentage stats
                { "CRIT. RATE%",  new decimal[] { 6.3m, 6.9m, 7.5m, 8.1m, 8.7m, 9.3m, 9.9m, 10.5m } },
                { "CRIT. DMG%", new decimal[] { 12.6m, 12.8m, 15m, 16.2m, 17.4m, 18.6m, 19.8m, 21m } },
                { "ATK%", new decimal[] { 6.4m, 7.1m, 7.9m, 8.6m, 9.4m, 10.1m, 10.9m, 11.9m } },
                { "HP%", new decimal[] { 6.4m, 7.9m, 8.6m, 9.4m, 10.1m, 10.9m, 11.6m } },
                { "DEF%", new decimal[] { 8.1m, 9m, 10m, 11.8m, 12.8m, 13.8m, 14.7m } },
                { "ENERGY REGEN%", new decimal[] { 6.8m, 7.6m, 8.4m, 9.2m, 10m, 10.8m, 11.6m, 12.4m } },
                // DMG Bonus
                { "BASIC ATTACK DMG BONUS%", new decimal[] { 6.4m, 7.1m, 7.9m, 8.6m, 9.4m, 10.1m, 10.9m, 11.9m } },
                { "HEAVY ATTACK DMG BONUS%", new decimal[] { 6.4m, 7.1m, 7.9m, 8.6m, 9.4m, 10.1m, 10.9m, 11.9m } },
                { "RESONANCE SKILL DMG BONUS%", new decimal[] { 6.4m, 7.1m, 7.9m, 8.6m, 9.4m, 10.1m, 10.9m, 11.9m } },
                { "RESONANCE LIBERATION DMG BONUS%", new decimal[] { 6.4m, 7.1m, 7.9m, 8.6m, 9.4m, 10.1m, 10.9m, 11.9m } },
                // Flat stats
                { "HP", new decimal[] { 320m, 360m, 390m, 430m, 470m, 510m, 540m, 580m } },
                { "ATK", new decimal[] { 30m, 40m, 50m, 60m } },
                { "DEF", new decimal[] { 30m, 40m, 50m, 60m } },
            };

            if (isPercentage && !normalizedStat.EndsWith("%"))
                normalizedStat += "%";

            if(TryNormalizeValue(value, substatValues.GetValueOrDefault(normalizedStat, Array.Empty<decimal>()), out normalized))
                return OcrStatType.SubStat.ToString();

            // TODO: Add checks for main stats
            normalized = value;
            return OcrStatType.MainStat.ToString();
        }

        private static bool TryNormalizeValue(decimal originalValue, IEnumerable<decimal> validValues, out decimal normalized)
        {
            foreach (var scale in OcrErrorScale)
            {
                decimal scaled = originalValue * scale;
                if (validValues.Contains(scaled))
                {
                    normalized = scaled;
                    return true;
                }
            }

            normalized = originalValue;
            return false;
        }
    }
}
