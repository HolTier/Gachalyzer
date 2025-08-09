using API.Dtos;
using API.Models.GameModels;
using AutoMapper;

namespace API.Mappings
{
    public class GameStatProfile : Profile
    {
        public GameStatProfile()
        {
            CreateMap<GameStat, GameStatDto>()
                .ForMember(dest => dest.GameName, opt => opt.MapFrom(src => src.Game.Name))
                .ForMember(dest => dest.StatTypeName, opt => opt.MapFrom(src => src.StatType.Name));
        }
    }
}
