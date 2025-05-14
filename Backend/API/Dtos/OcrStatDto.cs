namespace API.Dtos
{
    public enum OcrStatType
    {
        MainStat,
        SubStat,
        Unknown
    }

    public enum GameType
    {
        GenshinImpact,
        WhutheringWaves,
        HonkaiStarRail,
        Unknown
    }

    public class OcrStatDto
    {
        public string Stat { get; set; } = string.Empty;
        public string StatType { get; set; } = OcrStatType.Unknown.ToString();
        public string RawValue { get; set; } = string.Empty;
        public decimal? Value { get; set; }
        public bool IsPercentage { get; set; }
    }
}
