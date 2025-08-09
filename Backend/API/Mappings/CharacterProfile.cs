using API.Dtos;
using API.Models.CharacterModels;
using AutoMapper;

namespace API.Mappings
{
    public class CharacterProfile : Profile
    {
        public CharacterProfile()
        {
            CreateMap<CharacterDto, Character>().ReverseMap();
        }
    }
}
