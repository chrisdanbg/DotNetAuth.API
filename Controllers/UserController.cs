using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http.Cors;
using Auth.Data;
using Auth.Dtos;
using Auth.Helpers;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Auth.Controllers
{
    [Authorize, ApiController, Route("[controller]")]
    public class UserController : ControllerBase
    {
        private IUserService _repo;
        private IMapper _mapper;
        private AppSettings _appSettings;

        public UserController(IUserService repo, IMapper mapper, IOptions<AppSettings> appSettings)
        {
            _repo = repo;
            _mapper = mapper;
            _appSettings = appSettings.Value;
        }

        public SigningCredentials SigningCredentials { get; private set; }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody]UserForCreationDto userForCreationDto)
        {
            var user = await _repo.Authenticate(userForCreationDto.Username, userForCreationDto.Password);

            if (user == null)
                return BadRequest(new { message = "Username or password is incorrect" });

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new System.Security.Claims.ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Id.ToString())
                }),
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha512Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new
            {
                user.Id,
                user.Username,
                Token = tokenString
            });
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody]UserForCreationDto userForCreationDto)
        {
            userForCreationDto.Username = userForCreationDto.Username.ToLower();

            var user = _mapper.Map<User>(userForCreationDto);

            var createdUser = await _repo.Create(user, userForCreationDto.Password);
            return Ok(createdUser);
        }

    }


}
