using API.Dtos;
using AutoMapper;


namespace API.Mappings
{
    public class ImageProfile : Profile
    {
        public ImageProfile()
        {
            CreateMap<API.Models.Image, ImageDto>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src =>
                    src.Characters.FirstOrDefault() != null ? src.Characters.First().Name :
                    src.Weapons.FirstOrDefault() != null ? src.Weapons.First().Name :
                    src.GameArtifactNames.FirstOrDefault() != null ? src.GameArtifactNames.First().Name :
                    null
                ));

            CreateMap<ImageDto, API.Models.Image>()
                .ForMember(dest => dest.Characters, opt => opt.Ignore())
                .ForMember(dest => dest.Weapons, opt => opt.Ignore())
                .ForMember(dest => dest.GameArtifactNames, opt => opt.Ignore())
                .ForMember(dest => dest.ImageStatus, opt => opt.Ignore());
        }
    }
}
