using API.Dtos;
using API.StatProcessing.WhutheringWaves;

namespace API.StatProcessing
{
    public class GameStatResolverFactory : IGameStatResolverFactory
    {
        private readonly IServiceProvider _provider;

        public GameStatResolverFactory(IServiceProvider provider)
        {
            _provider = provider;
        }

        public IGameStatResolver GetResolver(GameType gameType)
        {
            return gameType switch
            {
                GameType.WhutheringWaves => _provider.GetRequiredService<WhutheringWavesStatResolver>(),
                // GameType.Genshin => _provider.GetRequiredService<GenshinStatResolver>(),
                _ => throw new NotSupportedException($"Game type '{gameType}' is not supported")
            };
        }
    }
}
