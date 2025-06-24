namespace API.StatProcessing
{
    public interface IGameStatResolver
    {
        string DetermineStatType(string statName, decimal value, bool isPercentage, out decimal normalized);
    }
}
