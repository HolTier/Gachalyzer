using API.Dtos;

namespace API.StatProcessing
{
    public interface IGameStatResolverFactory
    {
        IGameStatResolver GetResolver(GameType gameType);
    }
}
