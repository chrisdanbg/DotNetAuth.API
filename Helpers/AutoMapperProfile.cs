using System;
using Auth.Data;
using Auth.Dtos;
using AutoMapper;

namespace Auth.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, UserForCreationDto>();
            CreateMap<UserForCreationDto, User>();
        }
    }
}
